import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  CreditWallet,
  CreditTransaction,
  BrandKit,
  Ad,
  GenerationJob,
  Plan,
  Dialect,
  ScriptText,
  AdType,
  AspectRatio,
  FreeToolsUsage
} from '../types';
import {
  INITIAL_USER,
  PLANS,
  INITIAL_BRAND_KITS,
  INITIAL_ADS
} from '../data/mockInitialData';
import { CreditWalletService } from '../services/credits/creditWalletService';
import { VideoGenerationProvider } from '../services/ai-gateway/videoGenerationProvider';
import { ImageGenerationProvider } from '../services/ai-gateway/imageGenerationProvider';
import { FreeToolsProvider } from '../services/ai-gateway/freeToolsProvider';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message: string;
  createdAt: string;
  adId?: string;
}

interface AppContextType {
  user: User;
  currentPlan: Plan;
  wallet: CreditWallet;
  transactions: CreditTransaction[];
  brandKits: BrandKit[];
  activeBrandKit: BrandKit | null;
  ads: Ad[];
  jobs: Record<string, GenerationJob>;
  notifications: Notification[];
  freeToolsUsage: FreeToolsUsage;
  simulateAiFailure: boolean;
  activeTab: 'create' | 'my_ads' | 'free_tools' | 'brand_kits' | 'wallet_plans' | 'quickstart_tester';
  selectedAdForPreview: Ad | null;

  // Actions
  setActiveTab: (tab: 'create' | 'my_ads' | 'free_tools' | 'brand_kits' | 'wallet_plans' | 'quickstart_tester') => void;
  setSelectedAdForPreview: (ad: Ad | null) => void;
  setActiveBrandKit: (kit: BrandKit | null) => void;
  setSimulateAiFailure: (simulate: boolean) => void;
  dismissNotification: (id: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt'>) => void;

  // Generation & Core Flows
  initiateAdGeneration: (params: {
    productName: string;
    sourceImageUrl: string;
    type: AdType;
    dialect: Dialect;
    scriptText: ScriptText;
    aspectRatio: AspectRatio;
    brandKitId: string | null;
    videoDurationSeconds?: number;
  }) => Promise<{ success: boolean; adId?: string; error?: string }>;

  retryAdGeneration: (adId: string) => Promise<void>;
  saveBrandKit: (kit: Omit<BrandKit, 'id' | 'user_id'> & { id?: string }) => void;
  deleteBrandKit: (id: string) => void;
  topUpCredits: (amount: number, reason: string) => void;
  selectPlan: (planId: string) => void;
  useFreeTool: (toolType: 'background_removal' | 'upscale') => { allowed: boolean; remaining: number; error?: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('ai_ads_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [currentPlan, setCurrentPlan] = useState<Plan>(() => {
    return PLANS.find((p) => p.id === user.plan_id) || PLANS[0];
  });

  const [wallet, setWallet] = useState<CreditWallet>(() => {
    return CreditWalletService.getWallet(user.id);
  });

  const [transactions, setTransactions] = useState<CreditTransaction[]>(() => {
    return CreditWalletService.getTransactions(wallet.id);
  });

  const [brandKits, setBrandKits] = useState<BrandKit[]>(() => {
    try {
      const saved = localStorage.getItem('ai_ads_brand_kits');
      return saved ? JSON.parse(saved) : INITIAL_BRAND_KITS;
    } catch {
      return INITIAL_BRAND_KITS;
    }
  });

  const [activeBrandKit, setActiveBrandKit] = useState<BrandKit | null>(() => brandKits[0] || null);

  const [ads, setAds] = useState<Ad[]>(() => {
    try {
      const saved = localStorage.getItem('ai_ads_list');
      return saved ? JSON.parse(saved) : INITIAL_ADS;
    } catch {
      return INITIAL_ADS;
    }
  });

  const [jobs, setJobs] = useState<Record<string, GenerationJob>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [freeToolsUsage, setFreeToolsUsage] = useState<FreeToolsUsage>(() => FreeToolsProvider.getUsage());
  const [simulateAiFailure, setSimulateAiFailure] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'create' | 'my_ads' | 'free_tools' | 'brand_kits' | 'wallet_plans' | 'quickstart_tester'>('create');
  const [selectedAdForPreview, setSelectedAdForPreview] = useState<Ad | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_ads_list', JSON.stringify(ads));
    } catch {}
  }, [ads]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_ads_brand_kits', JSON.stringify(brandKits));
    } catch {}
  }, [brandKits]);

  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random()}`,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Auto dismiss after 7 seconds
    setTimeout(() => {
      dismissNotification(newNotif.id);
    }, 7000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const refreshWalletAndTx = (updatedWallet: CreditWallet) => {
    setWallet(updatedWallet);
    setTransactions(CreditWalletService.getTransactions(updatedWallet.id));
  };

  /**
   * Primary asynchronous ad generation flow:
   * 1. Validates cost: 5 credits for video, 2 credits for image.
   * 2. Deducts credit first (Constitution Principle IV).
   * 3. Sets Ad status to 'queued' immediately without blocking UI.
   * 4. Dispatches background worker simulation.
   * 5. If fails, automatically refunds credits (FR-014).
   * 6. Dispatches notification on completion.
   */
  const initiateAdGeneration = async (params: {
    productName: string;
    sourceImageUrl: string;
    type: AdType;
    dialect: Dialect;
    scriptText: ScriptText;
    aspectRatio: AspectRatio;
    brandKitId: string | null;
    videoDurationSeconds?: number;
  }): Promise<{ success: boolean; adId?: string; error?: string }> => {
    const requiredCredits = params.type === 'video' ? 5 : 2;
    const adId = `ad_${Date.now()}`;

    // 1. Credit deduction
    const deductRes = CreditWalletService.deductForGeneration(
      wallet,
      requiredCredits,
      adId,
      `خصم لتوليد إعلان ${params.type === 'video' ? 'فيديو' : 'صورة'} لمنتج "${params.productName}"`
    );

    if (!deductRes.success) {
      addNotification({
        type: 'error',
        title: 'رصيد غير كافٍ',
        message: deductRes.error || 'عفواً، رصيدك الحالي لا يكفي لإتمام هذه العملية.'
      });
      return { success: false, error: deductRes.error };
    }

    refreshWalletAndTx(deductRes.newWallet);

    // 2. Create queued Ad
    const newAd: Ad = {
      id: adId,
      user_id: user.id,
      brand_kit_id: params.brandKitId,
      product_name: params.productName,
      source_image_url: params.sourceImageUrl,
      type: params.type,
      dialect: params.dialect,
      script_text: params.scriptText,
      status: 'queued',
      output_url: null,
      credits_spent: requiredCredits,
      aspect_ratio: params.aspectRatio,
      video_duration_seconds: params.type === 'video' ? params.videoDurationSeconds || 15 : 0,
      created_at: new Date().toISOString()
    };

    setAds((prev) => [newAd, ...prev]);

    addNotification({
      type: 'info',
      title: 'بدأت عملية التوليد في الخلفية',
      message: `تم خصم ${requiredCredits} كريدت بنجاح. يمكنك مواصلة التصفح بينما يكتمل توليد إعلانك.`,
      adId
    });

    // 3. Launch async background job (non-blocking!)
    runAsyncJob(newAd, simulateAiFailure);

    return { success: true, adId };
  };

  const runAsyncJob = async (targetAd: Ad, shouldFail: boolean) => {
    // Transition to 'processing'
    setAds((prev) =>
      prev.map((a) => (a.id === targetAd.id ? { ...a, status: 'processing' } : a))
    );

    const updateJobProgress = (job: GenerationJob) => {
      setJobs((prev) => ({ ...prev, [targetAd.id]: job }));
    };

    let result;
    if (targetAd.type === 'video') {
      result = await VideoGenerationProvider.startVideoGeneration(targetAd, shouldFail, updateJobProgress);
    } else {
      result = await ImageGenerationProvider.startImageGeneration(targetAd, shouldFail, updateJobProgress);
    }

    if (result.success) {
      // Completed successfully
      setAds((prev) =>
        prev.map((a) =>
          a.id === targetAd.id
            ? {
                ...a,
                status: 'done',
                output_url: result.outputUrl || a.source_image_url
              }
            : a
        )
      );

      addNotification({
        type: 'success',
        title: '🎉 إعلانك جاهز الآن!',
        message: `تم الانتهاء من توليد إعلان "${targetAd.product_name}". يمكنك الآن معاينته وتنزيله بمقاسات مختلفة.`,
        adId: targetAd.id
      });
    } else {
      // Failed: trigger automatic refund (FR-014)
      const currentWlt = CreditWalletService.getWallet(user.id);
      const refundRes = CreditWalletService.refundFailedGeneration(
        currentWlt,
        targetAd.credits_spent,
        targetAd.id,
        result.error || 'فشل مزوّد الذكاء الاصطناعي أثناء المعالجة'
      );

      refreshWalletAndTx(refundRes.newWallet);

      setAds((prev) =>
        prev.map((a) =>
          a.id === targetAd.id
            ? {
                ...a,
                status: 'failed',
                failure_reason: result.error
              }
            : a
        )
      );

      addNotification({
        type: 'warning',
        title: 'حدث خطأ وتم استرجاع الكريدت تلقائياً (FR-014)',
        message: `فشلت معالجة الإعلان بسبب خطأ في المزوّد، وتمت إعادة ${targetAd.credits_spent} كريدت فوراً إلى رصيدك.`,
        adId: targetAd.id
      });
    }
  };

  const retryAdGeneration = async (adId: string) => {
    const targetAd = ads.find((a) => a.id === adId);
    if (!targetAd) return;

    // Retry charges again only if previously refunded
    await initiateAdGeneration({
      productName: targetAd.product_name,
      sourceImageUrl: targetAd.source_image_url,
      type: targetAd.type,
      dialect: targetAd.dialect,
      scriptText: targetAd.script_text,
      aspectRatio: targetAd.aspect_ratio,
      brandKitId: targetAd.brand_kit_id,
      videoDurationSeconds: targetAd.video_duration_seconds
    });
  };

  const saveBrandKit = (kitData: Omit<BrandKit, 'id' | 'user_id'> & { id?: string }) => {
    if (kitData.id) {
      setBrandKits((prev) =>
        prev.map((k) => (k.id === kitData.id ? { ...k, ...kitData } : k))
      );
    } else {
      const newKit: BrandKit = {
        ...kitData,
        id: `bk_${Date.now()}`,
        user_id: user.id
      };
      setBrandKits((prev) => [newKit, ...prev]);
      if (!activeBrandKit) setActiveBrandKit(newKit);
    }

    addNotification({
      type: 'success',
      title: 'تم حفظ هوية العلامة',
      message: 'سيتم تطبيق الشعار والألوان على إعلاناتك القادمة تلقائياً.'
    });
  };

  const deleteBrandKit = (id: string) => {
    setBrandKits((prev) => prev.filter((k) => k.id !== id));
    if (activeBrandKit?.id === id) {
      setActiveBrandKit(brandKits.find((k) => k.id !== id) || null);
    }
  };

  const topUpCredits = (amount: number, reason: string) => {
    const updated = CreditWalletService.addCredits(wallet, amount, reason);
    refreshWalletAndTx(updated.newWallet);
    addNotification({
      type: 'success',
      title: 'تمت إضافة الكريدت بنجاح',
      message: `أصبح رصيدك الآن: ${updated.newWallet.balance} كريدت.`
    });
  };

  const selectPlan = (planId: string) => {
    const target = PLANS.find((p) => p.id === planId);
    if (!target) return;
    setCurrentPlan(target);
    const updatedUser = { ...user, plan_id: planId };
    setUser(updatedUser);
    localStorage.setItem('ai_ads_user', JSON.stringify(updatedUser));

    // Credit bonus from plan
    if (target.monthly_credits > 0) {
      topUpCredits(target.monthly_credits, `ترقية الاشتراك إلى: ${target.nameAr}`);
    }
  };

  const useFreeTool = (toolType: 'background_removal' | 'upscale') => {
    const check = FreeToolsProvider.checkToolCap(toolType, currentPlan.free_tool_usage_cap);
    if (!check.allowed) {
      addNotification({
        type: 'warning',
        title: 'تنبيه انتهاء الحد المجاني (Scenario 5)',
        message: check.error || 'تم استنفاد الحد المجاني لهذه الأداة.'
      });
      return check;
    }

    const newUsage = FreeToolsProvider.incrementUsage(toolType);
    setFreeToolsUsage(newUsage);
    return {
      allowed: true,
      remaining: currentPlan.free_tool_usage_cap - (toolType === 'background_removal' ? newUsage.background_removal_count : newUsage.upscale_count)
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentPlan,
        wallet,
        transactions,
        brandKits,
        activeBrandKit,
        ads,
        jobs,
        notifications,
        freeToolsUsage,
        simulateAiFailure,
        activeTab,
        selectedAdForPreview,
        setActiveTab,
        setSelectedAdForPreview,
        setActiveBrandKit,
        setSimulateAiFailure,
        dismissNotification,
        addNotification,
        initiateAdGeneration,
        retryAdGeneration,
        saveBrandKit,
        deleteBrandKit,
        topUpCredits,
        selectPlan,
        useFreeTool
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

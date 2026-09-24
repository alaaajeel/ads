import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Coins,
  Video,
  FolderOpen,
  Wand2,
  Palette,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    wallet,
    currentPlan,
    activeTab,
    setActiveTab,
    simulateAiFailure,
    setSimulateAiFailure,
    brandKits,
    activeBrandKit,
    setActiveBrandKit
  } = useApp();

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      {/* Top Banner for Test Simulation Mode if active */}
      {simulateAiFailure && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>وضع محاكاة الفشل (FR-014) مفعّل:</strong> سيفشل توليد الإعلان القادم عمداً للتحقق من استرجاع الكريدت التلقائي إلى رصيدك.
            </span>
            <button
              onClick={() => setSimulateAiFailure(false)}
              className="underline hover:text-amber-100 font-bold ml-2 cursor-pointer"
            >
              تعطيل المحاكاة
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                إعلانات AI
              </h1>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                عربي 100%
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              صانع إعلانات الفيديو والصور الذكي للمتاجر والمشاريع العربية
            </p>
          </div>
        </div>

        {/* Brand Kit Switcher (Agency Multi-Client support FR-016) */}
        {brandKits.length > 0 && (
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">العلامة الحالية:</span>
            <select
              value={activeBrandKit?.id || ''}
              onChange={(e) => {
                const found = brandKits.find((k) => k.id === e.target.value);
                setActiveBrandKit(found || null);
              }}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {brandKits.map((kit) => (
                <option key={kit.id} value={kit.id} className="bg-slate-900 text-slate-200">
                  {kit.client_name ? `${kit.name} (${kit.client_name})` : kit.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* User Credit Wallet & Plan Badge */}
        <div className="flex items-center gap-2.5">
          {/* Credit Wallet Button */}
          <button
            onClick={() => setActiveTab('wallet_plans')}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-orange-500/10 border border-amber-500/30 hover:border-amber-500/60 px-3.5 py-1.5 rounded-xl transition cursor-pointer group"
            title="انقر لإدارة رصيد الكريدت وتفاصيل الحركات"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-300">الرصيد المتاح</div>
              <div className="text-sm font-black text-amber-400 group-hover:text-amber-300">
                {wallet.balance} <span className="text-xs font-normal">كريدت</span>
              </div>
            </div>
          </button>

          {/* Plan badge */}
          <div className="hidden sm:flex flex-col items-end text-xs bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400 text-[10px]">الباقة الحالية</span>
            <span className="font-bold text-slate-200">{currentPlan.nameAr}</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1 border-t border-slate-800/60 text-sm">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'create'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>إنشاء إعلان جديد</span>
        </button>

        <button
          onClick={() => setActiveTab('my_ads')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'my_ads'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>إعلاناتي والأرشيف</span>
        </button>

        <button
          onClick={() => setActiveTab('free_tools')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'free_tools'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>الأدوات المجانية</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
            مجاناً
          </span>
        </button>

        <button
          onClick={() => setActiveTab('brand_kits')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'brand_kits'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>هوية العلامة (Brand Kit)</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet_plans')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 cursor-pointer ${
            activeTab === 'wallet_plans'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>المحفظة والباقات</span>
        </button>

        <button
          onClick={() => setActiveTab('quickstart_tester')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 cursor-pointer mr-auto ${
            activeTab === 'quickstart_tester'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-indigo-300 hover:text-white hover:bg-indigo-950/40 border border-indigo-900/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>فحص Quickstart (معايير القبول الـ 9)</span>
        </button>
      </div>
    </header>
  );
};

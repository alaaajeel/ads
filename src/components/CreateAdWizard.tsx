import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DIALECTS, DEMO_PRODUCTS, TEMPLATES } from '../data/mockInitialData';
import { Dialect, AdType, AspectRatio, ScriptText } from '../types';
import { ScriptAnalysisProvider } from '../services/ai-gateway/scriptAnalysisProvider';
import { ArabicTTSProvider } from '../services/ai-gateway/arabicTTSProvider';
import {
  Sparkles,
  Upload,
  Video,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  CheckCircle2,
  Coins,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Edit3,
  Layers,
  Clock,
  Smartphone,
  Square,
  Monitor,
  AlertCircle
} from 'lucide-react';

export const CreateAdWizard: React.FC = () => {
  const {
    wallet,
    activeBrandKit,
    brandKits,
    initiateAdGeneration,
    setActiveTab,
    simulateAiFailure,
    setSimulateAiFailure
  } = useApp();

  // Wizard state: 1 = Upload, 2 = Script & Dialect, 3 = Format & Confirm
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form inputs
  const [productName, setProductName] = useState('عطر مسك ملكي فاخر');
  const [sourceImageUrl, setSourceImageUrl] = useState(DEMO_PRODUCTS[0].imageUrl);
  const [adType, setAdType] = useState<AdType>('video');
  const [selectedDialect, setSelectedDialect] = useState<Dialect>('gulf');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [videoDuration, setVideoDuration] = useState<number>(15);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl_store');
  const [selectedBrandKitId, setSelectedBrandKitId] = useState<string>(activeBrandKit?.id || '');

  // Script state (Hook + Body + CTA)
  const [script, setScript] = useState<ScriptText>({
    hook: DEMO_PRODUCTS[0].suggestedHook,
    body: DEMO_PRODUCTS[0].suggestedBody,
    cta: DEMO_PRODUCTS[0].suggestedCta
  });

  // UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConfirmingCredit, setIsConfirmingCredit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image upload from file or demo selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSourceImageUrl(event.target.result as string);
          setProductName(file.name.replace(/\.[^/.]+$/, ''));
          // Trigger vision analysis
          triggerVisionAnalysis(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectDemoProduct = (p: typeof DEMO_PRODUCTS[0]) => {
    setProductName(p.name);
    setSourceImageUrl(p.imageUrl);
    setScript({
      hook: p.suggestedHook,
      body: p.suggestedBody,
      cta: p.suggestedCta
    });
  };

  // Step 2 Trigger: Analyze Image & Generate Script (FR-002)
  const triggerVisionAnalysis = async (imgUrl: string, name: string) => {
    setIsAnalyzing(true);
    try {
      const generatedScript = await ScriptAnalysisProvider.analyzeProductImage(
        imgUrl,
        name,
        selectedDialect
      );
      setScript(generatedScript);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Audio Preview (FR-005)
  const handleToggleVoicePreview = () => {
    if (isSpeaking) {
      ArabicTTSProvider.stop();
      setIsSpeaking(false);
    } else {
      const fullText = `${script.hook}. ${script.body}. ${script.cta}`;
      setIsSpeaking(true);
      ArabicTTSProvider.speak(fullText, selectedDialect, () => {
        setIsSpeaking(false);
      });
    }
  };

  const requiredCredits = adType === 'video' ? 5 : 2;

  // Final confirmation & submit (FR-003, FR-010)
  const handleConfirmAndGenerate = async () => {
    setIsSubmitting(true);
    try {
      const res = await initiateAdGeneration({
        productName,
        sourceImageUrl,
        type: adType,
        dialect: selectedDialect,
        scriptText: script,
        aspectRatio,
        brandKitId: selectedBrandKitId || null,
        videoDurationSeconds: videoDuration
      });

      if (res.success) {
        setIsConfirmingCredit(false);
        setActiveTab('my_ads');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Wizard Progress Steps Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 right-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                step >= 1
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              1
            </div>
            <span className="text-xs font-semibold text-slate-300 mt-1.5">صورة المنتج</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                step >= 2
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              2
            </div>
            <span className="text-xs font-semibold text-slate-300 mt-1.5">السيناريو واللهجة</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                step >= 3
                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              3
            </div>
            <span className="text-xs font-semibold text-slate-300 mt-1.5">المقاس وتأكيد الكريدت</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Upload or Choose Demo Product */}
      {step === 1 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-xl">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white mb-2">
              الخطوة 1: ارفع صورة لمنتجك
            </h2>
            <p className="text-sm text-slate-400">
              صورة واحدة واضحة تكفي، وسيتكفل الذكاء الاصطناعي بتحليلها وصياغة السيناريو الإعلاني تلقائياً.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Upload Area */}
            <div>
              <label
                htmlFor="image-upload"
                className="group border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-950/40 hover:bg-slate-800/40 h-72"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:scale-110 flex items-center justify-center mb-4 transition border border-amber-500/20">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-200 mb-1">اسحب الصورة هنا أو اضغط للرفع</h4>
                <p className="text-xs text-slate-400 mb-3">يدعم صيغ JPG، PNG، WebP حتى 10MB</p>
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  تصفح الملفات من جهازك
                </span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  اسم أو وصف المنتج (اختياري لتحسين التحليل):
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="مثال: عطر مسك ملكي فاخر"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Selected Image Preview & Demo Products */}
            <div className="flex flex-col">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center h-56 relative overflow-hidden mb-4">
                <img
                  src={sourceImageUrl}
                  alt={productName}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                />
                <span className="absolute bottom-2 right-2 text-[10px] bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  معاينة الصورة المحددة
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2">
                  أو جرّب أحد المنتجات الجاهزة السريعة:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_PRODUCTS.map((demo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDemoProduct(demo)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-right transition cursor-pointer ${
                        sourceImageUrl === demo.imageUrl
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={demo.imageUrl}
                        alt={demo.name}
                        className="w-9 h-9 object-cover rounded-lg shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-200 truncate">{demo.name}</div>
                        <div className="text-[10px] text-slate-400">{demo.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                triggerVisionAnalysis(sourceImageUrl, productName);
                setStep(2);
              }}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              <span>متابعة لتحليل السيناريو</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Script Review & Dialect Selection (FR-002, FR-003, FR-005) */}
      {step === 2 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <span>الخطوة 2: مراجعة السيناريو واختيار اللهجة</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                يقترح الذكاء الاصطناعي هيكلاً تسويقياً مجرباً (Hook + جسم الرسالة + دعوة لإجراء). يمكنك التعديل مباشرة!
              </p>
            </div>

            <button
              type="button"
              onClick={() => triggerVisionAnalysis(sourceImageUrl, productName)}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>إعادة صياغة السيناريو</span>
            </button>
          </div>

          {/* Dialect Selector (FR-005) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300">
                اختر اللهجة العربية للصوت والتعليق:
              </label>
              <button
                type="button"
                onClick={handleToggleVoicePreview}
                className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'إيقاف المعاينة الصوتية' : 'استمع لصوت اللهجة'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {DIALECTS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setSelectedDialect(d.id);
                    triggerVisionAnalysis(sourceImageUrl, productName);
                  }}
                  className={`p-3 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                    selectedDialect === d.id
                      ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">{d.flag}</span>
                    {selectedDialect === d.id && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                    )}
                  </div>
                  <div className="font-bold text-xs text-slate-100 mb-0.5">{d.nameAr}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-2">{d.accentCharacteristics}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Editable Script Inputs (FR-003) */}
          <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  1. الخطفة البصرية والنصية (Hook - أول 3 ثوانٍ)
                </label>
                <span className="text-[10px] text-slate-400">لجذب انتباه المشاهد في التيك توك وريلز</span>
              </div>
              <input
                type="text"
                value={script.hook}
                onChange={(e) => setScript({ ...script, hook: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  2. جسم الرسالة التسويقية (Body - مميزات وحل المشكلة)
                </label>
                <span className="text-[10px] text-slate-400">المواصفات والضمان وإقناع العميل</span>
              </div>
              <textarea
                rows={2}
                value={script.body}
                onChange={(e) => setScript({ ...script, body: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  3. الدعوة لاتخاذ إجراء (Call to Action - CTA)
                </label>
                <span className="text-[10px] text-slate-400">تحفيز الشراء المباشر والطلب</span>
              </div>
              <input
                type="text"
                value={script.cta}
                onChange={(e) => setScript({ ...script, cta: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للصورة</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>متابعة لتحديد المقاس وتأكيد التكلفة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Ad Format, Aspect Ratio & Explicit Credit Confirmation (FR-004, FR-006, FR-010) */}
      {step === 3 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-xl">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white mb-2">
              الخطوة 3: تحديد نوع الإعلان والمقاس وتأكيد الرصيد
            </h2>
            <p className="text-sm text-slate-400">
              اختر نوع المحتوى والمنصة المناسبة لحملتك الإعلانية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Ad Type Selector */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-300 block">نوع الإعلان:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdType('video')}
                  className={`p-4 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                    adType === 'video'
                      ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Video className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                      5 كريدت
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white">إعلان فيديو متحرك</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    مشاهد سينمائية + تعليق صوتي عربي + مؤثرات
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAdType('static_image')}
                  className={`p-4 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                    adType === 'static_image'
                      ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                      2 كريدت
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white">إعلان صورة ثابتة</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    تصميم احترافي جاهز للنشر (بوست/ستوري)
                  </div>
                </button>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">مقاس المنصة:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      aspectRatio === '9:16'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                    <div className="text-xs font-bold text-slate-100">9:16 طولي</div>
                    <div className="text-[10px] text-slate-400">تيك توك وريلز</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('1:1')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      aspectRatio === '1:1'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <Square className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                    <div className="text-xs font-bold text-slate-100">1:1 مربع</div>
                    <div className="text-[10px] text-slate-400">إنستغرام وفيسبوك</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      aspectRatio === '16:9'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <Monitor className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                    <div className="text-xs font-bold text-slate-100">16:9 عريض</div>
                    <div className="text-[10px] text-slate-400">يوتيوب وبنرات</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary & Brand Kit Selection */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-200 text-sm mb-3">ملخص طلب التوليد:</h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">المنتج:</span>
                    <span className="font-semibold text-slate-200">{productName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">نوع الإعلان:</span>
                    <span className="font-semibold text-amber-400">
                      {adType === 'video' ? 'فيديو سينمائي بالذكاء الاصطناعي' : 'تصميم بوست ترويجي'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">اللهجة المعتمدة:</span>
                    <span className="font-semibold text-slate-200">
                      {DIALECTS.find((d) => d.id === selectedDialect)?.nameAr}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">الهوية المطبقة:</span>
                    <span className="font-semibold text-slate-200">
                      {brandKits.find((k) => k.id === selectedBrandKitId)?.name || 'الهوية الافتراضية'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">رصيدك الحالي:</span>
                    <span className="font-bold text-slate-200">{wallet.balance} كريدت</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm font-extrabold text-amber-400">
                    <span>التكلفة المطلوبة:</span>
                    <span>{requiredCredits} كريدت</span>
                  </div>
                </div>
              </div>

              {/* Edge Case Simulation Toggle (FR-014 testing) */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={simulateAiFailure}
                    onChange={(e) => setSimulateAiFailure(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>
                    محاكاة فشل مزوّد AI لاختبار الاسترجاع التلقائي للكريدت (FR-014)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للسيناريو</span>
            </button>

            {/* Explicit Credit Deduction Confirmation (FR-010) */}
            <button
              onClick={() => setIsConfirmingCredit(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer text-base"
            >
              <Coins className="w-5 h-5" />
              <span>تأكيد التوليد (خصم {requiredCredits} كريدت)</span>
            </button>
          </div>
        </div>
      )}

      {/* EXPLICIT CONFIRMATION MODAL (FR-010) */}
      {isConfirmingCredit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <Coins className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">تأكيد خصم الكريدت</h3>
            <p className="text-sm text-slate-300 mb-4">
              سيتم خصم <span className="font-bold text-amber-400">{requiredCredits} كريدت</span> من محفظتك لبدء توليد إعلان{' '}
              {adType === 'video' ? 'الفيديو' : 'الصورة'}.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs mb-6 text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>الرصيد قبل العملية:</span>
                <span className="font-bold">{wallet.balance} كريدت</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>الرصيد بعد الخصم:</span>
                <span className="font-bold">{wallet.balance - requiredCredits} كريدت</span>
              </div>
              <div className="text-[11px] text-emerald-400 pt-1 border-t border-slate-800/80 text-right">
                ✓ متوافق مع FR-014: في حال حدوث أي خطأ تقني، سيُسترجع الكريدت تلقائياً فوراً.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmingCredit(false)}
                disabled={isSubmitting}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmAndGenerate}
                disabled={isSubmitting}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارٍ الخصم...</span>
                  </>
                ) : (
                  <span>نعم، ابدأ التوليد</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

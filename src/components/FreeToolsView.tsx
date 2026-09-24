import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_PRODUCTS } from '../data/mockInitialData';
import {
  Wand2,
  Scissors,
  Sparkles,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Sliders
} from 'lucide-react';

export const FreeToolsView: React.FC = () => {
  const { currentPlan, freeToolsUsage, useFreeTool, setActiveTab } = useApp();

  const [activeTool, setActiveTool] = useState<'background_removal' | 'upscale'>('background_removal');
  const [selectedImage, setSelectedImage] = useState<string>(DEMO_PRODUCTS[0].imageUrl);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<string | null>(null);
  const [capError, setCapError] = useState<string | null>(null);
  const [upscaleComparisonSlider, setUpscaleComparisonSlider] = useState<number>(50);

  const monthlyCap = currentPlan.free_tool_usage_cap;
  const currentUsage =
    activeTool === 'background_removal'
      ? freeToolsUsage.background_removal_count
      : freeToolsUsage.upscale_count;

  const remaining = Math.max(0, monthlyCap - currentUsage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSelectedImage(ev.target.result as string);
          setProcessedResult(null);
          setCapError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunTool = async () => {
    setCapError(null);

    // 1. Check & increment usage cap
    const check = useFreeTool(activeTool);
    if (!check.allowed) {
      setCapError(check.error || 'لقد وصلت للحد المجاني الشهري.');
      return;
    }

    setIsProcessing(true);
    setProcessedResult(null);

    try {
      // Simulate intelligent background removal or super-resolution
      await new Promise((r) => setTimeout(r, 1400));
      // For background removal, return image with transparent canvas simulated indicator
      setProcessedResult(selectedImage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!processedResult) return;
    const link = document.createElement('a');
    link.href = processedResult;
    link.download = `${activeTool === 'background_removal' ? 'transparent_product.png' : 'upscaled_product_4k.png'}`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header & Cap Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-extrabold text-white">الأدوات الذكية المجانية</h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              تجدد شهرياً
            </span>
          </div>
          <p className="text-sm text-slate-400">
            أدوات مساعدة لتجهيز صور منتجاتك قبل إدخالها في إعلانات الفيديو والصور.
          </p>
        </div>

        {/* Usage Tracker Pill */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-semibold">استخدامك الشهري للأداة:</div>
            <div className="text-sm font-extrabold text-white">
              {currentUsage} <span className="text-slate-400 font-normal">/ {monthlyCap} عمليات</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-amber-400 border border-slate-700">
            {remaining}
            <span className="text-[9px] block text-slate-400 font-normal">متبقي</span>
          </div>
        </div>
      </div>

      {/* Cap Reached Warning Banner (Acceptance Scenario 5) */}
      {remaining === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-300 text-sm">
                لقد استنفدت الحد المجاني الشهري لباقة {currentPlan.nameAr}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                يمكنك الترقية إلى باقة أعلى للحصول على سقف استخدام أوسع، أو متابعة إنشاء وتوليد الإعلانات بشكل طبيعي برصيدك الحالي دون أي تعطيل لباقي الميزات (FR-007 / FR-008).
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('wallet_plans')}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow shrink-0 cursor-pointer"
          >
            <span>ترقية الباقة الآن</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg">
        <button
          onClick={() => {
            setActiveTool('background_removal');
            setProcessedResult(null);
            setCapError(null);
          }}
          className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition cursor-pointer ${
            activeTool === 'background_removal'
              ? 'border-amber-500 bg-amber-500/15 text-amber-400'
              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>أداة إزالة الخلفية (Cutout)</span>
        </button>

        <button
          onClick={() => {
            setActiveTool('upscale');
            setProcessedResult(null);
            setCapError(null);
          }}
          className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition cursor-pointer ${
            activeTool === 'upscale'
              ? 'border-amber-500 bg-amber-500/15 text-amber-400'
              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>أداة تحسين الدقة (Super Resolution)</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Input & Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold text-white text-base mb-4">
            {activeTool === 'background_removal'
              ? 'رفع صورة المنتج لإزالة الخلفية'
              : 'رفع صورة المنتج لرفع الدقة ومضاعفة الجودة'}
          </h3>

          <label
            htmlFor="tool-image-input"
            className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-950/40 hover:bg-slate-800/40 h-52 mb-4"
          >
            <Upload className="w-8 h-8 text-amber-400 mb-2" />
            <span className="text-xs font-bold text-slate-200 mb-1">اختر صورة من جهازك</span>
            <span className="text-[10px] text-slate-400">يدعم صيغ PNG و JPG حتى 15MB</span>
            <input
              id="tool-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-400 block mb-2">أو اختر صورة جاهزة:</span>
            <div className="grid grid-cols-4 gap-2">
              {DEMO_PRODUCTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(p.imageUrl);
                    setProcessedResult(null);
                    setCapError(null);
                  }}
                  className={`rounded-lg overflow-hidden border transition cursor-pointer aspect-square ${
                    selectedImage === p.imageUrl ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-800'
                  }`}
                >
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRunTool}
            disabled={isProcessing}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جارٍ المعالجة بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>
                  {activeTool === 'background_removal' ? 'عزل الخلفية فوراً (مجاناً)' : 'مضاعفة الجودة بدقة 4K (مجاناً)'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right: Output Preview */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base">معاينة النتيجة:</h3>
              {processedResult && (
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>اكتملت المعالجة</span>
                </span>
              )}
            </div>

            {/* Display Area */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 h-72 overflow-hidden flex items-center justify-center">
              {activeTool === 'background_removal' ? (
                // Background removal preview with checkerboard transparency pattern
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  {processedResult && (
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
                        backgroundSize: '16px 16px'
                      }}
                    />
                  )}
                  <img
                    src={selectedImage}
                    alt="Product"
                    className={`max-h-full max-w-full object-contain rounded-lg transition-all duration-500 ${
                      processedResult ? 'filter drop-shadow-2xl scale-105' : ''
                    }`}
                  />
                  {processedResult && (
                    <span className="absolute bottom-3 left-3 bg-black/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                      تم عزل الخلفية بنجاح (PNG شفاف)
                    </span>
                  )}
                </div>
              ) : (
                // Upscale comparison preview
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img
                    src={selectedImage}
                    alt="Upscaled Product"
                    className={`max-h-full max-w-full object-contain rounded-lg transition-all duration-300 ${
                      processedResult ? 'filter contrast-110 brightness-105 saturate-105' : ''
                    }`}
                  />
                  {processedResult && (
                    <span className="absolute bottom-3 left-3 bg-black/80 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                      دقة معززة 4K Ultra HD
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {processedResult && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex gap-3">
              <button
                onClick={handleDownloadResult}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل الصورة المعالجة</span>
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Wand2 className="w-4 h-4" />
                <span>استخدام في إعلان جديد</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

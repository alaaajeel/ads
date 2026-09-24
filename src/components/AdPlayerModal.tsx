import React, { useState, useEffect } from 'react';
import { Ad, AspectRatio } from '../types';
import { DIALECTS } from '../data/mockInitialData';
import { ArabicTTSProvider } from '../services/ai-gateway/arabicTTSProvider';
import {
  X,
  Play,
  Pause,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Smartphone,
  Square,
  Monitor,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface AdPlayerModalProps {
  ad: Ad;
  onClose: () => void;
  onRetry?: (adId: string) => void;
}

export const AdPlayerModal: React.FC<AdPlayerModalProps> = ({ ad, onClose, onRetry }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);
  const [currentAspect, setCurrentAspect] = useState<AspectRatio>(ad.aspect_ratio);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeFrame, setActiveFrame] = useState<'hook' | 'body' | 'cta'>('hook');

  const dialectInfo = DIALECTS.find((d) => d.id === ad.dialect);

  // Play animation loop between hook, body, and CTA
  useEffect(() => {
    if (!isPlaying || ad.type !== 'video') return;

    const interval = setInterval(() => {
      setActiveFrame((prev) => {
        if (prev === 'hook') return 'body';
        if (prev === 'body') return 'cta';
        return 'hook';
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, ad.type]);

  const handleToggleAudio = () => {
    if (isAudioSpeaking) {
      ArabicTTSProvider.stop();
      setIsAudioSpeaking(false);
    } else {
      const full = `${ad.script_text.hook}. ${ad.script_text.body}. ${ad.script_text.cta}`;
      setIsAudioSpeaking(true);
      ArabicTTSProvider.speak(full, ad.dialect, () => {
        setIsAudioSpeaking(false);
      });
    }
  };

  const handleDownload = () => {
    // Generate anchor download simulation
    const link = document.createElement('a');
    link.href = ad.source_image_url;
    link.download = `${ad.product_name}_${currentAspect}_${ad.type === 'video' ? 'ad.mp4' : 'post.png'}`;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{dialectInfo?.flag}</span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {ad.product_name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{ad.type === 'video' ? 'إعلان فيديو سينمائي' : 'إعلان صورة ثابتة'}</span>
                <span>•</span>
                <span>{dialectInfo?.nameAr}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Media Player Canvas Frame */}
          <div className="md:col-span-7 flex flex-col items-center justify-center">
            <div
              className={`relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 transition-all duration-300 flex items-center justify-center ${
                currentAspect === '9:16'
                  ? 'w-[260px] sm:w-[300px] h-[460px] sm:h-[530px]'
                  : currentAspect === '1:1'
                  ? 'w-[320px] sm:w-[380px] h-[320px] sm:h-[380px]'
                  : 'w-full max-w-[480px] h-[270px]'
              }`}
            >
              {/* Product Background Image with Motion Zoom */}
              <img
                src={ad.source_image_url}
                alt={ad.product_name}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] ${
                  isPlaying ? 'scale-110' : 'scale-100'
                }`}
              />

              {/* Gradient Dark Overlay for Arabic Typography Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />

              {/* Top Platform Tag */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1.5 z-10">
                <Sparkles className="w-3 h-3" />
                <span>AI Ads Engine</span>
              </div>

              {/* Middle Frame Animated Subtitles / Content */}
              <div className="absolute inset-x-4 bottom-14 z-10 text-center">
                {activeFrame === 'hook' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-amber-500/90 text-slate-950 font-extrabold text-sm sm:text-base px-3 py-2 rounded-xl shadow-lg leading-tight">
                    🔥 {ad.script_text.hook}
                  </div>
                )}
                {activeFrame === 'body' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-slate-950/80 backdrop-blur border border-slate-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-lg leading-relaxed">
                    ✨ {ad.script_text.body}
                  </div>
                )}
                {activeFrame === 'cta' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-emerald-500 text-slate-950 font-extrabold text-sm sm:text-base px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-center gap-2">
                    <span>👉 {ad.script_text.cta}</span>
                  </div>
                )}
              </div>

              {/* Video Player Floating Controls */}
              {ad.type === 'video' && (
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-white/80 z-20">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center transition cursor-pointer text-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  {/* Progress segments indicator */}
                  <div className="flex gap-1.5 flex-1 mx-3">
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        activeFrame === 'hook' ? 'bg-amber-400' : 'bg-white/30'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        activeFrame === 'body' ? 'bg-amber-400' : 'bg-white/30'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        activeFrame === 'cta' ? 'bg-amber-400' : 'bg-white/30'
                      }`}
                    />
                  </div>

                  <button
                    onClick={handleToggleAudio}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center transition cursor-pointer text-white"
                  >
                    {isAudioSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details & Actions Sidebar */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                تغيير مقاس المنصة للمعاينة والتنزيل:
              </h4>

              {/* Platform Format Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setCurrentAspect('9:16')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    currentAspect === '9:16'
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-bold block">9:16 ستوري</span>
                  <span className="text-[10px] opacity-70">تيك توك / ريلز</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentAspect('1:1')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    currentAspect === '1:1'
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Square className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-bold block">1:1 مربع</span>
                  <span className="text-[10px] opacity-70">إنستغرام / فيسبوك</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentAspect('16:9')}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                    currentAspect === '16:9'
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-bold block">16:9 عريض</span>
                  <span className="text-[10px] opacity-70">يوتيوب / ويب</span>
                </button>
              </div>

              {/* Script Details */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <div>
                  <span className="text-amber-400 font-bold block mb-0.5">الخطفة (Hook):</span>
                  <p className="text-slate-300">{ad.script_text.hook}</p>
                </div>
                <div>
                  <span className="text-blue-400 font-bold block mb-0.5">الرسالة (Body):</span>
                  <p className="text-slate-300">{ad.script_text.body}</p>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block mb-0.5">الدعوة لإجراء (CTA):</span>
                  <p className="text-slate-300">{ad.script_text.cta}</p>
                </div>
              </div>
            </div>

            {/* Download & Share Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تم التنزيل بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>
                      تنزيل الإعلان ({currentAspect} {ad.type === 'video' ? 'MP4' : 'PNG'})
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleAudio}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                {isAudioSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isAudioSpeaking ? 'إيقاف التعليق الصوتي العربي' : 'تشغيل التعليق الصوتي العربي'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { Ad, AdStatus } from '../types';
import { DIALECTS } from '../data/mockInitialData';
import {
  Video,
  Image as ImageIcon,
  Clock,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  Plus
} from 'lucide-react';

export const MyAdsArchive: React.FC = () => {
  const { ads, jobs, setSelectedAdForPreview, retryAdGeneration, setActiveTab } = useApp();

  const getStatusBadge = (status: AdStatus, adId: string) => {
    const job = jobs[adId];

    switch (status) {
      case 'queued':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>في طابور المعالجة...</span>
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>جارٍ التوليد ({job?.progress || 35}%)</span>
          </span>
        );
      case 'done':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>جاهز للنشر</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>فشل (تم استرجاع الكريدت)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white">إعلاناتي السابقة (الأرشيف)</h2>
          <p className="text-sm text-slate-400 mt-1">
            جميع الإعلانات التي تم توليدها محفوظة في حسابك قابلة للمعاينة وإعادة التنزيل بأي وقت.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create')}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء إعلان جديد</span>
        </button>
      </div>

      {ads.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-white mb-2">لا توجد إعلانات بعد</h3>
          <p className="text-xs text-slate-400 mb-6">
            ابدأ برفع أول صورة لمنتجك واحصل على إعلان احترافي جاهز خلال دقائق!
          </p>
          <button
            onClick={() => setActiveTab('create')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
          >
            إنشاء أول إعلان
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => {
            const dialect = DIALECTS.find((d) => d.id === ad.dialect);
            const job = jobs[ad.id];

            return (
              <div
                key={ad.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col group shadow-lg"
              >
                {/* Thumbnail Image Container */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={ad.source_image_url}
                    alt={ad.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40" />

                  {/* Top badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="bg-slate-900/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1.5">
                      {ad.type === 'video' ? <Video className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
                      <span>{ad.type === 'video' ? 'فيديو' : 'صورة'}</span>
                    </span>

                    {getStatusBadge(ad.status, ad.id)}
                  </div>

                  {/* Center Play Button for Done Ads */}
                  {ad.status === 'done' && (
                    <button
                      onClick={() => setSelectedAdForPreview(ad)}
                      className="absolute inset-0 flex items-center justify-center m-auto w-12 h-12 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 transition transform hover:scale-110 shadow-xl cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </button>
                  )}

                  {/* Processing Progress Bar on Card */}
                  {(ad.status === 'processing' || ad.status === 'queued') && (
                    <div className="absolute inset-x-3 bottom-3 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-amber-400 font-semibold truncate max-w-[200px]">
                          {job?.current_stage || 'جارٍ الإرسال إلى طابور التوليد...'}
                        </span>
                        <span className="text-slate-300 font-bold">{job?.progress || 15}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${job?.progress || 15}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Failed Notice on Card */}
                  {ad.status === 'failed' && (
                    <div className="absolute inset-x-3 bottom-3 bg-rose-950/90 backdrop-blur-md p-2.5 rounded-xl border border-rose-800/80 text-[11px] text-rose-200">
                      <div className="font-bold flex items-center justify-between mb-1">
                        <span>خطأ في المزوّد الخارجي</span>
                        <span className="text-emerald-400 font-normal">تم استرجاع +{ad.credits_spent} كريدت</span>
                      </div>
                      <p className="line-clamp-1 text-slate-300">{ad.failure_reason}</p>
                    </div>
                  )}
                </div>

                {/* Card Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-sm text-white truncate max-w-[200px]">
                        {ad.product_name}
                      </h4>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>{dialect?.flag}</span>
                        <span>{dialect?.nameAr.split(' ')[0]}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mb-3 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                      {ad.script_text.hook}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {new Date(ad.created_at).toLocaleDateString('ar-EG')}
                    </span>

                    {ad.status === 'done' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedAdForPreview(ad)}
                          className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة وتنزيل</span>
                        </button>
                      </div>
                    )}

                    {ad.status === 'failed' && (
                      <button
                        onClick={() => retryAdGeneration(ad.id)}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>إعادة المحاولة</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

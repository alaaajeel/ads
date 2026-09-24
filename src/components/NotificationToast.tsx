import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification, setActiveTab, setSelectedAdForPreview, ads } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {notifications.map((n) => {
        const ad = n.adId ? ads.find((a) => a.id === n.adId) : null;

        return (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${
              n.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/40 text-slate-100'
                : n.type === 'error'
                ? 'bg-slate-900/95 border-red-500/40 text-slate-100'
                : n.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/40 text-slate-100'
                : 'bg-slate-900/95 border-blue-500/40 text-slate-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {n.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 text-right">
              <h4 className="font-bold text-sm text-white mb-0.5">{n.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>

              {ad && ad.status === 'done' && (
                <button
                  onClick={() => {
                    setSelectedAdForPreview(ad);
                    setActiveTab('my_ads');
                    dismissNotification(n.id);
                  }}
                  className="mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  معاينة الإعلان وتنزيله الآن ←
                </button>
              )}
            </div>

            <button
              onClick={() => dismissNotification(n.id)}
              className="text-slate-400 hover:text-slate-200 shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

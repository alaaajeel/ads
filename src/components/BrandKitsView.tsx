import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandKit } from '../types';
import { DIALECTS } from '../data/mockInitialData';
import { Palette, Plus, Trash2, Check, Sparkles, Building2, Upload } from 'lucide-react';

export const BrandKitsView: React.FC = () => {
  const { brandKits, activeBrandKit, setActiveBrandKit, saveBrandKit, deleteBrandKit } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80');
  const [primaryColor, setPrimaryColor] = useState('#f59e0b');
  const [secondaryColor, setSecondaryColor] = useState('#0f172a');
  const [preferredVoiceId, setPreferredVoiceId] = useState('gulf_voice');

  const startNewKit = () => {
    setEditingId(null);
    setName('');
    setClientName('');
    setLogoUrl('https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80');
    setPrimaryColor('#f59e0b');
    setSecondaryColor('#0f172a');
    setIsEditing(true);
  };

  const startEditKit = (kit: BrandKit) => {
    setEditingId(kit.id);
    setName(kit.name);
    setClientName(kit.client_name || '');
    setLogoUrl(kit.logo_url);
    setPrimaryColor(kit.primary_color);
    setSecondaryColor(kit.secondary_color);
    setPreferredVoiceId(kit.preferred_voice_id || 'gulf_voice');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveBrandKit({
      id: editingId || undefined,
      name: name || 'علامة تجارية جديدة',
      client_name: clientName || undefined,
      logo_url: logoUrl,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      preferred_voice_id: preferredVoiceId
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-extrabold text-white">هوية العلامة التجارية (Brand Kits)</h2>
            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
              FR-016 / FR-017
            </span>
          </div>
          <p className="text-sm text-slate-400">
            احفظ ألوانك وشعارك ونبرة الصوت المفضلة ليتم تطبيقها تلقائياً على كل إعلان جديد. يدعم إدارة ملفات عملاء متعددين للوكالات.
          </p>
        </div>

        <button
          onClick={startNewKit}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة هوية / عميل جديد</span>
        </button>
      </div>

      {/* Editor Modal or Inline */}
      {isEditing && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 mb-8 shadow-2xl animate-in slide-in-from-top-2">
          <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <span>{editingId ? 'تعديل هوية العلامة' : 'إنشاء هوية علامة جديدة'}</span>
          </h3>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسم الهوية:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: متجر أصالة"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم العميل (مخصص لوكالات التسويق FR-016):
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="مثال: مطعم شاورما البركة (عميل دبي)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">رابط الشعار (Logo):</label>
              <input
                type="url"
                required
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">اللون الأساسي:</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs text-slate-300 font-mono">{primaryColor}</span>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">اللون الثانوي:</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl p-1.5">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs text-slate-300 font-mono">{secondaryColor}</span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-2.5 rounded-xl text-sm transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                حفظ هوية العلامة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Brand Kits Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandKits.map((kit) => {
          const isSelected = activeBrandKit?.id === kit.id;

          return (
            <div
              key={kit.id}
              className={`bg-slate-900/80 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 relative ${
                isSelected ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xl' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={kit.logo_url}
                      alt={kit.name}
                      className="w-12 h-12 rounded-xl object-cover bg-white/10 p-1 border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{kit.name}</h4>
                      {kit.client_name && (
                        <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          <span>{kit.client_name}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>نشط حالياً</span>
                    </span>
                  )}
                </div>

                {/* Colors Bar */}
                <div className="mb-4">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">لوحة الألوان المعتمدة:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: kit.primary_color }} />
                      <span className="text-xs text-slate-300 font-mono">{kit.primary_color}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: kit.secondary_color }} />
                      <span className="text-xs text-slate-300 font-mono">{kit.secondary_color}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveBrandKit(kit)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    isSelected ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {isSelected ? 'محدد كافتراضي' : 'تفعيل للإعلانات القادمة'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditKit(kit)}
                    className="text-xs text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    تعديل
                  </button>
                  {brandKits.length > 1 && (
                    <button
                      onClick={() => deleteBrandKit(kit.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/40 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

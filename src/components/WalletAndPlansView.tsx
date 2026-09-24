import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLANS } from '../data/mockInitialData';
import {
  CreditCard,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

export const WalletAndPlansView: React.FC = () => {
  const { wallet, transactions, currentPlan, topUpCredits, selectPlan } = useApp();

  const [customCredits, setCustomCredits] = useState<number>(50);

  const topUpPacks = [
    { credits: 20, price: 9, label: 'باقة تجريبية سريعة' },
    { credits: 50, price: 19, label: 'باقة شائعة للمتاجر', popular: true },
    { credits: 150, price: 49, label: 'باقة إعلانات مكثفة' },
    { credits: 500, price: 129, label: 'باقة الوكالات المفتوحة' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Wallet Balance Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-2">
              <Coins className="w-4 h-4" />
              <span>محفظة الكريدت الرقمية (Credit Wallet)</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl sm:text-5xl font-black text-white">{wallet.balance}</h2>
              <span className="text-lg font-bold text-amber-400">كريدت متاح</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              يكفي لتوليد حوالي <strong className="text-slate-200">{Math.floor(wallet.balance / 5)} فيديو</strong> أو{' '}
              <strong className="text-slate-200">{Math.floor(wallet.balance / 2)} صورة ثابتة</strong>.
            </p>
          </div>

          {/* Quick Credit Recharge Packs */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300">شحن رصيد كريدت فوري:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {topUpPacks.map((pack) => (
                <button
                  key={pack.credits}
                  onClick={() => topUpCredits(pack.credits, `شراء رصيد: +${pack.credits} كريدت ($${pack.price})`)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col justify-between ${
                    pack.popular
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="font-extrabold text-sm">+{pack.credits}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">${pack.price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans Section (FR-011) */}
      <div className="mb-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-2xl font-black text-white mb-2">باقات الاشتراك الشهرية</h3>
          <p className="text-xs sm:text-sm text-slate-400">
            اختر الباقة المناسبة لحجم نشاطك التجاري، مع تجديد شهري تلقائي للكريدت والأدوات المجانية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan.id === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-slate-900/80 border rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xl'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 right-6 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full shadow">
                    الأكثر طلباً للمتاجر
                  </span>
                )}

                <div>
                  <h4 className="font-bold text-white text-base mb-1">{plan.nameAr}</h4>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-3xl font-black text-white">${plan.monthly_price}</span>
                    <span className="text-xs text-slate-400">/ شهرياً</span>
                  </div>

                  <div className="text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-amber-400 font-bold mb-4">
                    🎁 {plan.monthly_credits} كريدت شهرياً
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => selectPlan(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : plan.isPopular
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isCurrent ? 'باقتك الحالية' : 'اختيار هذه الباقة'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Credit Transactions Ledger (CreditTransaction) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-white">سجل حركات الكريدت (Transactions Ledger)</h3>
          <span className="text-xs text-slate-400">{transactions.length} حركات مسجلة</span>
        </div>

        <div className="divide-y divide-slate-800">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'deduct'
                      ? 'bg-rose-500/10 text-rose-400'
                      : tx.type === 'refund'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {tx.type === 'deduct' && <ArrowUpRight className="w-4 h-4" />}
                  {tx.type === 'refund' && <RotateCcw className="w-4 h-4" />}
                  {tx.type === 'add' && <ArrowDownLeft className="w-4 h-4" />}
                </div>

                <div>
                  <div className="font-semibold text-xs sm:text-sm text-slate-200">{tx.reason}</div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(tx.created_at).toLocaleString('ar-EG')}
                  </div>
                </div>
              </div>

              <div
                className={`font-bold text-sm shrink-0 ${
                  tx.type === 'deduct'
                    ? 'text-rose-400'
                    : tx.type === 'refund'
                    ? 'text-blue-400'
                    : 'text-emerald-400'
                }`}
              >
                {tx.type === 'deduct' ? `-${tx.amount}` : `+${tx.amount}`} كريدت
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

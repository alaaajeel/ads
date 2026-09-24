import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CreateAdWizard } from './components/CreateAdWizard';
import { MyAdsArchive } from './components/MyAdsArchive';
import { FreeToolsView } from './components/FreeToolsView';
import { BrandKitsView } from './components/BrandKitsView';
import { WalletAndPlansView } from './components/WalletAndPlansView';
import { QuickstartTester } from './components/QuickstartTester';
import { AdPlayerModal } from './components/AdPlayerModal';
import { NotificationToast } from './components/NotificationToast';

const MainLayout: React.FC = () => {
  const { activeTab, selectedAdForPreview, setSelectedAdForPreview, retryAdGeneration } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header />

      <main className="flex-1">
        {activeTab === 'create' && <CreateAdWizard />}
        {activeTab === 'my_ads' && <MyAdsArchive />}
        {activeTab === 'free_tools' && <FreeToolsView />}
        {activeTab === 'brand_kits' && <BrandKitsView />}
        {activeTab === 'wallet_plans' && <WalletAndPlansView />}
        {activeTab === 'quickstart_tester' && <QuickstartTester />}
      </main>

      {/* Floating Notifications */}
      <NotificationToast />

      {/* Ad Preview & Video Player Modal */}
      {selectedAdForPreview && (
        <AdPlayerModal
          ad={selectedAdForPreview}
          onClose={() => setSelectedAdForPreview(null)}
          onRetry={retryAdGeneration}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>منصة إعلانات الذكاء الاصطناعي العربية © 2026 — مصممة خصيصاً للمتاجر والمشاريع في السوق العربي</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>دعم اللهجات العربية: فصحى • خليجي • عراقي • مصري • شامي</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

import { TabKey } from '../types';
import DispensePage from './dispense/DispensePage';
import InformationPage from './InformationPage';
import InventoryPage from './InventoryPage';
import SettingPage from './SettingPage';

interface MainContentProps {
  activeTab: TabKey;
}

export default function MainContent({ activeTab }: MainContentProps) {
  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {activeTab === 'dispense' && <DispensePage />}
      {activeTab === 'information' && <InformationPage />}
      {activeTab === 'inventory' && <InventoryPage />}
      {activeTab === 'setting' && <SettingPage />}
    </main>
  );
}

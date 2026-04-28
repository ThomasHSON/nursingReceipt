import { TabKey } from '../types';
import DispensePage from './dispense/DispensePage';
import InformationPage from './InformationPage';

interface MainContentProps {
  activeTab: TabKey;
}

export default function MainContent({ activeTab }: MainContentProps) {
  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {activeTab === 'dispense' && <DispensePage />}
      {activeTab === 'information' && <InformationPage />}
    </main>
  );
}

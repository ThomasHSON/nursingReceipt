import { useState } from 'react';
import { FileSearch, RefreshCw } from 'lucide-react';
import { Regimen } from '../types';
import { mockRegimens } from '../data/mockData';
import InfoPrescriptionList from './information/InfoPrescriptionList';
import PrescriptionDetailView from './dispense/PrescriptionDetailView';

export default function InformationPage() {
  const [selectedRx, setSelectedRx] = useState<Regimen | null>(null);

  const handleBack = () => setSelectedRx(null);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-teal-500" />
          </div>
          <div>
            <h1 className="text-slate-800 text-lg font-bold leading-tight">審核資訊</h1>
            <p className="text-slate-500 text-xs tracking-wider">Information Review</p>
          </div>
        </div>
        <button className="glass-btn flex items-center gap-2 px-4 py-2.5 text-sm">
          <RefreshCw className="w-4 h-4" />
          <span>重新整理</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 px-6 pb-6">
        {selectedRx ? (
          <PrescriptionDetailView
            regimen={selectedRx}
            status={selectedRx.status}
            onBack={handleBack}
          />
        ) : (
          <InfoPrescriptionList
            regimens={mockRegimens}
            onSelect={setSelectedRx}
          />
        )}
      </div>
    </div>
  );
}

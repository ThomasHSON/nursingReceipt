import { useState } from 'react';
import { ScanLine } from 'lucide-react';
import { DispenseStatus, Regimen } from '../../types';
import InfoPrescriptionCard from './InfoPrescriptionCard';

type FilterOption = 'all' | DispenseStatus;

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all',       label: '全部' },
  { value: 'completed', label: '已完成' },
  { value: 'delivering',label: '運送中' },
  { value: 'received',  label: '已簽收' },
  { value: 'finished',  label: '療程結束' },
];

interface InfoPrescriptionListProps {
  regimens: Regimen[];
  onSelect: (rx: Regimen) => void;
}

export default function InfoPrescriptionList({ regimens, onSelect }: InfoPrescriptionListProps) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [scanValue, setScanValue] = useState('');

  const filtered = regimens.filter(rx =>
    filter === 'all' ? true : rx.status === filter
  );

  const outpatient = filtered.filter(rx => !rx.admissionNumber);
  const inpatient  = filtered.filter(rx => !!rx.admissionNumber);

  return (
    <div className="flex flex-col flex-1 gap-4 min-h-0">
      <div className="glass-card p-4 flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
            <ScanLine className="w-4.5 h-4.5 text-teal-500" />
          </div>
          <div>
            <p className="text-slate-800 font-semibold text-sm">條碼掃描</p>
            <p className="text-slate-500 text-xs">Scan Barcode</p>
          </div>
        </div>

        <div className="flex-1 relative">
          <ScanLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={scanValue}
            onChange={e => setScanValue(e.target.value)}
            placeholder="掃描或輸入條碼 / Scan or enter barcode..."
            className="glass-input w-full pl-10 text-sm"
          />
        </div>

        <div className="flex-shrink-0">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as FilterOption)}
            className="glass-input text-sm pr-9 cursor-pointer"
          >
            {FILTER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <button className="glass-btn-primary px-5 py-3 text-sm font-semibold flex-shrink-0">
          確認
        </button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <PrescriptionSection
          title="門診"
          dotColor="bg-sky-400"
          countColor="text-sky-600"
          emptyText="目前無符合條件的門診處方"
          regimens={outpatient}
          onSelect={onSelect}
        />
        <PrescriptionSection
          title="住院"
          dotColor="bg-amber-400"
          countColor="text-amber-600"
          emptyText="目前無符合條件的住院處方"
          regimens={inpatient}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  dotColor: string;
  countColor: string;
  emptyText: string;
  regimens: Regimen[];
  onSelect: (rx: Regimen) => void;
}

function PrescriptionSection({ title, dotColor, countColor, emptyText, regimens, onSelect }: SectionProps) {
  return (
    <div className="glass-card-solid flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200/60 flex-shrink-0">
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <h3 className="text-slate-800 font-bold text-base">{title}</h3>
        <span className={`text-sm font-semibold ml-auto ${countColor}`}>{regimens.length} 筆</span>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 flex flex-col gap-2">
        {regimens.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <p className="text-slate-400 text-sm">{emptyText}</p>
          </div>
        ) : (
          regimens.map(rx => (
            <InfoPrescriptionCard key={rx.id} rx={rx} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}

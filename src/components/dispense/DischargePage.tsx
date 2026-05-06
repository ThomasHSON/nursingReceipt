import { useState } from 'react';
import { Clock, User, Stethoscope, ChevronRight, Building2 } from 'lucide-react';
import { Regimen } from '../../types';
import { mockRegimens } from '../../data/mockData';
import DischargeDetailView from './DischargeDetailView';

type FilterType = 'all' | 'inpatient';

const dischargeRegimens = mockRegimens.filter(rx => rx.status === 'discharging');

function RegimenCard({ rx, onSelect }: { rx: Regimen; onSelect: (rx: Regimen) => void }) {
  const [datePart, timePart] = rx.effectiveDateTime.split(' ');
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-2xl border bg-teal-50/60 border-teal-200/50 hover:bg-teal-50/90 cursor-pointer transition-all duration-200 group"
      onClick={() => onSelect(rx)}
    >
      <div className="w-1 h-12 rounded-full flex-shrink-0 bg-teal-400" />

      <div className="flex flex-col gap-0.5 w-32 flex-shrink-0">
        <span className="text-slate-800 text-base font-semibold font-mono">{datePart}</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 text-base font-mono">{timePart}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
        <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full border bg-amber-100 text-amber-700 border-amber-200/60">
          住院
        </span>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-slate-800 text-base font-bold truncate">{rx.patientName}</span>
          <span className="text-slate-400 text-base font-mono flex-shrink-0">{rx.chartNumber}</span>
          {rx.admissionNumber && (
            <>
              <span className="text-slate-300 text-base">·</span>
              <Building2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-amber-700 text-base font-mono flex-shrink-0">{rx.admissionNumber}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-500 text-base">{rx.department}</span>
          {rx.diagnosis && (
            <>
              <span className="text-slate-300 text-base">·</span>
              <span className="text-slate-400 text-base truncate">{rx.diagnosis}</span>
            </>
          )}
        </div>
      </div>

      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 bg-teal-100 text-teal-700 border-teal-200">
        待離院確認
      </span>

      <button
        onClick={(e) => { e.stopPropagation(); onSelect(rx); }}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0 shadow-md transition-all duration-200 active:scale-95 bg-teal-500 hover:bg-teal-600 shadow-teal-200"
      >
        離院確認
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function DischargePage() {
  const [selected, setSelected] = useState<Regimen | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>('all');

  const visible = dischargeRegimens.filter(rx => !dismissed.has(rx.id));
  const filtered = filter === 'all' ? visible : visible.filter(rx => !!rx.admissionNumber);

  function handleConfirm(rx: Regimen) {
    setDismissed(prev => new Set([...prev, rx.id]));
    setSelected(null);
  }

  if (selected) {
    return (
      <DischargeDetailView
        regimen={selected}
        onBack={() => setSelected(null)}
        onConfirm={handleConfirm}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 pb-6 min-h-0">
      <div className="glass-card-solid flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-slate-800 font-bold text-base">離院清單</h3>
            <span className="text-slate-400 text-sm font-mono">{filtered.length} 筆待處理</span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="bg-white/80 border border-slate-200/70 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300/50 focus:border-sky-300 transition-all cursor-pointer"
          >
            <option value="all">全部（{visible.length}）</option>
            <option value="inpatient">住院（{visible.filter(rx => !!rx.admissionNumber).length}）</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <p className="text-slate-400 text-sm">目前無待離院確認的處方</p>
            </div>
          ) : (
            filtered.map((rx) => (
              <RegimenCard key={rx.id} rx={rx} onSelect={setSelected} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

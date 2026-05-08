import { CheckSquare, Square, Scale } from 'lucide-react';
import { DrugItem } from '../../types';

interface DrugTableProps {
  drugs: DrugItem[];
  checkable?: boolean;
  onToggle?: (id: string) => void;
}

export default function DrugTable({ drugs, checkable = false, onToggle }: DrugTableProps) {
  if (drugs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-400 text-sm">無藥品資料</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      {drugs.map((drug) => {
        const hasWeight = drug.weightBefore !== undefined && drug.weightAfter !== undefined;

        return (
          <div
            key={drug.id}
            className={`flex items-start gap-3 px-4 py-3 border-b border-slate-100 last:border-0 transition-colors duration-150 ${
              drug.checked ? 'bg-emerald-50/50' : 'hover:bg-slate-50/60'
            }`}
          >
            {checkable && onToggle && (
              <button
                onClick={() => onToggle(drug.id)}
                className="flex-shrink-0 text-slate-300 hover:text-emerald-500 transition-colors mt-0.5"
              >
                {drug.checked
                  ? <CheckSquare className="w-5 h-5 text-emerald-500" />
                  : <Square className="w-5 h-5" />
                }
              </button>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={`text-base font-semibold leading-snug ${drug.checked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {drug.drugName}
                  </span>
                  <span className="text-base text-slate-500 ml-1.5">{drug.drugNameZh}</span>
                  <span className="text-base font-mono text-slate-400 ml-1.5">({drug.drugCode})</span>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end">
                  <span className={`text-2xl flex items-end gap-1 font-bold leading-none px-3 py-2 rounded-lg ${drug.checked ? 'text-slate-400 bg-slate-100' : 'text-slate-700 bg-slate-100'}`}>
                    <span className="text-sm text-slate-400 leading-none mb-0.5">發藥數量</span>
                    <span>{drug.dispenseQty}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 mt-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="text-base text-slate-400">劑量</span>
                    <span className="text-base font-semibold text-slate-700">{drug.dose}</span>
                  </span>
                  <span className="text-slate-200 text-base">·</span>
                  <span className="flex items-center gap-1">
                    <span className="text-base text-slate-400">途徑</span>
                    <span className="text-base font-medium text-sky-700">{drug.route}</span>
                  </span>
                  <span className="text-slate-200 text-base">·</span>
                  <span className="flex items-center gap-1">
                    <span className="text-base text-slate-400">頻次</span>
                    <span className="text-base font-medium text-slate-700">{drug.frequency}</span>
                  </span>
                  <span className="text-slate-200 text-base">·</span>
                  <span className="flex items-center gap-1">
                    <span className="text-base text-slate-400">數量</span>
                    <span className="text-base font-medium text-slate-700">{drug.qty}</span>
                  </span>
                </div>
                <div className="flex gap-1 text-sm items-center">
                  <span className="text-slate-400 leading-none mb-0.5">儲位</span>
                  <span className="font-mono text-amber-700">
                    {drug.storageLocation}
                  </span>
                </div>
              </div>

              {hasWeight && (() => {
                const diff = drug.weightAfter! - drug.weightBefore!;
                const pct = (diff / drug.weightBefore!) * 100;
                const absPct = Math.abs(pct);
                const isOk = absPct <= 3;
                return (
                  <div className="mt-2 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <Scale className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-400">秤重</span>
                    <span className="text-slate-500">前</span>
                    <span className="font-bold text-slate-700 font-mono">{drug.weightBefore!.toFixed(2)}</span>
                    <span className="text-slate-500">g</span>
                    <span className="text-slate-300 mx-0.5">→</span>
                    <span className="text-slate-500">後</span>
                    <span className="font-bold text-slate-700 font-mono">{drug.weightAfter!.toFixed(2)}</span>
                    <span className="text-slate-500">g</span>
                    <span className="text-slate-200 mx-0.5">|</span>
                    <span className="text-slate-400 text-sm">誤差</span>
                    <span className={`font-bold font-mono text-sm px-1.5 py-0.5 rounded ${isOk ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                      {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

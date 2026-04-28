import { useState } from 'react';
import { ScanLine, Clock, User, Stethoscope, ChevronRight, Building2, Lock } from 'lucide-react';
import { DispenseStatus, Regimen } from '../../types';
import PrescriptionDetailView from './PrescriptionDetailView';

type CardKey = 'receivable' | 'treating';
type FilterType = 'all' | 'outpatient' | 'inpatient';

interface PrescriptionListDetailProps {
  cardKey: CardKey;
  regimens: Regimen[];
}

const STATUS_LABEL: Record<DispenseStatus, { label: string; className: string }> = {
  completed: { label: '已完成', className: 'bg-slate-100 text-slate-500 border-slate-200' },
  delivering: { label: '運送中', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  received: { label: '已簽收', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  finished: { label: '療程結束', className: 'bg-blue-100 text-blue-700 border-blue-200' },
};

const PATIENT_TYPE_STYLE: Record<'outpatient' | 'inpatient', { card: string; badge: string; dot: string }> = {
  outpatient: {
    card: 'bg-sky-50/60 border-sky-200/50 hover:bg-sky-50/90',
    badge: 'bg-sky-100 text-sky-700 border-sky-200/60',
    dot: 'bg-sky-400',
  },
  inpatient: {
    card: 'bg-amber-50/60 border-amber-200/50 hover:bg-amber-50/90',
    badge: 'bg-amber-100 text-amber-700 border-amber-200/60',
    dot: 'bg-amber-400',
  },
};

function regimenPatientType(rx: Regimen): 'outpatient' | 'inpatient' {
  return rx.admissionNumber ? 'inpatient' : 'outpatient';
}

function RegimenCard({
  rx,
  cardKey,
  onSelect,
}: {
  rx: Regimen;
  cardKey: CardKey;
  onSelect: (rx: Regimen) => void;
}) {
  const patientType = regimenPatientType(rx);
  const typeStyle = PATIENT_TYPE_STYLE[patientType];
  const statusInfo = STATUS_LABEL[rx.status];
  const [datePart, timePart] = rx.effectiveDateTime.split(' ');

  const isDisabled = cardKey === 'receivable' && rx.status === 'completed';

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-200 ${
        isDisabled
          ? 'bg-slate-50/60 border-slate-200/50 opacity-50 cursor-not-allowed'
          : `${typeStyle.card} cursor-pointer group`
      }`}
      onClick={() => !isDisabled && onSelect(rx)}
    >
      <div className={`w-1 h-12 rounded-full flex-shrink-0 ${isDisabled ? 'bg-slate-300' : typeStyle.dot}`} />

      <div className="flex flex-col gap-0.5 w-32 flex-shrink-0">
        <span className="text-slate-800 text-base font-semibold font-mono">{datePart}</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 text-base font-mono">{timePart}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
        <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full border ${typeStyle.badge}`}>
          {patientType === 'outpatient' ? '門診' : '住院'}
        </span>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-slate-800 text-base font-bold truncate">{rx.patientName}</span>
          <span className="text-slate-400 text-base font-mono flex-shrink-0">{rx.chartNumber}</span>
          {patientType === 'inpatient' && rx.admissionNumber && (
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

      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${statusInfo.className}`}>
        {statusInfo.label}
      </span>

      {isDisabled ? (
        <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(rx); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0 shadow-md transition-all duration-200 active:scale-95 ${
            cardKey === 'receivable'
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
              : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'
          }`}
        >
          {cardKey === 'receivable' ? '簽收' : '查看'}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function PrescriptionListDetail({ cardKey, regimens }: PrescriptionListDetailProps) {
  const [scanValue, setScanValue] = useState('');
  const [selectedRx, setSelectedRx] = useState<Regimen | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all'
    ? regimens
    : regimens.filter((rx) => regimenPatientType(rx) === filter);

  const outpatientCount = regimens.filter((rx) => !rx.admissionNumber).length;
  const inpatientCount = regimens.filter((rx) => !!rx.admissionNumber).length;

  if (selectedRx) {
    return (
      <PrescriptionDetailView
        regimen={selectedRx}
        cardKey={cardKey}
        onBack={() => setSelectedRx(null)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 pb-6 min-h-0">
      {cardKey === 'receivable' && (
        <div className="glass-card p-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                <ScanLine className="w-4.5 h-4.5 text-amber-500" />
              </div>
              <div>
                <p className="text-slate-800 font-semibold text-sm">簽收通知</p>
                <p className="text-slate-500 text-xs">掃描條碼進行簽收 Scan Barcode to Receive</p>
              </div>
            </div>
            <div className="flex-1 relative">
              <ScanLine className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={scanValue}
                onChange={(e) => setScanValue(e.target.value)}
                placeholder="掃描或輸入條碼 / Scan or enter barcode..."
                className="glass-input w-full pl-10 text-sm"
              />
            </div>
            <button className="glass-btn-primary px-5 py-2.5 text-sm font-semibold flex-shrink-0">
              確認
            </button>
          </div>
        </div>
      )}

      <div className="glass-card-solid flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-slate-800 font-bold text-base">處方清單</h3>
            <span className="text-slate-400 text-sm font-mono">{filtered.length} / {regimens.length} 筆</span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="bg-white/80 border border-slate-200/70 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300/50 focus:border-sky-300 transition-all cursor-pointer"
          >
            <option value="all">全部（{regimens.length}）</option>
            <option value="outpatient">門診（{outpatientCount}）</option>
            <option value="inpatient">住院（{inpatientCount}）</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <p className="text-slate-400 text-sm">目前無符合條件的處方</p>
            </div>
          ) : (
            filtered.map((rx) => (
              <RegimenCard
                key={rx.id}
                rx={rx}
                cardKey={cardKey}
                onSelect={setSelectedRx}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

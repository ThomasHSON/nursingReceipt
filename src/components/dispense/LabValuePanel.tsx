import { FlaskConical, AlertTriangle, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { Regimen, LabItem } from '../../types';

// ── Group definitions ─────────────────────────────────────────────────────────

const GROUP_ORDER = ['血液常規', '腎功能', '肝功能', '感染篩檢', '腫瘤標記', '其他'];

const NAME_TO_GROUP: Record<string, string> = {
  WBC: '血液常規', ANC: '血液常規', Hgb: '血液常規', Platelet: '血液常規',
  'Nadir WBC': '血液常規',
  BUN: '腎功能', Cr: '腎功能', Ccr: '腎功能',
  GOT: '肝功能', GPT: '肝功能', 'T.Bil': '肝功能',
  HBV: '感染篩檢', HCV: '感染篩檢',
  CEA: '腫瘤標記', 'CA19-9': '腫瘤標記', 'CA-125': '腫瘤標記',
  PSA: '腫瘤標記', SCC: '腫瘤標記', LDH: '腫瘤標記',
  'Uric Acid': '其他', ALP: '其他', LVEF: '其他',
  'β2-MG': '腫瘤標記', IgG: '腫瘤標記', Calcium: '其他',
};

function groupItems(items: LabItem[]): Record<string, LabItem[]> {
  const result: Record<string, LabItem[]> = {};
  for (const item of items) {
    const group = NAME_TO_GROUP[item.name] ?? '其他';
    if (!result[group]) result[group] = [];
    result[group].push(item);
  }
  return result;
}

// ── Flag badge ────────────────────────────────────────────────────────────────

function FlagBadge({ flag }: { flag?: LabItem['flag'] }) {
  if (!flag) return <span className="text-slate-300 text-base">—</span>;
  if (flag === 'C') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-base font-bold border border-red-200">
        <AlertTriangle className="w-4 h-4" />
        危急
      </span>
    );
  }
  if (flag === 'H') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-base font-semibold border border-rose-200">
        <ArrowUp className="w-4 h-4" />
        偏高
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-600 text-base font-semibold border border-sky-200">
      <ArrowDown className="w-4 h-4" />
      偏低
    </span>
  );
}

// ── Single row ────────────────────────────────────────────────────────────────

function LabRow({ item }: { item: LabItem }) {
  const hasFlag = !!item.flag;
  const isCritical = item.flag === 'C';

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
      isCritical
        ? 'border-red-200 bg-red-50/60'
        : hasFlag
          ? 'border-amber-200/60 bg-amber-50/40'
          : 'border-slate-100 bg-white hover:bg-slate-50/60'
    }`}>
      {/* name */}
      <div className="w-32 flex-shrink-0">
        <span className="text-base font-semibold text-slate-700">{item.name}</span>
      </div>

      {/* value + unit */}
      <div className="w-36 flex items-baseline gap-1.5 flex-shrink-0">
        <span className={`text-base font-bold tabular-nums ${
          isCritical ? 'text-red-600' : item.flag === 'H' ? 'text-rose-600' : item.flag === 'L' ? 'text-sky-600' : 'text-slate-800'
        }`}>
          {item.value}
        </span>
        {item.unit && <span className="text-slate-400 text-base">{item.unit}</span>}
      </div>

      {/* ref range */}
      <div className="w-36 flex-shrink-0 text-base text-slate-500 tabular-nums">
        {item.refLow !== undefined && item.refHigh !== undefined
          ? `${item.refLow} – ${item.refHigh}`
          : '—'}
      </div>

      {/* flag */}
      <div className="w-24 flex-shrink-0">
        <FlagBadge flag={item.flag} />
      </div>

      {/* collected date */}
      <div className="flex-1 text-right text-base text-slate-400 font-mono">
        {item.collectedDate ?? ''}
      </div>
    </div>
  );
}

// ── Group section ─────────────────────────────────────────────────────────────

function LabGroup({ title, items }: { title: string; items: LabItem[] }) {
  const abnormal = items.filter(i => i.flag).length;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-600 text-base font-semibold">{title}</span>
        {abnormal > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-base font-bold">{abnormal} 異常</span>
        )}
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => <LabRow key={i} item={item} />)}
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface LabValuePanelProps {
  regimen: Regimen;
}

export default function LabValuePanel({ regimen }: LabValuePanelProps) {
  const groups = groupItems(regimen.labData ?? []);
  const orderedKeys = GROUP_ORDER.filter(k => groups[k]);
  const totalAbnormal = regimen.labData?.filter(i => i.flag).length ?? 0;
  const collectedDate = regimen.labData?.[0]?.collectedDate ?? '—';

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* header bar */}
      <div className="flex items-center gap-4 px-5 py-3.5 bg-white border-b border-slate-100 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-teal-500" />
          <span className="text-slate-700 text-base font-semibold">檢驗數值</span>
        </div>
        <div className="text-base text-slate-500">採檢日期：<span className="text-slate-700 font-medium font-mono">{collectedDate}</span></div>
        {totalAbnormal > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span className="text-rose-600 text-base font-semibold">{totalAbnormal} 項異常</span>
          </div>
        )}
        <div className="flex-1" />
        {regimen.bsa !== undefined && (
          <div className="text-base text-slate-500">BSA <span className="text-slate-700 font-semibold">{regimen.bsa} m²</span></div>
        )}
        {regimen.cycle !== undefined && (
          <div className="text-base text-slate-500">Cycle <span className="text-slate-700 font-semibold">{regimen.cycle}</span></div>
        )}
        {regimen.portStatus && (
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-base text-slate-500">Port-A</span>
            <span className={`text-base font-semibold px-2 py-0.5 rounded-full border ${
              regimen.portStatus === 'good'
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>{regimen.portStatus}</span>
          </div>
        )}
        {regimen.nadirWBC && (
          <div className="text-base text-slate-500">Nadir WBC <span className="text-slate-700 font-semibold font-mono">{regimen.nadirWBC} K/uL</span></div>
        )}
      </div>

      {/* column headers */}
      <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100 flex-shrink-0">
        <div className="w-32 flex-shrink-0 text-slate-400 text-base font-semibold">項目</div>
        <div className="w-36 flex-shrink-0 text-slate-400 text-base font-semibold">數值</div>
        <div className="w-36 flex-shrink-0 text-slate-400 text-base font-semibold">參考範圍</div>
        <div className="w-24 flex-shrink-0 text-slate-400 text-base font-semibold">旗標</div>
        <div className="flex-1 text-right text-slate-400 text-base font-semibold">採檢日</div>
      </div>

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 min-h-0">
        {orderedKeys.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-base">尚無檢驗資料</div>
        ) : (
          orderedKeys.map(key => <LabGroup key={key} title={key} items={groups[key]} />)
        )}
      </div>
    </div>
  );
}

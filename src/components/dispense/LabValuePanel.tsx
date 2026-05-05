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
  if (!flag) return null;
  if (flag === 'C') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-bold border border-red-200">
        <AlertTriangle className="w-3 h-3" />
        危急
      </span>
    );
  }
  if (flag === 'H') {
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-xs font-semibold border border-rose-200">
        <ArrowUp className="w-3 h-3" />
        H
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-600 text-xs font-semibold border border-sky-200">
      <ArrowDown className="w-3 h-3" />
      L
    </span>
  );
}

// ── Ref bar ───────────────────────────────────────────────────────────────────

function RefBar({ item }: { item: LabItem }) {
  if (item.refLow === undefined || item.refHigh === undefined) return null;
  const val = parseFloat(item.value);
  if (isNaN(val)) return null;

  const range = item.refHigh - item.refLow;
  const padding = range * 0.4;
  const min = item.refLow - padding;
  const max = item.refHigh + padding;
  const span = max - min;

  const pctLow  = ((item.refLow  - min) / span) * 100;
  const pctHigh = ((item.refHigh - min) / span) * 100;
  const pctVal  = Math.min(100, Math.max(0, ((val - min) / span) * 100));

  const dotColor = item.flag === 'C' ? 'bg-red-500' : item.flag === 'H' ? 'bg-rose-500' : item.flag === 'L' ? 'bg-sky-500' : 'bg-teal-500';

  return (
    <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-visible">
      {/* normal range band */}
      <div
        className="absolute top-0 h-full rounded-full bg-teal-100"
        style={{ left: `${pctLow}%`, width: `${pctHigh - pctLow}%` }}
      />
      {/* value dot */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow ${dotColor}`}
        style={{ left: `calc(${pctVal}% - 6px)` }}
      />
    </div>
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
          ? 'border-slate-200 bg-amber-50/40'
          : 'border-slate-100 bg-white hover:bg-slate-50/60'
    }`}>
      {/* name */}
      <div className="w-28 flex-shrink-0">
        <span className={`text-sm font-semibold ${isCritical ? 'text-red-700' : hasFlag ? 'text-slate-700' : 'text-slate-700'}`}>
          {item.name}
        </span>
      </div>

      {/* value + unit */}
      <div className="w-32 flex items-baseline gap-1.5 flex-shrink-0">
        <span className={`text-base font-bold tabular-nums ${
          isCritical ? 'text-red-600' : item.flag === 'H' ? 'text-rose-600' : item.flag === 'L' ? 'text-sky-600' : 'text-slate-800'
        }`}>
          {item.value}
        </span>
        {item.unit && <span className="text-slate-400 text-xs">{item.unit}</span>}
      </div>

      {/* flag */}
      <div className="w-16 flex-shrink-0">
        <FlagBadge flag={item.flag} />
      </div>

      {/* ref range text */}
      <div className="w-28 flex-shrink-0 text-slate-400 text-xs tabular-nums">
        {item.refLow !== undefined && item.refHigh !== undefined
          ? `${item.refLow} – ${item.refHigh}`
          : '—'}
      </div>

      {/* ref bar */}
      <div className="flex-1 min-w-0 px-2">
        <RefBar item={item} />
      </div>

      {/* collected date */}
      <div className="w-24 flex-shrink-0 text-right text-slate-400 text-xs font-mono">
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
        <span className="text-slate-600 text-sm font-semibold">{title}</span>
        {abnormal > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold">{abnormal} 異常</span>
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
      <div className="flex items-center gap-4 px-5 py-3.5 bg-white border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-teal-500" />
          <span className="text-slate-700 text-base font-semibold">檢驗數值</span>
        </div>
        <div className="text-slate-400 text-sm">採檢日期：<span className="text-slate-600 font-medium font-mono">{collectedDate}</span></div>
        {totalAbnormal > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-rose-600 text-sm font-semibold">{totalAbnormal} 項異常</span>
          </div>
        )}
        <div className="flex-1" />
        {/* extra context */}
        {regimen.bsa !== undefined && (
          <div className="text-slate-500 text-sm">BSA <span className="text-slate-700 font-semibold">{regimen.bsa} m²</span></div>
        )}
        {regimen.cycle !== undefined && (
          <div className="text-slate-500 text-sm">Cycle <span className="text-slate-700 font-semibold">{regimen.cycle}</span></div>
        )}
        {regimen.portStatus && (
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 text-sm">Port-A</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              regimen.portStatus === 'good'
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>{regimen.portStatus}</span>
          </div>
        )}
        {regimen.nadirWBC && (
          <div className="text-slate-500 text-sm">Nadir WBC <span className="text-slate-700 font-semibold font-mono">{regimen.nadirWBC} K/uL</span></div>
        )}
      </div>

      {/* column headers */}
      <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100 flex-shrink-0">
        <div className="w-28 flex-shrink-0 text-slate-400 text-xs font-semibold tracking-wide uppercase">項目</div>
        <div className="w-32 flex-shrink-0 text-slate-400 text-xs font-semibold tracking-wide uppercase">數值</div>
        <div className="w-16 flex-shrink-0 text-slate-400 text-xs font-semibold tracking-wide uppercase">旗標</div>
        <div className="w-28 flex-shrink-0 text-slate-400 text-xs font-semibold tracking-wide uppercase">參考範圍</div>
        <div className="flex-1 text-slate-400 text-xs font-semibold tracking-wide uppercase px-2">範圍圖</div>
        <div className="w-24 text-right text-slate-400 text-xs font-semibold tracking-wide uppercase">採檢日</div>
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

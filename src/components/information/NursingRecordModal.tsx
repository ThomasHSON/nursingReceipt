import { useState } from 'react';
import { X, Thermometer, Heart, Wind, Activity, Syringe, ClipboardList, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { Regimen } from '../../types';

type NursingPhase = 'pre' | 'during' | 'post';

interface NursingRecordModalProps {
  regimen: Regimen;
  onClose: () => void;
}

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_STATUS = '未報到';
const MOCK_DAYS = 1;

const MOCK_PRE = {
  bodyTemp: '36.8',
  pulse: '78',
  breath: '18',
  bp1: '122',
  bp2: '76',
  routes: [
    { type: '周邊靜脈留置針', site: '左手背', gauge: '22G', bloodReturn: true, flushOk: true },
  ],
  assessments: [
    { label: '嘔吐',     grade: 0 },
    { label: '感覺神經', grade: 1 },
    { label: '食慾不振', grade: 1 },
    { label: '皮膚',     grade: 0 },
    { label: '黏膜炎',   grade: 0 },
    { label: '腹瀉',     grade: 0 },
    { label: '疲倦',     grade: 1 },
    { label: '疼痛',     grade: 0 },
  ],
};

const MOCK_DURING = [
  { time: '09:15', note: '化療藥物開始施打，滴速設定 100 ml/hr，注射部位無紅腫熱痛。' },
  { time: '09:45', note: '病人徵象平穩，無主訴不適，持續觀察中。' },
  { time: '10:30', note: '輸注進行至 50%，注射部位通暢，病人無過敏反應。' },
  { time: '11:15', note: '化療藥物輸注完成，生命徵象穩定，管路移除。' },
];

const MOCK_POST = {
  endDate: '2026-03-10',
  endTime: '11:20',
  bodyTemp: '36.9',
  pulse: '80',
  breath: '17',
  bp1: '118',
  bp2: '74',
  education: [
    '體溫超過 38°C（發燒）請立即返院就診。',
    '出現嚴重嘔吐或無法進食請立即返院就診。',
    '注射部位出現紅腫、疼痛或硬結請立即返院就診。',
    '出現嚴重腹瀉（每日超過 4 次）請立即返院就診。',
    '出現皮膚異常反應（皮疹、水泡）請立即返院就診。',
    '下次化療預約時間請依照醫師指示準時回診。',
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function VitalRow({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 min-w-[90px]">
      <span className="text-slate-400 text-xs">{label}</span>
      <span className="text-slate-800 text-lg font-bold font-mono">{value}</span>
      <span className="text-slate-400 text-xs">{unit}</span>
    </div>
  );
}

function GradePip({ grade }: { grade: number }) {
  const colors = ['bg-slate-200', 'bg-emerald-400', 'bg-amber-400', 'bg-orange-500', 'bg-red-600'];
  const labels = ['G0', 'G1', 'G2', 'G3', 'G4'];
  return (
    <div className="flex items-center gap-1.5">
      {colors.map((c, i) => (
        <div
          key={i}
          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i === grade ? c + ' text-white ring-2 ring-offset-1 ring-slate-300' : 'bg-slate-100 text-slate-300'}`}
        >
          {i}
        </div>
      ))}
      <span className="text-slate-500 text-sm ml-1">{labels[grade]}</span>
    </div>
  );
}

// ── Phase panels ─────────────────────────────────────────────────────────────

function PrePanel() {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-sky-500" />
          <span className="text-slate-700 text-base font-semibold">生命徵象</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <VitalRow label="體溫" value={MOCK_PRE.bodyTemp} unit="°C" />
          <VitalRow label="脈搏" value={MOCK_PRE.pulse} unit="次/分" />
          <VitalRow label="呼吸" value={MOCK_PRE.breath} unit="次/分" />
          <div className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
            <span className="text-slate-400 text-xs">血壓</span>
            <span className="text-slate-800 text-lg font-bold font-mono">
              {MOCK_PRE.bp1}/{MOCK_PRE.bp2}
            </span>
            <span className="text-slate-400 text-xs">mmHg</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Syringe className="w-4 h-4 text-sky-500" />
          <span className="text-slate-700 text-base font-semibold">管路與注射評估</span>
        </div>
        <div className="space-y-2">
          {MOCK_PRE.routes.map((r, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-0.5">管路類型</p>
                <p className="text-slate-700 font-medium">{r.type}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">注射部位</p>
                <p className="text-slate-700 font-medium">{r.site}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">針號</p>
                <p className="text-slate-700 font-medium">{r.gauge}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">反抽有血</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${r.bloodReturn ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {r.bloodReturn ? '是' : '否'}
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">推注順暢</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${r.flushOk ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {r.flushOk ? '是' : '否'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="w-4 h-4 text-sky-500" />
          <span className="text-slate-700 text-base font-semibold">副作用預選評估</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MOCK_PRE.assessments.map((a) => (
            <div key={a.label} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
              <span className="text-slate-600 text-base">{a.label}</span>
              <GradePip grade={a.grade} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DuringPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-4 h-4 text-amber-500" />
        <span className="text-slate-700 text-base font-semibold">施打過程觀察紀錄</span>
      </div>
      <div className="relative">
        <div className="absolute left-[52px] top-3 bottom-3 w-px bg-slate-200" />
        <div className="space-y-3">
          {MOCK_DURING.map((entry, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="w-[52px] text-right text-slate-500 text-base font-mono flex-shrink-0 pt-3">{entry.time}</span>
              <div className="flex items-start gap-3 flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700 text-base leading-relaxed">{entry.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostPanel() {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-700 text-base font-semibold">結束時生命徵象</span>
          <span className="text-slate-400 text-sm font-mono ml-auto">{MOCK_POST.endDate} {MOCK_POST.endTime}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <VitalRow label="體溫" value={MOCK_POST.bodyTemp} unit="°C" />
          <VitalRow label="脈搏" value={MOCK_POST.pulse} unit="次/分" />
          <VitalRow label="呼吸" value={MOCK_POST.breath} unit="次/分" />
          <div className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
            <span className="text-slate-400 text-xs">血壓</span>
            <span className="text-slate-800 text-lg font-bold font-mono">
              {MOCK_POST.bp1}/{MOCK_POST.bp2}
            </span>
            <span className="text-slate-400 text-xs">mmHg</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-700 text-base font-semibold">返家衛教內容</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2">
          {MOCK_POST.education.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-slate-700 text-base leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

const PHASES: { key: NursingPhase; label: string; labelEn: string }[] = [
  { key: 'pre',    label: '化療前', labelEn: 'Pre-Chemo' },
  { key: 'during', label: '化療中', labelEn: 'During Chemo' },
  { key: 'post',   label: '化療後', labelEn: 'Post-Chemo' },
];

const PHASE_ACCENT: Record<NursingPhase, string> = {
  pre:    'bg-sky-500 text-white shadow-[0_2px_10px_rgba(14,165,233,0.35)]',
  during: 'bg-amber-500 text-white shadow-[0_2px_10px_rgba(245,158,11,0.35)]',
  post:   'bg-emerald-500 text-white shadow-[0_2px_10px_rgba(16,185,129,0.35)]',
};

const PHASE_INACTIVE: Record<NursingPhase, string> = {
  pre:    'text-sky-600 hover:bg-sky-50 border border-sky-200/70',
  during: 'text-amber-600 hover:bg-amber-50 border border-amber-200/70',
  post:   'text-emerald-600 hover:bg-emerald-50 border border-emerald-200/70',
};

export default function NursingRecordModal({ regimen, onClose }: NursingRecordModalProps) {
  const [phase, setPhase] = useState<NursingPhase>('pre');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div className="relative z-10 w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 flex flex-col max-h-[90vh]">
        {/* header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-slate-800 text-lg font-bold">護理紀錄</span>
              <span className="text-slate-400">—</span>
              <span className="text-slate-700 font-semibold">{regimen.patientName}</span>
              <span className="text-slate-400 font-mono text-sm">{regimen.chartNumber}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold border border-amber-200/60">
                {MOCK_STATUS}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-sm border border-slate-200/60">
                第 {MOCK_DAYS} 天
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* phase tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-0 flex-shrink-0">
          {PHASES.map(p => (
            <button
              key={p.key}
              onClick={() => setPhase(p.key)}
              className={`flex flex-col items-center px-6 py-2.5 rounded-xl text-base font-semibold transition-all duration-150 ${
                phase === p.key ? PHASE_ACCENT[p.key] : PHASE_INACTIVE[p.key] + ' bg-transparent'
              }`}
            >
              <span>{p.label}</span>
              <span className={`text-xs font-normal mt-0.5 ${phase === p.key ? 'text-white/80' : 'text-slate-400'}`}>{p.labelEn}</span>
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-slate-400 text-sm font-mono">{regimen.admissionNumber}</span>
        </div>

        {/* divider */}
        <div className="mx-6 mt-3 mb-0 h-px bg-slate-100" />

        {/* body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          {phase === 'pre'    && <PrePanel />}
          {phase === 'during' && <DuringPanel />}
          {phase === 'post'   && <PostPanel />}
        </div>
      </div>
    </div>
  );
}

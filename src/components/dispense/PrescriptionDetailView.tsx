import { useState } from 'react';
import { ArrowLeft, Ruler, Weight, Calendar, Stethoscope, BookOpen, FileText, AlertTriangle, BarChart2, FlaskConical, Building2, ClipboardList, Bot, CheckCircle2, User } from 'lucide-react';
import { Regimen, DrugItem } from '../../types';
import DrugTable from './DrugTable';
import NursingRecordModal from '../information/NursingRecordModal';
import ChemoAssistantModal from './ChemoAssistantModal';
import LabValuePanel from './LabValuePanel';

type CardKey = 'receivable' | 'treating';
type QueryTab = 'main' | 'treatment' | 'variation' | 'labvalue';

const QUERY_TABS: { key: QueryTab; label: string }[] = [
  { key: 'treatment', label: '計劃治療書' },
  { key: 'variation', label: '變異紀錄' },
  { key: 'labvalue', label: '檢驗數值' },
];

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

interface PrescriptionDetailViewProps {
  regimen: Regimen;
  cardKey: CardKey;
  onBack: () => void;
}

export default function PrescriptionDetailView({ regimen, cardKey, onBack }: PrescriptionDetailViewProps) {
  const [activeTab, setActiveTab] = useState<QueryTab>('main');
  const [drugs] = useState<DrugItem[]>(regimen.drugs);
  const [nursingOpen, setNursingOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [endConfirming, setEndConfirming] = useState(false);
  const [endConfirmed, setEndConfirmed] = useState(false);

  function handleEndTreatment() {
    setEndConfirmed(true);
    setTimeout(() => onBack(), 1000);
  }

  const patientType = regimen.admissionNumber ? 'inpatient' : 'outpatient';
  const mainLabel = cardKey === 'receivable' ? '簽收' : '查看';

  return (
    <div className="flex flex-col flex-1 gap-4 px-4 pb-2 min-h-0">
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/70 border border-transparent hover:border-slate-200/60 transition-all duration-150 text-base font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          返回清單
        </button>

        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <div>
            <span className="text-slate-800 font-bold text-lg">{regimen.patientName}</span>
            <span className="text-slate-400 mx-2">—</span>
            <span className="text-slate-500 font-mono text-base">{regimen.chartNumber}</span>
          </div>
          <span className={patientType === 'outpatient' ? 'tag-outpatient' : 'tag-inpatient'}>
            {patientType === 'outpatient' ? '門診' : '住院'}
          </span>
          {patientType === 'inpatient' && regimen.admissionNumber && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60">
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-700 text-sm font-mono font-semibold">{regimen.admissionNumber}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-[0_2px_12px_rgba(14,165,233,0.35)] hover:shadow-[0_4px_18px_rgba(14,165,233,0.45)] hover:brightness-105 active:scale-[0.97] transition-all duration-200 flex-shrink-0"
        >
          <Bot className="w-4 h-4" />
          化療助手
        </button>

        <button
          onClick={() => setNursingOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-base font-semibold bg-teal-500 text-white shadow-[0_2px_12px_rgba(20,184,166,0.35)] hover:bg-teal-600 hover:shadow-[0_4px_18px_rgba(20,184,166,0.45)] active:scale-[0.97] transition-all duration-200 flex-shrink-0"
        >
          <ClipboardList className="w-4 h-4" />
          護理紀錄
        </button>

        <select
          value={activeTab}
          onChange={e => setActiveTab(e.target.value as QueryTab)}
          className="bg-white/70 border border-slate-200/70 rounded-xl px-3 py-1 text-base font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300/50 focus:border-sky-300 transition-all cursor-pointer"
        >
          <option value="main">{mainLabel}</option>
          {QUERY_TABS.map(tab => (
            <option key={tab.key} value={tab.key}>{tab.label}</option>
          ))}
        </select>
      </div>

      {nursingOpen && (
        <NursingRecordModal regimen={regimen} onClose={() => setNursingOpen(false)} />
      )}
      {assistantOpen && (
        <ChemoAssistantModal regimen={regimen} onClose={() => setAssistantOpen(false)} />
      )}

      {activeTab === 'labvalue' && (
        <div className="flex-1 glass-card-solid overflow-hidden flex flex-col min-h-0">
          <LabValuePanel regimen={regimen} />
        </div>
      )}

      {activeTab !== 'main' && activeTab !== 'labvalue' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card px-10 py-8 text-center">
            <p className="text-slate-600 text-base font-medium">{QUERY_TABS.find(t => t.key === activeTab)?.label} 功能建置中</p>
            <p className="text-slate-400 text-base mt-1.5">Under Development</p>
          </div>
        </div>
      )}

      {activeTab === 'main' && (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          <div className="glass-card-solid px-5 py-4 flex-shrink-0">
            <div className="space-y-2.5">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 text-base font-semibold">
                    {calcAge(regimen.birthDate)}歲
                  </span>
                  <span className="text-slate-400 text-sm font-mono">({regimen.birthDate})</span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 text-base font-semibold">{regimen.height} cm</span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Weight className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 text-base font-semibold">{regimen.weight} kg</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 text-base font-semibold font-mono">{regimen.effectiveDateTime}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-slate-400 text-base w-16 flex-shrink-0">診斷</span>
                <span className="text-slate-800 text-base font-semibold">{regimen.diagnosis}</span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-slate-400 text-base w-16 flex-shrink-0">科別</span>
                <span className="text-slate-800 text-base font-semibold">{regimen.department}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-base">開立醫師</span>
                  <span className="text-slate-700 text-base font-semibold">{regimen.prescribingDoctor}</span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-base">審核醫師</span>
                  <span className="text-slate-700 text-base font-semibold">{regimen.reviewingDoctor}</span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-base">審核藥師</span>
                  <span className="text-slate-700 text-base font-semibold">{regimen.reviewingPharmacist || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card-solid flex-1 flex flex-col min-h-0 overflow-hidden">
            <DrugTable drugs={drugs} checkable={false} />
          </div>

          {cardKey === 'receivable' && (
            <div className="flex items-center justify-end glass-card px-5 py-3 flex-shrink-0">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-base font-semibold bg-amber-500 text-white shadow-[0_2px_16px_rgba(245,158,11,0.35)] hover:bg-amber-600 hover:shadow-[0_4px_22px_rgba(245,158,11,0.45)] active:scale-[0.97] transition-all duration-200 cursor-pointer">
                確認簽收
              </button>
            </div>
          )}

          {cardKey === 'treating' && (
            <div className="flex items-center justify-end glass-card px-5 py-3 flex-shrink-0">
              {endConfirmed ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold text-base">
                  <CheckCircle2 className="w-5 h-5" />
                  治療結束已確認
                </div>
              ) : (
                <button
                  onClick={() => setEndConfirming(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-base font-semibold bg-green-600 text-white shadow-[0_2px_16px_rgba(22,163,74,0.35)] hover:bg-green-700 hover:shadow-[0_4px_22px_rgba(22,163,74,0.45)] active:scale-[0.97] transition-all duration-200 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  治療結束
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {endConfirming && !endConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEndConfirming(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200/60 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-slate-800 font-bold text-base">確認治療結束</p>
                <p className="text-slate-500 text-sm">此操作將完成本次治療</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-800 font-semibold">{regimen.patientName}</span>
                <span className="text-slate-400 font-mono text-sm">{regimen.chartNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 text-sm">{regimen.diagnosis}</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm">確認完成本次治療作業，此處方將從治療中清單移除。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setEndConfirming(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleEndTreatment}
                className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 shadow-[0_2px_12px_rgba(22,163,74,0.35)] transition-all active:scale-[0.97]"
              >
                確認結束
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

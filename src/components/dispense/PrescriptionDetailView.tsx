import { useState } from 'react';
import { ArrowLeft, Ruler, Weight, Calendar, Stethoscope, FlaskConical, BookOpen, FileText, AlertTriangle, BarChart2, CheckCircle2, ClipboardCheck, Building2 } from 'lucide-react';
import { DispenseStatus, Regimen, DrugItem } from '../../types';
import DrugTable from './DrugTable';

type QueryTab = 'main' | 'regimen' | 'treatment' | 'project' | 'variation' | 'labvalue' | 'alert';

const QUERY_TABS: { key: QueryTab; label: string; icon: React.ReactNode }[] = [
  { key: 'regimen', label: 'Regimen', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { key: 'treatment', label: '計劃治療書', icon: <FileText className="w-3.5 h-3.5" /> },
  { key: 'project', label: '專案用藥', icon: <FlaskConical className="w-3.5 h-3.5" /> },
  { key: 'variation', label: '變異紀錄', icon: <BarChart2 className="w-3.5 h-3.5" /> },
  { key: 'labvalue', label: '檢驗數值', icon: <Stethoscope className="w-3.5 h-3.5" /> },
  { key: 'alert', label: '異常提醒', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
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
  status: DispenseStatus;
  onBack: () => void;
}

export default function PrescriptionDetailView({ regimen, status, onBack }: PrescriptionDetailViewProps) {
  const [activeTab, setActiveTab] = useState<QueryTab>('main');
  const [drugs, setDrugs] = useState<DrugItem[]>(regimen.drugs);

  const patientType = regimen.admissionNumber ? 'inpatient' : 'outpatient';

  const handleToggle = (id: string) => {
    setDrugs(prev => prev.map(d => d.id === id ? { ...d, checked: !d.checked } : d));
  };

  const isUnexamined = status === 'unexamined';
  const checkedCount = drugs.filter(d => d.checked).length;
  const allChecked = drugs.length > 0 && checkedCount === drugs.length;
  const showConfirmBtn = (status === 'preparing' || status === 'dispense') && activeTab === 'main';
  const confirmLabel = status === 'preparing' ? '確認備藥完成' : '確認調劑完成';
  const mainLabel = status === 'dispense' ? '調劑' : status === 'preparing' ? '備藥' : status === 'unexamined' ? '審核' : '已完成';

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
          {isUnexamined && (
            <span className="px-2.5 py-0.5 rounded-full text-sm font-semibold bg-rose-100 text-rose-600 border border-rose-200/60">
              待審核
            </span>
          )}
        </div>

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

      {activeTab !== 'main' && (
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
            {!isUnexamined && checkedCount > 0 && (
              <div className="px-4 py-2 border-b border-slate-100 flex-shrink-0 flex justify-end">
                <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                  已備 {checkedCount} / {drugs.length}
                </span>
              </div>
            )}
            <DrugTable
              drugs={isUnexamined ? regimen.drugs : drugs}
              checkable={!isUnexamined}
              onToggle={isUnexamined ? undefined : handleToggle}
            />
          </div>

          {isUnexamined && (
            <div className="flex items-center justify-between glass-card px-5 py-3 flex-shrink-0">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500 text-base">請確認處方內容後進行審核</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all duration-200 cursor-pointer">
                  退回
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-base font-semibold bg-sky-500 text-white shadow-[0_2px_16px_rgba(14,165,233,0.35)] hover:bg-sky-600 hover:shadow-[0_4px_22px_rgba(14,165,233,0.45)] active:scale-[0.97] transition-all duration-200 cursor-pointer">
                  <ClipboardCheck className="w-4 h-4" />
                  確認審核通過
                </button>
              </div>
            </div>
          )}

          {showConfirmBtn && (
            <div className="flex items-center justify-between glass-card px-5 py-3 flex-shrink-0">
              <div className={`flex items-center gap-1.5 text-base font-medium ${allChecked ? 'text-emerald-600' : 'text-slate-400'}`}>
                <CheckCircle2 className={`w-4 h-4 ${allChecked ? 'text-emerald-500' : 'text-slate-300'}`} />
                {allChecked
                  ? '所有藥品已勾選，可確認送出'
                  : `尚有 ${drugs.length - checkedCount} 項藥品未勾選`}
              </div>

              <button
                disabled={!allChecked}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                  allChecked
                    ? 'bg-emerald-500 text-white shadow-[0_2px_16px_rgba(16,185,129,0.35)] hover:bg-emerald-600 hover:shadow-[0_4px_22px_rgba(16,185,129,0.45)] active:scale-[0.97] cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {confirmLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

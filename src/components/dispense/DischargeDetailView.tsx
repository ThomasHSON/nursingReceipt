import { useState } from 'react';
import { ArrowLeft, Calendar, Ruler, Weight, User, Stethoscope, Building2, CheckCircle2, ClipboardList, ChevronRight, Clock } from 'lucide-react';
import { Regimen } from '../../types';
import DrugTable from './DrugTable';

function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const DISCHARGE_CHECKLIST = [
  { id: 'c1', label: '療程藥品全數確認交回或銷毀' },
  { id: 'c2', label: 'Port-A / PICC 管路已妥善封管' },
  { id: 'c3', label: '返家衛教說明已完成並簽署' },
  { id: 'c4', label: '離院用藥（口服藥）已備妥並說明' },
  { id: 'c5', label: '後續回診日期已告知病人' },
  { id: 'c6', label: '緊急聯絡資訊已提供' },
];

interface DischargeDetailViewProps {
  regimen: Regimen;
  onBack: () => void;
  onConfirm: (regimen: Regimen) => void;
}

export default function DischargeDetailView({ regimen, onBack, onConfirm }: DischargeDetailViewProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const allChecked = checked.size === DISCHARGE_CHECKLIST.length;

  function toggleCheck(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    if (!allChecked) return;
    setConfirming(true);
  }

  function handleFinalConfirm() {
    setConfirmed(true);
    setTimeout(() => onConfirm(regimen), 1200);
  }

  return (
    <div className="flex flex-col flex-1 gap-4 px-4 pb-2 min-h-0">
      {/* top bar */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/70 border border-transparent hover:border-slate-200/60 transition-all duration-150 text-base font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          返回清單
        </button>
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <span className="text-slate-800 font-bold text-lg">{regimen.patientName}</span>
          <span className="text-slate-400 mx-1">—</span>
          <span className="text-slate-500 font-mono text-base">{regimen.chartNumber}</span>
          {regimen.admissionNumber && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60">
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-700 text-sm font-mono font-semibold">{regimen.admissionNumber}</span>
            </div>
          )}
        </div>
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
          待離院確認
        </span>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* left: patient info + drugs */}
        <div className="flex flex-col gap-3 flex-1 min-h-0 min-w-0">
          {/* patient info */}
          <div className="glass-card-solid px-5 py-4 flex-shrink-0">
            <div className="space-y-2.5">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 text-base font-semibold">{calcAge(regimen.birthDate)}歲</span>
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
                  <Clock className="w-4 h-4 text-slate-400" />
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
                  <span className="text-slate-400 text-base">審核藥師</span>
                  <span className="text-slate-700 text-base font-semibold">{regimen.reviewingPharmacist || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* drug table */}
          <div className="glass-card-solid flex-1 flex flex-col min-h-0 overflow-hidden">
            <DrugTable drugs={regimen.drugs} checkable={false} />
          </div>
        </div>

        {/* right: checklist + confirm */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-3">
          <div className="glass-card-solid flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-200/60 flex-shrink-0">
              <ClipboardList className="w-4 h-4 text-teal-600" />
              <h3 className="text-slate-800 font-bold text-base">離院確認清單</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
              {DISCHARGE_CHECKLIST.map((item) => {
                const isChecked = checked.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`flex items-start gap-3 w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                      isChecked
                        ? 'bg-teal-50 border-teal-200/70 text-teal-800'
                        : 'bg-white/60 border-slate-200/50 text-slate-700 hover:bg-slate-50/80 hover:border-slate-300/60'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isChecked ? 'border-teal-500 bg-teal-500' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm font-medium leading-snug">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="px-4 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-slate-500 text-sm">完成進度</span>
                <span className={`text-sm font-bold ${allChecked ? 'text-teal-600' : 'text-slate-500'}`}>
                  {checked.size} / {DISCHARGE_CHECKLIST.length}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${(checked.size / DISCHARGE_CHECKLIST.length) * 100}%` }}
                />
              </div>

              {confirmed ? (
                <div className="flex items-center justify-center gap-2 py-3 text-teal-600 font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  離院確認完成
                </div>
              ) : (
                <button
                  disabled={!allChecked}
                  onClick={handleConfirm}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                    allChecked
                      ? 'bg-teal-500 text-white shadow-[0_2px_12px_rgba(20,184,166,0.35)] hover:bg-teal-600 hover:shadow-[0_4px_18px_rgba(20,184,166,0.45)] active:scale-[0.97]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  確認離院
                  {allChecked && <ChevronRight className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* confirm modal */}
      {confirming && !confirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirming(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-slate-800 font-bold text-base">確認離院</p>
                <p className="text-slate-500 text-sm">此操作將完成離院流程</p>
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
            <p className="text-slate-600 text-sm">確認所有離院清單已核對完畢，即將完成本次住院離院作業。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleFinalConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 shadow-[0_2px_12px_rgba(20,184,166,0.35)] transition-all active:scale-[0.97]"
              >
                確認離院
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

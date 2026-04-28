import { Clock, FileText, Stethoscope, User, ArrowRight, Building2 } from 'lucide-react';
import { DispenseStatus, Regimen } from '../../types';

const STATUS_CAPSULE: Record<DispenseStatus, { label: string; className: string }> = {
  completed:  { label: '已完成',  className: 'bg-slate-100 text-slate-600 border border-slate-200' },
  delivering: { label: '運送中',  className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  received:   { label: '已簽收',  className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  finished:   { label: '療程結束', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
};

interface InfoPrescriptionCardProps {
  rx: Regimen;
  onSelect: (rx: Regimen) => void;
}

export default function InfoPrescriptionCard({ rx, onSelect }: InfoPrescriptionCardProps) {
  const capsule = STATUS_CAPSULE[rx.status];
  const patientType = rx.admissionNumber ? 'inpatient' : 'outpatient';

  return (
    <div
      onClick={() => onSelect(rx)}
      className="prescription-row group cursor-pointer"
    >
      <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${patientType === 'outpatient' ? 'bg-sky-400/70' : 'bg-amber-400/70'} group-hover:opacity-100 opacity-80`} />

      <div className="flex items-center gap-1.5 w-24 flex-shrink-0">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-600 text-xs font-mono">{rx.effectiveDateTime.split(' ')[1]}</span>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span className="text-slate-800 text-sm font-semibold truncate">{rx.patientName}</span>
      </div>

      <div className="flex items-center gap-1.5 w-28 flex-shrink-0">
        <FileText className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-500 text-xs font-mono">{rx.chartNumber}</span>
      </div>

      {patientType === 'inpatient' && rx.admissionNumber ? (
        <div className="flex items-center gap-1.5 w-36 flex-shrink-0">
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-700 text-xs font-mono truncate">{rx.admissionNumber}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 flex-1 min-w-0 flex-shrink-0">
          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 text-xs truncate">{rx.department}</span>
        </div>
      )}

      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${capsule.className}`}>
        {capsule.label}
      </span>

      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 flex-shrink-0 transition-colors" />
    </div>
  );
}

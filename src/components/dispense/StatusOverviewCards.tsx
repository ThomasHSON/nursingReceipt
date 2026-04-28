import { DispenseStatus, DispenseStatusStat } from '../../types';

interface StatusOverviewCardsProps {
  stats: DispenseStatusStat[];
  activeStatus: DispenseStatus | null;
  onSelect: (status: DispenseStatus) => void;
}

const STATUS_CONFIG: Record<
  DispenseStatus,
  { bg: string; numColor: string; labelColor: string; subColor: string; ringColor: string; accentBar: string }
> = {
  unexamined: {
    bg: 'bg-slate-100/70 hover:bg-slate-50/90',
    numColor: 'text-slate-700',
    labelColor: 'text-slate-800',
    subColor: 'text-slate-400',
    ringColor: 'ring-slate-400/40',
    accentBar: 'bg-slate-400',
  },
  preparing: {
    bg: 'bg-amber-50/70 hover:bg-amber-50/90',
    numColor: 'text-amber-600',
    labelColor: 'text-amber-800',
    subColor: 'text-amber-400',
    ringColor: 'ring-amber-400/40',
    accentBar: 'bg-amber-400',
  },
  dispense: {
    bg: 'bg-blue-50/70 hover:bg-blue-50/90',
    numColor: 'text-blue-600',
    labelColor: 'text-blue-800',
    subColor: 'text-blue-400',
    ringColor: 'ring-blue-400/40',
    accentBar: 'bg-blue-400',
  },
  completed: {
    bg: 'bg-emerald-50/70 hover:bg-emerald-50/90',
    numColor: 'text-emerald-600',
    labelColor: 'text-emerald-800',
    subColor: 'text-emerald-400',
    ringColor: 'ring-emerald-400/40',
    accentBar: 'bg-emerald-400',
  },
};

export default function StatusOverviewCards({ stats, activeStatus, onSelect }: StatusOverviewCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-5 p-3">
      {stats.map((stat) => {
        const cfg = STATUS_CONFIG[stat.status];
        const isActive = activeStatus === stat.status;

        return (
          <button
            key={stat.status}
            onClick={() => onSelect(stat.status)}
            className={`
              relative overflow-hidden
              ${cfg.bg}
              backdrop-blur-md
              border border-white/70
              rounded-2xl p-3
              flex flex-col items-center justify-center gap-3
              cursor-pointer select-none
              transition-all duration-300 ease-out
              hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-100/40
              active:scale-[0.98]
              min-h-[160px]
              shadow-md shadow-slate-200/40
              ${isActive ? `ring-2 ${cfg.ringColor} shadow-xl scale-[1.02]` : ''}
            `}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5">
              <div className={`h-full w-full ${cfg.accentBar} opacity-50`} />
            </div>
            <div className="absolute top-0 left-0 right-0 h-px bg-white/80" />

            <span className={`text-6xl font-extrabold tabular-nums ${cfg.numColor}`}>
              {stat.count}
            </span>
            <div className={`w-[60%] h-[2px] background-black my-8 ${cfg.accentBar} opacity-40`} />
            <div className="text-center">
              <p className={`text-2xl font-semibold leading-tight ${cfg.labelColor}`}>{stat.labelZh}</p>
              <p className={`text-sm tracking-widest mt-0.5 ${cfg.subColor}`}>{stat.labelEn}</p>
            </div>

            {isActive && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                <div className={`w-1 h-1 rounded-full ${cfg.accentBar} opacity-50`} />
                <div className={`w-5 h-1 rounded-full ${cfg.accentBar} opacity-80`} />
                <div className={`w-1 h-1 rounded-full ${cfg.accentBar} opacity-50`} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

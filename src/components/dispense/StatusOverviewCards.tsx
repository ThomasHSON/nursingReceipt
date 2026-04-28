type CardKey = 'receivable' | 'treating';

interface CardDef {
  key: CardKey;
  labelZh: string;
  labelEn: string;
}

interface StatusOverviewCardsProps {
  cards: CardDef[];
  activeCard: CardKey | null;
  onSelect: (card: CardKey) => void;
}

const CARD_CONFIG: Record<CardKey, {
  bg: string; numColor: string; labelColor: string; subColor: string; ringColor: string; accentBar: string;
}> = {
  receivable: {
    bg: 'bg-amber-50/70 hover:bg-amber-50/90',
    numColor: 'text-amber-600',
    labelColor: 'text-amber-800',
    subColor: 'text-amber-400',
    ringColor: 'ring-amber-400/40',
    accentBar: 'bg-amber-400',
  },
  treating: {
    bg: 'bg-blue-50/70 hover:bg-blue-50/90',
    numColor: 'text-blue-600',
    labelColor: 'text-blue-800',
    subColor: 'text-blue-400',
    ringColor: 'ring-blue-400/40',
    accentBar: 'bg-blue-400',
  },
};

export default function StatusOverviewCards({ cards, activeCard, onSelect }: StatusOverviewCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-5 p-3">
      {cards.map((card) => {
        const cfg = CARD_CONFIG[card.key];
        const isActive = activeCard === card.key;

        return (
          <button
            key={card.key}
            onClick={() => onSelect(card.key)}
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

            <div className="text-center">
              <p className={`text-2xl font-semibold leading-tight ${cfg.labelColor}`}>{card.labelZh}</p>
              <p className={`text-sm tracking-widest mt-0.5 ${cfg.subColor}`}>{card.labelEn}</p>
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

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DispenseStatus } from '../../types';
import { mockStatusStats, mockRegimens } from '../../data/mockData';
import StatusOverviewCards from './StatusOverviewCards';
import PrescriptionListDetail from './PrescriptionListDetail';
import DischargePage from './DischargePage';

type CardKey = 'receivable' | 'treating' | 'discharge';

const CARD_FILTER: Record<Exclude<CardKey, 'discharge'>, DispenseStatus[]> = {
  receivable: ['completed', 'delivering'],
  treating: ['received'],
};

const TAB_ACTIVE_COLOR: Record<CardKey, string> = {
  receivable: 'bg-amber-500/10 text-amber-700 border border-amber-300/50 shadow-sm',
  treating:   'bg-blue-500/10 text-blue-700 border border-blue-300/50 shadow-sm',
  discharge:  'bg-teal-500/10 text-teal-700 border border-teal-300/50 shadow-sm',
};

export default function DispensePage() {
  const [activeCard, setActiveCard] = useState<CardKey | null>(null);

  const handleSelectCard = (card: CardKey) => {
    setActiveCard((prev) => (prev === card ? null : card));
  };

  const handleBack = () => setActiveCard(null);

  const CARDS = [
    { key: 'receivable' as CardKey, labelZh: '可簽收', labelEn: 'Receivable' },
    { key: 'treating'  as CardKey, labelZh: '治療中', labelEn: 'Treating' },
    { key: 'discharge' as CardKey, labelZh: '離院流程', labelEn: 'Discharge' },
  ];

  const filteredRegimens =
    activeCard && activeCard !== 'discharge'
      ? mockRegimens.filter((rx) => CARD_FILTER[activeCard].includes(rx.status))
      : [];

  const showPrescriptionList = activeCard === 'receivable' || activeCard === 'treating';
  const activeStat = showPrescriptionList
    ? mockStatusStats.find((s) =>
        activeCard === 'receivable' ? s.status === 'delivering' : s.status === 'received'
      )
    : true;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {!activeCard ? (
        <>
          <StatusOverviewCards
            cards={CARDS}
            activeCard={activeCard}
            onSelect={handleSelectCard}
          />
          <div className="flex-1 flex items-center justify-center px-6 pb-6">
            <div className="glass-card px-10 py-8 text-center max-w-md">
              <p className="text-slate-600 text-base font-medium">請選擇狀態卡片以查看詳細清單</p>
              <p className="text-slate-400 text-sm mt-1.5">Select a status card to view details</p>
            </div>
          </div>
        </>
      ) : (
        activeStat && (
          <>
            <div className="px-6 pt-3 mb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {CARDS.map((card) => {
                    const count =
                      card.key === 'discharge'
                        ? mockRegimens.filter(rx => rx.status === 'discharging').length
                        : mockRegimens.filter(rx => CARD_FILTER[card.key as Exclude<CardKey, 'discharge'>].includes(rx.status)).length;
                    return (
                      <button
                        key={card.key}
                        onClick={() => setActiveCard(card.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          activeCard === card.key
                            ? TAB_ACTIVE_COLOR[card.key]
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/60 border border-transparent'
                        }`}
                      >
                        {card.labelZh}
                        <span className="ml-2 text-xs opacity-60">({count})</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="text-slate-700 text-sm font-semibold hover:text-slate-500 transition-colors duration-200 cursor-pointer select-none"
                  >
                    功能選單
                  </button>
                  <button className="glass-btn flex items-center gap-2 px-3 py-1.5 text-sm">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>重新整理</span>
                  </button>
                </div>
              </div>
            </div>

            {activeCard === 'discharge' ? (
              <DischargePage />
            ) : (
              <PrescriptionListDetail
                key={activeCard}
                cardKey={activeCard}
                regimens={filteredRegimens}
              />
            )}
          </>
        )
      )}
    </div>
  );
}

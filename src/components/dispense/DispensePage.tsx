import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { DispenseStatus } from '../../types';
import { mockStatusStats, mockRegimens } from '../../data/mockData';
import StatusOverviewCards from './StatusOverviewCards';
import PrescriptionListDetail from './PrescriptionListDetail';

type CardKey = 'receivable' | 'treating';

const CARD_FILTER: Record<CardKey, DispenseStatus[]> = {
  receivable: ['completed', 'delivering'],
  treating: ['received'],
};

export default function DispensePage() {
  const [activeCard, setActiveCard] = useState<CardKey | null>(null);

  const handleSelectCard = (card: CardKey) => {
    setActiveCard((prev) => (prev === card ? null : card));
  };

  const handleBack = () => setActiveCard(null);

  const filteredRegimens = activeCard
    ? mockRegimens.filter((rx) => CARD_FILTER[activeCard].includes(rx.status))
    : [];

  const activeStat = activeCard
    ? mockStatusStats.find((s) =>
        activeCard === 'receivable'
          ? s.status === 'delivering'
          : s.status === 'received'
      )
    : undefined;

  const CARDS = [
    { key: 'receivable' as CardKey, labelZh: '可簽收', labelEn: 'Receivable' },
    { key: 'treating' as CardKey, labelZh: '治療中', labelEn: 'Treating' },
  ];

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
                  {CARDS.map((card) => (
                    <button
                      key={card.key}
                      onClick={() => setActiveCard(card.key)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeCard === card.key
                          ? 'bg-blue-500/12 text-blue-700 border border-blue-300/50 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-white/60 border border-transparent'
                      }`}
                    >
                      {card.labelZh}
                      <span className="ml-2 text-xs opacity-60">
                        ({mockRegimens.filter(rx => CARD_FILTER[card.key].includes(rx.status)).length})
                      </span>
                    </button>
                  ))}
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

            <PrescriptionListDetail
              key={activeCard}
              cardKey={activeCard}
              regimens={filteredRegimens}
            />
          </>
        )
      )}
    </div>
  );
}

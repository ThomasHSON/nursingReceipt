import { CircleUser, LogOut } from 'lucide-react';
import { TabKey, User } from '../types';
import logoImage from '../assets/chemo-logo.png';

interface Tab {
  key: TabKey;
  labelZh: string;
  labelEn: string;
}

const TABS: Tab[] = [
  { key: 'dispense', labelZh: '調劑排程', labelEn: 'DISPENSE' },
  { key: 'information', labelZh: '審核資訊', labelEn: 'INFORMATION' },
  { key: 'inventory', labelZh: '庫存管理', labelEn: 'INVENTORY' },
  { key: 'setting', labelZh: '系統設定', labelEn: 'SETTING' },
];

interface HeaderNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  currentUser: User;
  onLogout: () => void;
}

export default function HeaderNav({ activeTab, onTabChange, currentUser, onLogout }: HeaderNavProps) {
  return (
    <header className="w-full bg-white/65 backdrop-blur-xl py-2 border-b border-white/80 shadow-sm shadow-blue-100/40">
      <div className="flex items-center h-16 px-6 gap-4">
        <div className="flex items-center flex-shrink-0">
          <img src={logoImage} alt="Chemo Pharmacy Logo" className="h-12 w-auto object-contain" />
        </div>
        

        <nav className="flex-1 flex items-center justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`
                relative px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide
                transition-all duration-200 cursor-pointer select-none
                ${activeTab === tab.key
                  ? 'text-black'
                  : 'text-gray-500'
                }
              `}
            >
              <span className="block text-lg font-extrabold leading-tight">{tab.labelZh}</span> 
              <span className="block text-xs font-bold tracking-widest opacity-60">{tab.labelEn}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0 w-44 justify-end">
          <div className="flex items-center gap-2.5 bg-white/60 border border-slate-200/70 rounded-xl px-3 py-2 shadow-sm">
            <CircleUser className="w-7 h-7 text-blue-400 flex-shrink-0" />
            <div className="text-right">
              <p className="text-slate-800 text-sm font-semibold leading-tight">{currentUser.name}</p>
              <p className="text-slate-400 text-[11px] leading-tight">{currentUser.employeeId} &nbsp;·&nbsp; {currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="登出"
            className="w-9 h-9 flex items-center justify-center rounded-xl
                       bg-white/60 border border-slate-200/70 shadow-sm
                       text-slate-400 hover:text-slate-600 hover:bg-white/80
                       transition-all duration-200 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

import { useState, useEffect } from 'react';
import { TabKey, User } from '../types';
import HeaderNav from './HeaderNav';
import MainContent from './MainContent';
import FooterBar from './FooterBar';
import bgImage from '../assets/chemo-background.jpg';


interface DashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
}

export default function DashboardLayout({ currentUser, onLogout }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('dispense');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleTimeString('zh-TW', { hour12: false }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col overflow-hidden relative"
      style={{ backgroundImage: `url(${bgImage})`, 
      backgroundSize: 'auto 100%', // 寬度自動，高度 100%
      backgroundRepeat: 'no-repeat', // 防止圖片重複
      backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />

      <div className="relative z-10 flex flex-col h-screen">
        <HeaderNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentUser={currentUser}
          onLogout={onLogout}
        />
        <MainContent activeTab={activeTab} />
        <FooterBar currentTime={currentTime} />
      </div>
    </div>
  );
}

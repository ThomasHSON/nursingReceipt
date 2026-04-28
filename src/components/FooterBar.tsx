interface FooterBarProps {
  currentTime: string;
}

export default function FooterBar({ currentTime }: FooterBarProps) {
  return (
    <footer className="w-full h-9 bg-white/55 backdrop-blur-xl border-t border-white/70 flex items-center px-6 gap-4 shadow-sm">
      <div className="flex-1 flex items-center gap-6">
        <span className="text-slate-400 text-xs tracking-wider">
          化療藥局資訊管理系統 &nbsp;·&nbsp; Chemotherapy Pharmacy Information System
        </span>
        <span className="text-slate-300 text-xs">v1.0.0</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-500 text-xs">系統正常</span>
        </div>
        <span className="text-slate-400 text-xs font-mono">{currentTime}</span>
      </div>
    </footer>
  );
}

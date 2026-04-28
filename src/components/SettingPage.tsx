import { Settings, Users, Bell, ShieldCheck, Printer } from 'lucide-react';

const SETTING_GROUPS = [
  { icon: Users, label: '人員管理', desc: '帳號新增、權限設定', color: 'text-blue-500', bg: 'bg-blue-50/60 border-blue-200/50' },
  { icon: Bell, label: '通知設定', desc: '警示閾值、通知對象', color: 'text-amber-500', bg: 'bg-amber-50/60 border-amber-200/50' },
  { icon: Printer, label: '列印設定', desc: '藥袋格式、印表機設定', color: 'text-cyan-500', bg: 'bg-cyan-50/60 border-cyan-200/50' },
  { icon: ShieldCheck, label: '安全設定', desc: '密碼原則、存取記錄', color: 'text-emerald-500', bg: 'bg-emerald-50/60 border-emerald-200/50' },
];

export default function SettingPage() {
  return (
    <div className="flex-1 flex flex-col p-6 gap-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-500/20 border border-slate-400/30 flex items-center justify-center">
          <Settings className="w-6 h-6 text-slate-500" />
        </div>
        <div>
          <h1 className="text-slate-800 text-xl font-bold">系統設定</h1>
          <p className="text-slate-500 text-sm tracking-wider">System Settings</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {SETTING_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.label}
              className={`glass-card p-7 flex items-start gap-5 border ${group.bg} opacity-70 cursor-not-allowed`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/60 border border-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Icon className={`w-6 h-6 ${group.color}`} />
              </div>
              <div>
                <h3 className="text-slate-800 font-semibold text-base">{group.label}</h3>
                <p className="text-slate-500 text-sm mt-0.5">{group.desc}</p>
                <p className="text-slate-400 text-xs mt-2">功能開發中</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-5">
        <p className="text-slate-400 text-sm text-center">
          系統設定頁面 &nbsp;·&nbsp; 功能開發中 &nbsp;·&nbsp; System Settings Module — Under Development
        </p>
      </div>
    </div>
  );
}

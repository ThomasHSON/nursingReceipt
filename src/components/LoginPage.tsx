import { useState } from 'react';
import { FlaskConical, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import bgImage from '../assets/chemo-background.jpg';


interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      onLoginSuccess(user);
    } else {
      setError('帳號或密碼錯誤，請重新輸入');
    }
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

      <header className="relative z-10 flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/70 border border-blue-200/60 flex items-center justify-center shadow-sm backdrop-blur-sm">
            <FlaskConical className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-blue-700/70 text-sm font-semibold tracking-widest uppercase">Chemo Pharm</span>
        </div>
        <div className="text-right">
          <p className="text-slate-700 font-semibold text-lg leading-tight">台灣醫療中心</p>
          <p className="text-slate-500 text-sm tracking-wider">Taiwan Medical Center</p>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-blue-200/40 p-10">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100/80 border border-blue-200/60 mb-5 shadow-sm">
                <FlaskConical className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-slate-800 text-2xl font-bold mb-1">化療藥局系統</h1>
              <p className="text-slate-500 text-sm tracking-wider">Chemotherapy Pharmacy System</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-slate-600 text-sm font-medium mb-2 ml-1">
                  帳號 Account
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="請輸入帳號"
                  className="w-full bg-white/60 backdrop-blur-sm border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 px-4 py-3 focus:outline-none focus:border-blue-400/70 focus:bg-white/80 transition-all duration-200 text-base"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-medium mb-2 ml-1">
                  密碼 Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="請輸入密碼"
                    className="w-full bg-white/60 backdrop-blur-sm border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 px-4 py-3 pr-12 focus:outline-none focus:border-blue-400/70 focus:bg-white/80 transition-all duration-200 text-base"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50/80 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-600 text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full py-4 mt-2 rounded-xl font-semibold text-base
                           bg-blue-500/80 hover:bg-blue-500/90
                           backdrop-blur-sm
                           border border-blue-400/50
                           text-white
                           shadow-[0_4px_20px_rgba(59,130,246,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]
                           hover:shadow-[0_6px_28px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]
                           active:scale-[0.98]
                           transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    驗證中...
                  </span>
                ) : (
                  '登入系統'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200/60 text-center">
              <p className="text-slate-400 text-xs">
                測試帳號：admin / 123456
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-5 text-center">
        <p className="text-slate-400/70 text-xs tracking-wider">
          化療藥局資訊管理系統 &nbsp;·&nbsp; Chemotherapy Pharmacy Information System &nbsp;·&nbsp; v1.0.0
        </p>
      </footer>
    </div>
  );
}

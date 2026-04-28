import { Package, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react';

export default function InventoryPage() {
  return (
    <div className="flex-1 flex flex-col p-6 gap-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
          <Package className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h1 className="text-slate-800 text-xl font-bold">庫存管理</h1>
          <p className="text-slate-500 text-sm tracking-wider">Inventory Management</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-5">
        <div className="grid grid-rows-2 gap-5">
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-orange-500" />
              <h3 className="text-slate-800 font-semibold">藥品庫存一覽</h3>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400 text-sm text-center">此區塊待開發</p>
            </div>
          </div>
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-slate-800 font-semibold">低庫存警示</h3>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400 text-sm text-center">此區塊待開發</p>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-5">
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              <h3 className="text-slate-800 font-semibold">藥品耗用記錄</h3>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400 text-sm text-center">此區塊待開發</p>
            </div>
          </div>
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <h3 className="text-slate-800 font-semibold">庫存統計圖表</h3>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-slate-400 text-sm text-center">此區塊待開發</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <p className="text-slate-400 text-sm text-center">
          庫存管理頁面 &nbsp;·&nbsp; 功能開發中 &nbsp;·&nbsp; Inventory Management Module — Under Development
        </p>
      </div>
    </div>
  );
}

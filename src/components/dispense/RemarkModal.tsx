import { useState } from 'react';
import { X, MessageSquare, Send, UserCheck, Stethoscope, ChevronDown } from 'lucide-react';
import { Regimen } from '../../types';

interface Remark {
  id: string;
  type: 'case_manager' | 'nurse';
  author: string;
  datetime: string;
  content: string;
}

const MOCK_REMARKS: Record<string, Remark[]> = {
  default: [
    {
      id: 'rm001',
      type: 'case_manager',
      author: '王個管師',
      datetime: '2026-04-15 10:22',
      content: '病人對上次化療有輕微噁心反應，已與醫師討論調整止吐前處置藥物，本次治療前請再次確認前處置是否完整給予。',
    },
    {
      id: 'rm002',
      type: 'case_manager',
      author: '王個管師',
      datetime: '2026-04-28 14:05',
      content: '病人家屬詢問副作用衛教，已安排下週一衛教課程。本次治療後若有口腔黏膜炎症狀，請提醒病人使用口腔護理包並回診追蹤。',
    },
    {
      id: 'rm003',
      type: 'nurse',
      author: '李護理師',
      datetime: '2026-04-15 09:15',
      content: '病人表示手臂有輕微刺痛感，評估注射部位無紅腫滲液，輸注速率調慢後症狀緩解。病人整體配合度良好。',
    },
    {
      id: 'rm004',
      type: 'nurse',
      author: '陳筱芳',
      datetime: '2026-04-28 11:40',
      content: 'Port-A 抽回血順暢，沖管無阻力。治療過程中血壓平穩，無不適主訴。輸注完畢後已確認管路移除，傷口處無滲血。',
    },
    {
      id: 'rm005',
      type: 'nurse',
      author: '林護理師',
      datetime: '2026-05-06 08:50',
      content: '病人今日到達時表示上週有輕微掉髮，心情較低落，已給予心理支持衛教，並建議至假髮諮詢資源。治療中生命徵象穩定。',
    },
  ],
};

interface RemarkModalProps {
  regimen: Regimen;
  onClose: () => void;
}

export default function RemarkModal({ regimen, onClose }: RemarkModalProps) {
  const [remarks, setRemarks] = useState<Remark[]>(
    MOCK_REMARKS[regimen.id] ?? MOCK_REMARKS.default
  );
  const [newNote, setNewNote] = useState('');
  const [caseOpen, setCaseOpen] = useState(true);
  const [nurseOpen, setNurseOpen] = useState(true);

  function handleSubmit() {
    const trimmed = newNote.trim();
    if (!trimmed) return;
    const entry: Remark = {
      id: `rm_new_${Date.now()}`,
      type: 'nurse',
      author: '陳筱芳',
      datetime: new Date().toLocaleString('zh-TW', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      }).replace(/\//g, '-').replace(',', ''),
      content: trimmed,
    };
    setRemarks(prev => [...prev, entry]);
    setNewNote('');
  }

  const caseRemarks = remarks.filter(r => r.type === 'case_manager');
  const nurseRemarks = remarks.filter(r => r.type === 'nurse');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[85vh]">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-sky-500" />
            <span className="text-slate-800 font-bold text-base">備註紀錄</span>
            <span className="text-slate-400 text-sm font-mono">{regimen.patientName} · {regimen.chartNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

          {/* case manager section */}
          <section>
            <button
              onClick={() => setCaseOpen(o => !o)}
              className="flex items-center gap-2 w-full text-left mb-0 group"
            >
              <UserCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-slate-700 font-semibold text-sm">個管師備註</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-100">{caseRemarks.length}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform duration-200 ${caseOpen ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${caseOpen ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
              {caseRemarks.length === 0 ? (
                <p className="text-slate-400 text-sm pl-1">尚無個管師備註</p>
              ) : (
                <div className="space-y-2.5">
                  {caseRemarks.map(r => (
                    <div key={r.id} className="bg-amber-50/60 border border-amber-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-amber-700 text-sm font-semibold">{r.author}</span>
                        <span className="text-slate-300 text-xs">·</span>
                        <span className="text-slate-400 text-xs font-mono">{r.datetime}</span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{r.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* nurse section */}
          <section>
            <button
              onClick={() => setNurseOpen(o => !o)}
              className="flex items-center gap-2 w-full text-left group"
            >
              <Stethoscope className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span className="text-slate-700 font-semibold text-sm">護理師備註</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 text-xs font-semibold border border-sky-100">{nurseRemarks.length}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform duration-200 ${nurseOpen ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${nurseOpen ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
              {nurseRemarks.length === 0 ? (
                <p className="text-slate-400 text-sm pl-1">尚無護理師備註</p>
              ) : (
                <div className="space-y-2.5">
                  {nurseRemarks.map(r => (
                    <div key={r.id} className="bg-sky-50/60 border border-sky-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sky-700 text-sm font-semibold">{r.author}</span>
                        <span className="text-slate-300 text-xs">·</span>
                        <span className="text-slate-400 text-xs font-mono">{r.datetime}</span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{r.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* new note input */}
        <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-slate-600 text-sm font-semibold">新增護理師備註</span>
          </div>
          <div className="flex gap-3">
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="輸入備註內容..."
              rows={3}
              className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300/50 focus:border-sky-300 transition-all"
            />
            <button
              onClick={handleSubmit}
              disabled={!newNote.trim()}
              className="flex-shrink-0 self-end flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 text-white shadow-[0_2px_12px_rgba(14,165,233,0.3)] hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition-all duration-200"
            >
              <Send className="w-4 h-4" />
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { X, Bot, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { Regimen } from '../../types';

// ── Per-regimen AI summaries ─────────────────────────────────────────────────

const AI_SUMMARIES: Record<string, string[]> = {
  R001: [
    '於2026年3月10日接受 Carboplatin（AUC 5）合併 Pemetrexed（500 mg/m²）化療，治療過程中生命徵象穩定，體溫維持於36.1至36.5℃，脈搏68至80次/分，呼吸16至18次/分，血壓112至128/68至80 mmHg。化療期間無注射部位紅腫、疼痛或外滲現象，病人無明顯不適主訴。',
    '針對肺腺癌第三期B之治療，本次為 Carboplatin＋Pemetrexed 方案（Q3W），給藥前已確認葉酸及維生素B12補充狀況符合規定。化療結束後以含Heparin之生理食鹽水沖洗留置針，提供返家衛教，提醒病人注意發燒（≥38℃）、嚴重喘促及骨髓抑制相關症狀。',
    '副作用評估：噁心感覺神經症狀評估G0，疲倦G1，食慾尚可。建議下次治療前追蹤腎功能（血清肌酸酐、GFR）以評估 Carboplatin 劑量調整必要性。整體治療耐受性良好，無中斷給藥情形。',
  ],
  R002: [
    '於2026年3月10日接受 Epirubicin（100 mg/m²）合併 Cyclophosphamide（600 mg/m²）化療，給藥前已完成制吐前處置（Granisetron）。治療過程中生命徵象平穩，體溫36.2至36.6℃，脈搏72至88次/分，呼吸18次/分，血壓108至124/64至78 mmHg。',
    '乳癌ER+/PR+第二期，本次 EC 方案給藥期間無心律異常記錄，周邊靜脈留置針注射部位通暢，無外滲警訊。化療結束後執行返家衛教，特別提醒 Epirubicin 累積心毒性風險，建議定期追蹤心臟功能。',
    '副作用評估：噁心G1，皮膚G0，黏膜炎G0，疲倦G1。化療後提供足量水化處置，注意 Cyclophosphamide 相關出血性膀胱炎風險，囑咐病人多飲水，尿液顏色異常時應立即返院。',
  ],
  R003: [
    '於2026年3月10日接受 R-CHOP 方案（Rituximab 375 mg/m²、Cyclophosphamide 750 mg/m²、Doxorubicin 50 mg/m²、Vincristine 1.4 mg/m²、Prednisolone 100 mg）化療。Rituximab 首次輸注採漸進式速率，密切監測輸注反應，全程無發燒、畏寒或過敏反應。',
    '瀰漫性大B細胞淋巴瘤第四期，治療過程中生命徵象穩定，體溫36.0至36.4℃，脈搏76至90次/分，呼吸18至20次/分，血壓116至130/72至82 mmHg。注射部位無紅腫熱痛，Vincristine 給藥嚴格確認非鞘內途徑。',
    '副作用評估：感覺神經症狀G1（手腳末梢輕微麻木），疲倦G2，噁心G1，皮膚G0。返家衛教重點：免疫抑制期間避免人群聚集，出現發燒（≥38℃）或口腔潰瘍加重立即就醫，按時服用 Prednisolone。',
  ],
  R004: [
    '於2026年3月10日接受 Paclitaxel（175 mg/m²）合併 Carboplatin（AUC 5）化療，給藥前已完成地塞米松、苯海拉明前處置，過敏反應預防完備。Paclitaxel 使用0.22μm過濾器輸注，時間達3小時，全程無過敏症狀。',
    '卵巢癌第三期C，治療過程中生命徵象穩定，體溫36.1至36.5℃，脈搏70至82次/分，呼吸17至18次/分，血壓110至122/66至76 mmHg。Carboplatin 於 Paclitaxel 結束後依序給予，輸注時間35分鐘。',
    '副作用評估：噁心G1，感覺神經症狀G1（手腳輕微刺麻），脫髮評估G2，疲倦G1。化療結束後以含Heparin之生理食鹽水沖洗Port-A管路，提供返家衛教，提醒病人若出現嚴重嘔吐、下肢水腫或呼吸困難應立即返院。',
  ],
  R005: [
    '於2026年3月10日接受 Docetaxel（75 mg/m²）化療，給藥前已使用地塞米松預處置，預防體液滯留及嚴重過敏反應。輸注時間1小時，全程無過敏反應或體液滯留異常。',
    '攝護腺癌（去勢抵抗性，骨轉移），治療過程中生命徵象穩定，體溫36.2至36.6℃，脈搏68至80次/分，呼吸16至18次/分，血壓118至130/70至80 mmHg。持續口服 Prednisolone 5 mg BID 以減少化療相關副作用。',
    '副作用評估：疲倦G1，感覺神經症狀G1，骨痛評估穩定無加重。返家衛教提醒：出現嚴重水腫（尤其下肢）、呼吸困難或發燒應立即就醫；Prednisolone 不得自行停藥，定期追蹤 PSA 及影像。',
  ],
  R006: [
    '於2026年3月10日接受 Hyper-CVAD 部分化療（Cyclophosphamide 300 mg/m² Q12H D1-3、Vincristine、Doxorubicin），急性淋巴性白血病Ph陽性，本次為住院治療。全程密切水化處置，Cyclophosphamide 相關膀胱毒性預防完備。',
    '治療過程中生命徵象穩定，體溫36.0至36.4℃，脈搏74至86次/分，呼吸18次/分，血壓104至118/62至74 mmHg。Vincristine 嚴格確認非鞘內途徑，Doxorubicin 避光保存並確認管路暢通後給藥。',
    '副作用評估：黏膜炎G1，疲倦G2，噁心G1。骨髓抑制風險高，已提醒病人發燒門檻降至37.5℃即通報護理站，注意口腔清潔及預防感染。住院期間持續監測血球計數變化。',
  ],
  R007: [
    '於2026年3月10日接受 SOX 方案（Oxaliplatin 130 mg/m² D1、S-1 40 mg BID D1-14）化療，胃腺癌第四期腹膜轉移。Oxaliplatin 以D5W稀釋（嚴禁NS），輸注時間3小時，化療期間病人無明顯過敏反應。',
    '治療過程中生命徵象穩定，體溫36.2至36.5℃，脈搏72至84次/分，呼吸17至18次/分，血壓112至126/68至78 mmHg。化療後無注射部位滲漏或異常，病人主訴末梢輕微冷感覺異常（Oxaliplatin 相關）。',
    '副作用評估：感覺神經症狀G1（冷觸覺異常）、疲倦G1、食慾不振G1。返家衛教重點：避免接觸冷物品（杯碗、冷空氣），S-1 需按時服藥14天後休息，出現嚴重腹瀉（≥4次/日）或口腔潰瘍加重立即返院。',
  ],
  R008: [
    '於2026年3月10日接受 AC 方案（Doxorubicin 60 mg/m²、Cyclophosphamide 600 mg/m²）化療，乳癌HER2陽性第三期。給藥前使用 Ondansetron 進行制吐前處置，Doxorubicin 靜脈推注3-5分鐘，全程注意避光及管路通暢。',
    '治療過程中生命徵象穩定，體溫36.1至36.5℃，脈搏70至84次/分，呼吸18次/分，血壓106至120/62至74 mmHg。Cyclophosphamide 輸注時間60分鐘，足量水化完成，無出血性膀胱炎相關症狀。',
    '副作用評估：噁心G1，脫髮G2，疲倦G1，黏膜炎G0。化療結束後由陳藥師確認審核，返家衛教重點：注意感染徵象（發燒、畏寒）、口腔護理及水分攝取，下次治療前將接受 Trastuzumab 加入方案之評估。',
  ],
  R009: [
    '於2026年3月10日接受 VRd 方案（Bortezomib 1.3 mg/m² SC、Lenalidomide 25 mg PO D1-21、Dexamethasone 20 mg）化療，多發性骨髓瘤IgG kappa型。Bortezomib 皮下注射，注射部位輪替，本次注射於右腹部，無局部反應。',
    '治療過程中生命徵象穩定，體溫36.2至36.6℃，脈搏66至80次/分，呼吸16至18次/分，血壓110至124/64至76 mmHg。病人主訴輕微手腳刺麻感（周邊神經病變持續追蹤），給藥後觀察無直立性低血壓。',
    '副作用評估：感覺神經症狀G1，疲倦G1，便秘G1。由林藥師確認審核，返家衛教：按時服用 Lenalidomide，避免懷孕（REMS計畫遵守），出現嚴重神經症狀（麻木加重、走路不穩）立即回診，定期追蹤血清蛋白電泳及免疫球蛋白。',
  ],
  R010: [
    '於2026年3月10日接受 TC 方案（Paclitaxel 175 mg/m²、Carboplatin AUC 5）化療，子宮頸癌第二期B。給藥前已使用地塞米松、苯海拉明及H2阻斷劑完成前處置，Paclitaxel 以0.22μm過濾器輸注，時間3小時，全程無過敏反應。',
    '治療過程中生命徵象穩定，體溫36.2至36.4℃，脈搏73至83次/分，呼吸18次/分，血壓107至122/59至76 mmHg。化療期間無注射部位紅腫、疼痛或外滲現象，病人無不適主訴。',
    '化療結束後，依醫囑使用含Heparin之生理食鹽水沖洗Port-A管路，並提供返家衛教，提醒病人注意發燒、嚴重嘔吐、注射部位異常及其他可能副作用。由陳藥師確認審核，副作用評估未見明確異常記錄，整體療程結束。',
  ],
  R011: [
    '於2026年3月10日接受 FOLFOX＋Bevacizumab 方案（Oxaliplatin 85 mg/m²、Leucovorin 400 mg/m²、5-FU 2400 mg/m² 持續輸注46小時、Bevacizumab 5 mg/kg）化療，大腸直腸癌第四期肝轉移。Bevacizumab 首次輸注時間90分鐘，全程密切監測輸注反應及血壓。',
    '治療過程中生命徵象穩定，體溫36.1至36.4℃，脈搏70至82次/分，呼吸17至18次/分，血壓118至134/70至82 mmHg（Bevacizumab 相關高血壓持續追蹤）。5-FU 以輸注泵持續給予，管路更換依規定執行。',
    '副作用評估：噁心G1，感覺神經症狀G1，疲倦G2，黏膜炎G1。由林藥師確認審核，返家衛教重點：出血風險（Bevacizumab 相關）、傷口癒合監測、血壓自我監測，出現嚴重腹痛、血便或傷口滲液立即返院。',
  ],
  R012: [
    '於2026年3月10日接受 GC 方案（Gemcitabine 1000 mg/m² D1,8、Carboplatin AUC 2 D1,8）化療，三陰性乳癌第三期。本次為第1天給藥，Gemcitabine 輸注時間30分鐘（嚴格不超過60分鐘），Carboplatin 於其後依序給予。',
    '治療過程中生命徵象穩定，體溫36.2至36.5℃，脈搏72至84次/分，呼吸18次/分，血壓110至124/64至76 mmHg。化療期間無過敏反應，注射部位通暢，病人主訴輕微噁心感。',
    '副作用評估：噁心G1，疲倦G1，皮膚G0，骨髓抑制風險評估中（第8天再次給藥前須確認血球計數）。由陳藥師確認審核，返家衛教提醒出現嚴重倦怠、發燒或皮膚潮紅應立即返院，下次回診日期確認。',
  ],
  R013: [
    '於2026年3月10日接受 IA 誘導化療（Idarubicin 12 mg/m² D1-3、Cytarabine 200 mg/m² CI D1-7），急性骨髓性白血病第四療程。Cytarabine 以持續輸注泵24小時給予，每日重新配製，確認無配伍禁忌。Idarubicin 靜脈緩慢推注5-10分鐘，避光保存。',
    '治療過程中生命徵象穩定，體溫36.0至36.4℃，脈搏74至88次/分，呼吸18次/分，血壓108至122/64至76 mmHg。住院密切觀察中，骨髓抑制深度監測每日血球計數，已備 G-CSF 支持治療。',
    '副作用評估：黏膜炎G2，疲倦G3，噁心G2，骨髓抑制預期為最低點。由林藥師確認審核，返家衛教（出院後）：發燒門檻降至37.5℃立即返院，嚴格口腔護理，避免生食，定期回院追蹤骨髓恢復情形。',
  ],
  R014: [
    '於2026年3月10日接受 TC 方案（Carboplatin AUC 5、Paclitaxel 175 mg/m²）化療，子宮內膜癌第三期。給藥前已完成地塞米松、苯海拉明前處置，Carboplatin 先行給藥後依序給予 Paclitaxel，全程無過敏反應。',
    '治療過程中生命徵象穩定，體溫36.1至36.5℃，脈搏68至82次/分，呼吸17至18次/分，血壓108至122/64至78 mmHg。化療期間注射部位通暢（均已勾選確認），病人耐受良好，無主訴不適。',
    '副作用評估：噁心G0，感覺神經症狀G1（手腳輕微麻木），疲倦G1，脫髮G2。由陳藥師確認審核，化療結束後以含Heparin之生理食鹽水沖洗管路，返家衛教提醒：嚴重神經症狀、骨盆腔異常出血或發燒（≥38℃）立即返院，按時回診接受後續影像追蹤。',
  ],
};

// ── Typing animation hook ────────────────────────────────────────────────────

function useTypingEffect(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

// ── Insight card ─────────────────────────────────────────────────────────────

function InsightCard({ index, text }: { index: number; text: string }) {
  const labels = ['治療過程摘要', '用藥重點說明', '副作用與衛教建議'];
  const colors = [
    'border-sky-200/70 bg-sky-50/60',
    'border-teal-200/70 bg-teal-50/60',
    'border-amber-200/70 bg-amber-50/60',
  ];
  const dotColors = ['bg-sky-400', 'bg-teal-400', 'bg-amber-400'];

  return (
    <div className={`rounded-xl border px-5 py-4 ${colors[index]}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <div className={`w-2 h-2 rounded-full ${dotColors[index]}`} />
        <span className="text-slate-600 text-sm font-semibold tracking-wide">{labels[index]}</span>
      </div>
      <p className="text-slate-700 text-base leading-[1.75]">{text}</p>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

interface ChemoAssistantModalProps {
  regimen: Regimen;
  onClose: () => void;
}

export default function ChemoAssistantModal({ regimen, onClose }: ChemoAssistantModalProps) {
  const summaries = AI_SUMMARIES[regimen.id] ?? [
    `${regimen.patientName} 之處方資料已載入，AI 摘要生成中，請稍候。`,
  ];

  const fullText = summaries.join('\n\n');
  const [key, setKey] = useState(0);
  const { displayed, done } = useTypingEffect(fullText, 10);

  const handleRegenerate = () => setKey(k => k + 1);

  useEffect(() => {
    setKey(k => k + 1);
  }, [regimen.id]);

  // Split displayed text back into paragraphs for styled rendering
  const paragraphs = displayed.split('\n\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-white/96 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 flex flex-col h-[90vh]">
        {/* header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-[0_2px_10px_rgba(14,165,233,0.35)]">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-800 text-lg font-bold">化療助手</span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-100 to-teal-100 text-sky-700 text-xs font-semibold border border-sky-200/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI 生成
              </span>
              <span className="text-slate-400 text-sm">—</span>
              <span className="text-slate-600 text-base font-semibold">{regimen.patientName}</span>
              <span className="text-slate-400 font-mono text-sm">{regimen.chartNumber}</span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">依據處方資料自動分析生成，僅供臨床參考</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* patient context strip */}
        <div className="flex items-center gap-4 px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 flex-shrink-0 flex-wrap">
          <span className="text-slate-500 text-sm">診斷</span>
          <span className="text-slate-700 text-sm font-semibold">{regimen.diagnosis}</span>
          <div className="w-px h-3.5 bg-slate-200" />
          <span className="text-slate-500 text-sm">科別</span>
          <span className="text-slate-700 text-sm font-semibold">{regimen.department}</span>
          <div className="w-px h-3.5 bg-slate-200" />
          <span className="text-slate-500 text-sm">藥品</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {regimen.drugs.map(d => (
              <span key={d.id} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium">
                {d.drugName}
              </span>
            ))}
          </div>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0 space-y-3" key={key}>
          {/* typing animation: render partial paragraphs */}
          {paragraphs.map((para, i) => {
            if (!para) return null;
            const isComplete = i < paragraphs.length - 1 || done;
            return (
              <InsightCard
                key={i}
                index={i}
                text={isComplete ? summaries[i] ?? para : para}
              />
            );
          })}

          {/* cursor */}
          {!done && (
            <span className="inline-block w-0.5 h-5 bg-sky-500 animate-pulse ml-0.5 align-middle" />
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 flex-shrink-0">
          <p className="text-slate-400 text-xs flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3" />
            本內容由 AI 根據處方資料自動生成，不代表最終臨床決策
          </p>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-all duration-150"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            重新生成
          </button>
        </div>
      </div>
    </div>
  );
}

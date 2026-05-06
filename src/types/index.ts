export type TabKey = 'dispense' | 'information';

export type DispenseStatus = 'completed' | 'delivering' | 'received' | 'finished' | 'discharging';
// completed=已完成, delivering=運送中, received=已簽收, finished=療程結束, discharging=待離院確認

export type PatientType = 'outpatient' | 'inpatient';

export interface User {
  id: string;
  username: string;
  password: string;
  employeeId: string;
  name: string;
  role: string;
}

export interface DispenseStatusStat {
  status: DispenseStatus;
  labelZh: string;
  labelEn: string;
  count: number;
}

export interface DrugItem {
  id: string;
  drugCode: string;
  drugName: string;
  drugNameZh: string;
  dose: string;
  route: string;
  frequency: string;
  qty: number;
  dispenseNote: string;
  dispenseQty: string;
  storageLocation: string;
  checked: boolean;
}

export interface LabItem {
  /** 檢驗項目代碼/名稱，e.g. "BUN" */
  name: string;
  /** 數值，字串形式保留原始精度 */
  value: string;
  /** 單位 */
  unit: string;
  /** 參考範圍下限 */
  refLow?: number;
  /** 參考範圍上限 */
  refHigh?: number;
  /** 標記：H=偏高, L=偏低, C=危急值 */
  flag?: 'H' | 'L' | 'C';
  /** 報告單號 */
  reportId?: string;
  /** 採檢日期 YYYY-MM-DD */
  collectedDate?: string;
}

export interface Regimen {
  id: string;
  /** 病歷號 */
  chartNumber: string;
  /** 病人姓名 */
  patientName: string;
  /** 病人身高 cm */
  height: number;
  /** 病人體重 kg */
  weight: number;
  /** 病人生日 YYYY-MM-DD */
  birthDate: string;
  /** 科別 */
  department: string;
  /** 住院編號，門診為空字串 */
  admissionNumber: string;
  /** 處方生效日期時間 YYYY-MM-DD HH:mm */
  effectiveDateTime: string;
  /** 處方審核日期時間 YYYY-MM-DD HH:mm */
  reviewedDateTime: string;
  /** 診斷訊息 */
  diagnosis: string;
  /** 開立醫師 */
  prescribingDoctor: string;
  /** 審核醫師 */
  reviewingDoctor: string;
  /** 審核藥師 */
  reviewingPharmacist: string;
  /** 藥品清單 */
  drugs: DrugItem[];
  /** 狀態 */
  status: DispenseStatus;
  /** 檢驗數值清單 */
  labData: LabItem[];
  /** Port-A / PICC 狀態 */
  portStatus?: string;
  /** Nadir WBC */
  nadirWBC?: string;
  /** 體表面積 BSA */
  bsa?: number;
  /** ECOG 體能狀態 */
  ecog?: string;
  /** 細胞型態 */
  cellType?: string;
  /** 化療週期 */
  cycle?: number;
  /** 秤重前體重 kg */
  weightBefore?: number;
  /** 秤重後體重 kg */
  weightAfter?: number;
}

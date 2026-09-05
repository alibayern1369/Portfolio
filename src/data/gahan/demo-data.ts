export type DemoRole = "employee" | "admin";

export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "checked_out"
  | "working";

export interface DemoEmployee {
  id: string;
  name: string;
  code: string;
  role: "employee" | "admin";
  workplace: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workedMinutes: number;
  lateMinutes: number;
  phone: string;
}

export interface DemoSession {
  id: string;
  employeeId: string;
  employeeName: string;
  dateLabel: string;
  checkIn: string;
  checkOut?: string;
  workplace: string;
  workedMinutes: number;
  lateMinutes: number;
  status: AttendanceStatus;
  distanceM: number;
}

export const DEMO_WORKPLACE = {
  name: "دفتر مرکزی نمونه",
  address: "تهران، خیابان نمونه، پلاک ۱۲",
  radiusM: 120,
} as const;

export const DEMO_EMPLOYEES: DemoEmployee[] = [
  {
    id: "e1",
    name: "سارا محمدی",
    code: "1001",
    role: "employee",
    workplace: DEMO_WORKPLACE.name,
    status: "working",
    checkIn: "۰۸:۱۲",
    workedMinutes: 278,
    lateMinutes: 0,
    phone: "0912······۱",
  },
  {
    id: "e2",
    name: "رضا کریمی",
    code: "1002",
    role: "employee",
    workplace: DEMO_WORKPLACE.name,
    status: "late",
    checkIn: "۰۹:۰۵",
    workedMinutes: 225,
    lateMinutes: 35,
    phone: "0913······۲",
  },
  {
    id: "e3",
    name: "مینا احمدی",
    code: "1003",
    role: "employee",
    workplace: DEMO_WORKPLACE.name,
    status: "checked_out",
    checkIn: "۰۸:۰۱",
    checkOut: "۱۶:۵۵",
    workedMinutes: 534,
    lateMinutes: 0,
    phone: "0910······۳",
  },
  {
    id: "e4",
    name: "حسین نوری",
    code: "1004",
    role: "employee",
    workplace: DEMO_WORKPLACE.name,
    status: "absent",
    workedMinutes: 0,
    lateMinutes: 0,
    phone: "0915······۴",
  },
  {
    id: "e5",
    name: "الهام صادقی",
    code: "1005",
    role: "employee",
    workplace: DEMO_WORKPLACE.name,
    status: "present",
    checkIn: "۰۷:۵۸",
    workedMinutes: 292,
    lateMinutes: 0,
    phone: "0935······۵",
  },
  {
    id: "a1",
    name: "علی مدیریت",
    code: "9001",
    role: "admin",
    workplace: DEMO_WORKPLACE.name,
    status: "present",
    checkIn: "۰۸:۳۰",
    workedMinutes: 260,
    lateMinutes: 0,
    phone: "0911······۰",
  },
];

export const DEMO_SESSIONS: DemoSession[] = [
  {
    id: "s1",
    employeeId: "e1",
    employeeName: "سارا محمدی",
    dateLabel: "امروز",
    checkIn: "۰۸:۱۲",
    workplace: DEMO_WORKPLACE.name,
    workedMinutes: 278,
    lateMinutes: 0,
    status: "working",
    distanceM: 18,
  },
  {
    id: "s2",
    employeeId: "e2",
    employeeName: "رضا کریمی",
    dateLabel: "امروز",
    checkIn: "۰۹:۰۵",
    workplace: DEMO_WORKPLACE.name,
    workedMinutes: 225,
    lateMinutes: 35,
    status: "late",
    distanceM: 42,
  },
  {
    id: "s3",
    employeeId: "e3",
    employeeName: "مینا احمدی",
    dateLabel: "امروز",
    checkIn: "۰۸:۰۱",
    checkOut: "۱۶:۵۵",
    workplace: DEMO_WORKPLACE.name,
    workedMinutes: 534,
    lateMinutes: 0,
    status: "checked_out",
    distanceM: 12,
  },
  {
    id: "s4",
    employeeId: "e5",
    employeeName: "الهام صادقی",
    dateLabel: "دیروز",
    checkIn: "۰۸:۰۴",
    checkOut: "۱۷:۰۲",
    workplace: DEMO_WORKPLACE.name,
    workedMinutes: 538,
    lateMinutes: 0,
    status: "checked_out",
    distanceM: 25,
  },
  {
    id: "s5",
    employeeId: "e1",
    employeeName: "سارا محمدی",
    dateLabel: "دیروز",
    checkIn: "۰۸:۱۰",
    checkOut: "۱۶:۴۸",
    workplace: DEMO_WORKPLACE.name,
    workedMinutes: 518,
    lateMinutes: 0,
    status: "checked_out",
    distanceM: 15,
  },
  {
    id: "s6",
    employeeId: "e2",
    employeeName: "رضا کریمی",
    dateLabel: "۲ روز پیش",
    checkIn: "۰۸:۴۰",
    checkOut: "۱۷:۱۰",
    workplace: DEMO_WORKPLACE.name,
    workedMinutes: 510,
    lateMinutes: 10,
    status: "checked_out",
    distanceM: 30,
  },
];

export const DEMO_WEEK_BARS = [
  { label: "ش", value: 86 },
  { label: "ی", value: 92 },
  { label: "د", value: 78 },
  { label: "س", value: 95 },
  { label: "چ", value: 88 },
  { label: "پ", value: 70 },
  { label: "ج", value: 40 },
];

export const DEMO_EMPLOYEE_USER = DEMO_EMPLOYEES[0];

export const STATUS_LABEL: Record<AttendanceStatus, string> = {
  present: "حاضر",
  absent: "غایب",
  late: "تأخیر",
  checked_out: "خروج‌کرده",
  working: "در محل کار",
};

export function faDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]!);
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h <= 0) return faDigits(`${m}د`);
  if (m <= 0) return faDigits(`${h}س`);
  return faDigits(`${h}س ${m}د`);
}

export function nowFaTime(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return faDigits(`${hh}:${mm}`);
}

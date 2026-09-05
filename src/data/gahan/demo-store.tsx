"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_EMPLOYEE_USER,
  DEMO_SESSIONS,
  type DemoSession,
  nowFaTime,
} from "@/data/gahan/demo-data";

export type CheckPhase =
  | "idle"
  | "locating"
  | "located"
  | "camera"
  | "preview"
  | "submitting"
  | "success"
  | "error";

interface DemoState {
  checkedIn: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  workedBonusMinutes: number;
  sessions: DemoSession[];
  phase: CheckPhase;
  selfieDataUrl?: string;
  lastMessage?: string;
  setPhase: (phase: CheckPhase) => void;
  setSelfie: (dataUrl?: string) => void;
  simulateLocate: () => void;
  completeCheckIn: () => void;
  completeCheckOut: () => void;
  resetFlow: () => void;
}

const DemoContext = createContext<DemoState | null>(null);

export function GahanDemoProvider({ children }: { children: ReactNode }) {
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | undefined>("۰۸:۱۲");
  const [checkOutTime, setCheckOutTime] = useState<string | undefined>();
  const [workedBonusMinutes, setWorkedBonusMinutes] = useState(0);
  const [sessions, setSessions] = useState<DemoSession[]>(DEMO_SESSIONS);
  const [phase, setPhase] = useState<CheckPhase>("idle");
  const [selfieDataUrl, setSelfie] = useState<string | undefined>();
  const [lastMessage, setLastMessage] = useState<string | undefined>();

  const simulateLocate = useCallback(() => {
    setPhase("locating");
    window.setTimeout(() => setPhase("located"), 900);
  }, []);

  const completeCheckIn = useCallback(() => {
    setPhase("submitting");
    window.setTimeout(() => {
      const time = nowFaTime();
      setCheckedIn(true);
      setCheckInTime(time);
      setCheckOutTime(undefined);
      setSessions((prev) => [
        {
          id: `demo-${Date.now()}`,
          employeeId: DEMO_EMPLOYEE_USER.id,
          employeeName: DEMO_EMPLOYEE_USER.name,
          dateLabel: "امروز",
          checkIn: time,
          workplace: DEMO_EMPLOYEE_USER.workplace,
          workedMinutes: 0,
          lateMinutes: 0,
          status: "working",
          distanceM: 18,
        },
        ...prev,
      ]);
      setLastMessage("ورود با موفقیت در حالت دمو ثبت شد.");
      setPhase("success");
    }, 700);
  }, []);

  const completeCheckOut = useCallback(() => {
    setPhase("submitting");
    window.setTimeout(() => {
      const time = nowFaTime();
      setCheckedIn(false);
      setCheckOutTime(time);
      setWorkedBonusMinutes((m) => m + 15);
      setSessions((prev) => {
        const [first, ...rest] = prev;
        if (!first || first.employeeId !== DEMO_EMPLOYEE_USER.id) {
          return prev;
        }
        return [
          {
            ...first,
            checkOut: time,
            status: "checked_out",
            workedMinutes: first.workedMinutes + 15,
          },
          ...rest,
        ];
      });
      setLastMessage("خروج با موفقیت در حالت دمو ثبت شد.");
      setPhase("success");
    }, 700);
  }, []);

  const resetFlow = useCallback(() => {
    setPhase("idle");
    setSelfie(undefined);
  }, []);

  const value = useMemo(
    () => ({
      checkedIn,
      checkInTime,
      checkOutTime,
      workedBonusMinutes,
      sessions,
      phase,
      selfieDataUrl,
      lastMessage,
      setPhase,
      setSelfie,
      simulateLocate,
      completeCheckIn,
      completeCheckOut,
      resetFlow,
    }),
    [
      checkedIn,
      checkInTime,
      checkOutTime,
      workedBonusMinutes,
      sessions,
      phase,
      selfieDataUrl,
      lastMessage,
      simulateLocate,
      completeCheckIn,
      completeCheckOut,
      resetFlow,
    ]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useGahanDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useGahanDemo must be used within GahanDemoProvider");
  return ctx;
}

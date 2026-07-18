import React, { useState, useMemo } from "react";
import {
  Smartphone,
  CheckCircle2,
  Bell,
  Sparkles,
  QrCode,
  Gift,
  User,
  LogOut,
  ChevronDown,
  ScanLine,
  Mail,
  Phone,
  X,
  Sun,
  Moon,
  Droplet,
} from "lucide-react";
import {
  Logomark,
  Button,
  TierBadge,
  PoweredByPerch,
  VerifyCode,
  rewardsCatalog,
  activitySeed,
} from "./shared";

/* ========================================================================== */
/* CUSTOMER LOYALTY APP (BLUEDOX THEME MATCHED)                               */
/* ========================================================================== */

const NAVY = "#1B2A4A";
const NAVY_SOFT = "#263A63";
const TEAL = "#1CC7B0";
const TEAL_SOFT = "#17A896";
const BLUE = "#3E6BE0";

const THEME = {
  light: {
    sidebar: NAVY,
    sidebarSoft: NAVY_SOFT,
    sidebarText: "#A9B4CC",
    sidebarBorder: "#26365A",
    canvas: "#F4F6FB",
    header: "#FFFFFF",
    headerBorder: "#E7EAF3",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(27,42,74,0.08)",
    textPrimary: "#000000",
    textSecondary: "#10131A",
    textMuted: "#2E3448",
    gridLine: "#EEF1F8",
    chip: "#EEF1F8",
    accent: TEAL,
    accentSoft: TEAL_SOFT,
    blue: BLUE,
    slate: "#8C9BA5",
    gold: "#F8F9FA",
    moss: "#1CC7B0",
    rust: "#F8F9FA",
  },
  dark: {
    sidebar: "#0F1830",
    sidebarSoft: "#16223F",
    sidebarText: "#8792AD",
    sidebarBorder: "#1C2846",
    canvas: "#111A30",
    header: "#16213C",
    headerBorder: "#232F4E",
    cardBg: "#182644",
    cardBorder: "rgba(255,255,255,0.06)",
    textPrimary: "#F8FAFC",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",
    gridLine: "#22304F",
    chip: "#1F2C4C",
    accent: "#25E0C6",
    accentSoft: "#1CC7B0",
    blue: "#5C82EE",
    slate: "#8C9BA5",
    gold: "#E8EAED",
    moss: "#25E0C6",
    rust: "#E8EAED",
  },
  glass: {
    sidebar: "#0F1830",
    sidebarSoft: "#16223F",
    sidebarText: "rgba(255,255,255,0.7)",
    sidebarBorder: "rgba(255,255,255,0.1)",
    canvas: "linear-gradient(135deg, #2A1B4A 0%, #3E6BE0 50%, #1CC7B0 100%)",
    header: "rgba(255, 255, 255, 0.1)",
    headerBorder: "rgba(255, 255, 255, 0.15)",
    cardBg: "rgba(255, 255, 255, 0.12)",
    cardBorder: "rgba(255, 255, 255, 0.25)",
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255, 255, 255, 0.8)",
    textMuted: "rgba(255, 255, 255, 0.5)",
    gridLine: "rgba(255, 255, 255, 0.15)",
    chip: "rgba(255, 255, 255, 0.15)",
    accent: "#25E0C6",
    accentSoft: "#1CC7B0",
    blue: "#5C82EE",
    slate: "#8C9BA5",
    gold: "#E8EAED",
    moss: "#25E0C6",
    rust: "#E8EAED",
  },
};

function useTheme() {
  const [mode, setMode] = useState("light");
  const t = THEME[mode];
  return { mode, setMode, t };
}

/* ========================================================================== */
/* EDIT HERE: DEMO CUSTOMER DATA                                              */
/* ========================================================================== */
const DEMO_CUSTOMER = {
  name: "Sachet Poudel",
  email: "sachetpoudel@yahoo.com",
  phone: "+977-9818762182",
  memberId: "10248",
  joined: "12 Mar 2026",
};

function CustomerApp({ brand }) {
  const { mode: themeMode, setMode: setThemeMode, t } = useTheme();

  const [step, setStep] = useState("auth");
  const [authLoading, setAuthLoading] = useState(false);
  const [points, setPoints] = useState(245);
  const [mode, setModeState] = useState("earn");
  const [reward, setReward] = useState(null);
  const [lastGain, setLastGain] = useState(0);

  // Menu States
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [qrMode, setQrMode] = useState("show");

  const activeBrand = useMemo(
    () => ({
      ...brand,
      primary: brand?.primary || t.accent,
      secondary: brand?.secondary || t.blue,
      name: brand?.name || "Loyalty Rewards",
    }),
    [brand, t]
  );

  const tierInfo =
    points >= 400
      ? { name: "Gold", next: null, floor: 400, ceil: null }
      : points >= 150
      ? { name: "Silver", next: "Gold", floor: 150, ceil: 400 }
      : { name: "Bronze", next: "Silver", floor: 0, ceil: 150 };

  const progressPct = tierInfo.ceil
    ? Math.min(
        100,
        Math.round(((points - tierInfo.floor) / (tierInfo.ceil - tierInfo.floor)) * 100)
      )
    : 100;

  function login() {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setStep("home");
    }, 650);
  }

  function startEarn() {
    setModeState("earn");
    setReward(null);
    setStep("verify");
  }

  function startRedeem(selectedReward) {
    setModeState("redeem");
    setReward(selectedReward);
    setStep("verify");
  }

  function approve() {
    if (mode === "earn") {
      setLastGain(18);
      setPoints((current) => current + 18);
    } else if (mode === "redeem" && reward) {
      setLastGain(-reward.cost);
      setPoints((current) => current - reward.cost);
    }
    setStep("approved");
  }

  function toggleQrMenu() {
    setAccountOpen(false);
    setNotifOpen(false);
    setScannerOpen((prev) => !prev);
  }

  function handleLogout() {
    setAccountOpen(false);
    setNotifOpen(false);
    setScannerOpen(false);
    setReward(null);
    setModeState("earn");
    setLastGain(0);
    setStep("auth");
  }

  return (
    <div
      className="flex flex-col w-full h-[100dvh] overflow-hidden transition-all duration-700 ease-in-out relative"
      style={{ background: t.canvas }}
    >
      {/* NEW CSS FIX:
        Using pure CSS classes for the glass effect guarantees that Webkit filters apply properly 
        and prevents React inline-styles from overriding the transparent backgrounds.
      */}
      <style>{`
        @keyframes iosPop {
          0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ios-dropdown {
          animation: iosPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top right;
        }
.glass-active {
  background-color: rgba(255, 255, 255, 0.14) !important;
  backdrop-filter: blur(16px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(160%) !important;
  border: 1px solid rgba(255, 255, 255, 0.28) !important;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.18) !important;
}
      `}</style>

      {step === "auth" && (
        <div className="flex-1 flex flex-col px-6 py-8 animate-fade-in-up justify-center">
          <div className="flex flex-col items-center mb-9">
            <h1 className="font-display text-3xl font-extrabold mt-3 tracking-tight" style={{ color: t.textPrimary }}>
              {activeBrand.name}
            </h1>
            <p className="text-sm mt-1" style={{ color: t.textSecondary }}>
              Sign in to see your rewards
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={login}
              disabled={authLoading}
              className={`flex items-center gap-3 rounded-full px-4 py-3.5 text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 ${themeMode === "glass" ? "glass-active" : ""}`}
              style={themeMode === "glass" ? { color: t.textPrimary } : { border: `1px solid ${t.cardBorder}`, color: t.textPrimary, background: t.cardBg }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: t.chip }}>
                <Mail size={11} style={{ color: t.textSecondary }} />
              </span>
              Continue with email
            </button>

            <button
              onClick={login}
              disabled={authLoading}
              className={`flex items-center gap-3 rounded-full px-4 py-3.5 text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 ${themeMode === "glass" ? "glass-active" : ""}`}
              style={themeMode === "glass" ? { color: t.textPrimary } : { border: `1px solid ${t.cardBorder}`, color: t.textPrimary, background: t.cardBg }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center relative shrink-0" style={{ background: t.chip }}>
                <Phone size={11} style={{ color: t.textSecondary }} />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: t.accent }}>#</span>
              </span>
              Continue with phone number
            </button>
          </div>

          {authLoading && (
            <p className="text-center text-xs mt-6 animate-pulse" style={{ color: t.textSecondary }}>
              Signing in…
            </p>
          )}
          <div className="mt-auto">
            <PoweredByPerch visible={activeBrand.poweredBy} />
          </div>
        </div>
      )}

      {step === "home" && (
        <div className="flex-1 flex flex-col overflow-y-auto scroll-thin animate-fade-in-up relative">
          <div
            className={`px-5 py-4 flex items-center justify-between sticky top-0 z-10 ${themeMode === "glass" ? "glass-active" : ""}`}
            style={themeMode === "glass" ? {} : { backgroundColor: t.header, borderBottom: `1px solid ${t.headerBorder}` }}
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-extrabold tracking-tight truncate max-w-[160px]" style={{ color: t.textPrimary }}>
                {activeBrand.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* NOTIFICATION BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setAccountOpen(false);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:opacity-80"
                style={{ background: t.chip }}
                aria-label="Notifications"
              >
                <Bell size={14} style={{ color: t.textSecondary }} />
              </button>

              {/* PROFILE BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setAccountOpen(!accountOpen);
                  setNotifOpen(false);
                }}
                className="min-w-[44px] h-9 px-3 rounded-full flex items-center gap-2 transition-all duration-200 hover:opacity-80"
                style={{ background: t.chip, color: t.textPrimary }}
                aria-label="Open account menu"
              >
                <User size={14} />
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div className="px-5 pt-5 pb-8">
            <div
              className="rounded-3xl p-6 text-white mb-5 relative overflow-hidden shadow-soft-lg"
              style={{
                background: `linear-gradient(135deg, ${t.blue}, ${t.accent})`,
                border: themeMode === "glass" ? "1px solid rgba(255,255,255,0.3)" : "none",
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-14 -left-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider opacity-80">Your balance</span>
                  <TierBadge tier={tierInfo.name} />
                </div>
                <div className="font-mono-data text-4xl mb-4 tracking-tight">
                  {points} <span className="font-body text-base opacity-75">pts</span>
                </div>
                {tierInfo.next ? (
                  <>
                    <div className="h-1.5 rounded-full bg-white/25 overflow-hidden mb-1.5">
                      <div className="h-full rounded-full bg-white transition-all duration-700 ease-out" style={{ width: `${progressPct}%` }} />
                    </div>
                    <div className="text-xs opacity-80">
                      {tierInfo.ceil - points} pts to {tierInfo.next}
                    </div>
                  </>
                ) : (
                  <div className="text-xs opacity-80 flex items-center gap-1.5">
                    <Sparkles size={12} /> You&apos;ve reached the top tier
                  </div>
                )}
              </div>
            </div>

            <div className="mb-7">
              <Button variant="primary" accent={t.accent} size="lg" className="w-full shadow-soft-lg" onClick={toggleQrMenu}>
                <QrCode size={16} /> QR Code
              </Button>
            </div>

            {scannerOpen && (
              <div
                className={`rounded-3xl p-4 mb-6 transition-all duration-300 ios-dropdown shadow-soft-lg ${themeMode === "glass" ? "glass-active" : ""}`}
                style={themeMode === "glass" ? {} : { background: t.cardBg, border: `1px solid ${t.cardBorder}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base tracking-tight" style={{ color: t.textPrimary }}>
                    QR Actions
                  </h3>
                  <button
                    type="button"
                    onClick={() => setScannerOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
                    style={{ background: t.chip }}
                    aria-label="Close QR section"
                  >
                    <X size={14} style={{ color: t.textPrimary }} />
                  </button>
                </div>

                <div className="flex p-1 rounded-xl mb-4" style={{ background: t.chip, border: themeMode === "glass" ? "1px solid rgba(255,255,255,0.1)" : `1px solid ${t.gridLine}` }}>
                  <button
                    onClick={() => setQrMode("show")}
                    className="flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex justify-center items-center gap-1.5"
                    style={qrMode === "show" ? { background: t.cardBg, color: t.textPrimary, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" } : { color: t.textSecondary }}
                  >
                    <QrCode size={14} /> Share
                  </button>
                  <button
                    onClick={() => setQrMode("scan")}
                    className="flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex justify-center items-center gap-1.5"
                    style={qrMode === "scan" ? { background: t.cardBg, color: t.textPrimary, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" } : { color: t.textSecondary }}
                  >
                    <ScanLine size={14} /> Scan
                  </button>
                </div>

                {qrMode === "scan" ? (
                  <div
                    className="rounded-2xl h-44 flex flex-col items-center justify-center text-center px-4 transition-colors animate-fade-in-up"
                    style={{ background: themeMode === "glass" ? "rgba(0,0,0,0.15)" : t.canvas, border: `1px dashed ${t.gridLine}` }}
                  >
                    <ScanLine size={28} style={{ color: activeBrand.primary }} />
                    <p className="text-sm mt-3" style={{ color: t.textPrimary }}>
                      Camera Preview
                    </p>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl flex flex-col items-center justify-center text-center px-4 py-6 transition-colors animate-fade-in-up"
                    style={{ background: themeMode === "glass" ? "rgba(0,0,0,0.15)" : t.canvas, border: `1px solid ${t.gridLine}` }}
                  >
                    <div className="bg-white p-4 rounded-2xl mb-4 shadow-sm inline-block">
                      <QrCode size={80} style={{ color: "#111827" }} />
                    </div>
                    <p className="text-sm mb-4 max-w-[220px]" style={{ color: t.textPrimary }}>
                      Present this code at the counter to earn points.
                    </p>
                    <Button variant="primary" accent={t.accent} size="sm" onClick={startEarn}>
                      Share QR
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base tracking-tight" style={{ color: t.textPrimary }}>
                Rewards
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2.5 mb-7">
              {rewardsCatalog.map((item) => {
                const canRedeem = points >= item.cost;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors duration-200 shadow-sm hover:shadow-md ${themeMode === "glass" ? "glass-active" : ""}`}
                    style={themeMode === "glass" ? {} : { background: t.cardBg, border: `1px solid ${t.cardBorder}` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${activeBrand.primary}18` }}>
                        <Gift size={15} style={{ color: activeBrand.primary }} />
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: t.textPrimary }}>
                          {item.name}
                        </div>
                        <div className="text-xs font-mono-data" style={{ color: t.textSecondary }}>
                          {item.cost} pts
                        </div>
                      </div>
                    </div>

                    {canRedeem ? (
                      <Button variant="primary" accent={t.accent} size="sm" onClick={() => startRedeem(item)}>
                        Redeem
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled>
                        Redeem
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
          <div className="mt-auto pb-4">
            <PoweredByPerch visible={activeBrand.poweredBy} />
          </div>
        </div>
      )}

      {/* NEW MENU PLACEMENT:
        Moving the menus OUT of the sticky header and putting them at the root level fixes the nested backdrop-filter bug. 
      */}
      {step === "home" && notifOpen && (
        <div
          className={`absolute right-5 top-16 w-64 rounded-3xl p-4 z-50 ios-dropdown ${themeMode === "glass" ? "glass-active" : ""}`}
          style={themeMode === "glass" ? {} : { background: t.cardBg, border: `1px solid ${t.cardBorder}` }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>
              Notifications
            </p>
            <button onClick={() => setNotifOpen(false)}>
              <X size={14} style={{ color: t.textSecondary }} />
            </button>
          </div>
          <div className="text-xs py-3 text-center rounded-2xl mb-4" style={{ color: t.textSecondary, background: themeMode === "glass" ? "rgba(255,255,255,0.08)" : t.chip }}>
            No new notifications
          </div>

          <div className="pt-1 border-t" style={{ borderColor: themeMode === "glass" ? "rgba(255,255,255,0.15)" : t.gridLine }}>
            <p className="text-xs font-semibold uppercase tracking-wide mt-3 mb-3" style={{ color: t.textSecondary }}>
              Recent activity
            </p>
            <div className="relative flex flex-col gap-4 max-h-56 overflow-y-auto scroll-thin pr-1">
              <div className="absolute w-px" style={{ left: 7, top: 8, bottom: 8, background: t.gridLine }} />
              {activitySeed.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 relative">
                  <div
                    className="w-3.5 h-3.5 rounded-full z-10 shrink-0"
                    style={{
                      backgroundColor: activity.type === "earn" ? t.moss : t.slate,
                      boxShadow: themeMode === "glass" ? `0 0 0 4px rgba(255,255,255,0.15)` : `0 0 0 4px ${t.cardBg}`,
                    }}
                  />
                  <div>
                    <div className="text-sm" style={{ color: t.textPrimary }}>
                      {activity.label}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: t.textSecondary }}>
                      {activity.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "home" && accountOpen && (
        <div
          className={`absolute right-5 top-16 w-72 rounded-3xl p-4 z-50 ios-dropdown ${themeMode === "glass" ? "glass-active" : ""}`}
          style={themeMode === "glass" ? {} : { background: t.cardBg, border: `1px solid ${t.cardBorder}` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                {DEMO_CUSTOMER.name}
              </p>
              <p className="text-xs" style={{ color: t.textSecondary }}>
                Loyalty membership
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAccountOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: t.chip }}
              aria-label="Close account menu"
            >
              <X size={14} style={{ color: t.textPrimary }} />
            </button>
          </div>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center gap-2" style={{ color: t.textSecondary }}>
              <Mail size={14} />
              <span>{DEMO_CUSTOMER.email}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: t.textSecondary }}>
              <Phone size={14} />
              <span>{DEMO_CUSTOMER.phone}</span>
            </div>
            <div className="rounded-2xl px-3 py-2" style={{ background: t.chip }}>
              <p className="text-xs" style={{ color: t.textSecondary }}>
                Loyalty ID:
              </p>
              <p className="text-sm font-medium" style={{ color: t.textPrimary }}>
                {DEMO_CUSTOMER.memberId}
              </p>
            </div>
            <div className="rounded-2xl px-3 py-2" style={{ background: t.chip }}>
              <p className="text-xs" style={{ color: t.textSecondary }}>
                Loyalty since:
              </p>
              <p className="text-sm font-medium" style={{ color: t.textPrimary }}>
                {DEMO_CUSTOMER.joined}
              </p>
            </div>

            {/* 3-Way iOS Style Segmented Theme Control */}
            <div className="pt-2">
              <p className="text-xs mb-2 ml-1" style={{ color: t.textSecondary }}>
                Mode
              </p>
              <div className="p-1 rounded-2xl flex gap-1 mb-2" style={{ background: t.chip }}>
                <button
                  onClick={() => setThemeMode("light")}
                  className={`flex-1 py-1.5 flex justify-center items-center rounded-xl transition-all ${themeMode === "light" ? "glass-active" : ""}`}
                  style={themeMode === "light" ? { color: t.textPrimary } : { color: t.textSecondary }}
                  aria-label="Light Mode"
                >
                  <Sun size={14} />
                </button>
                <button
                  onClick={() => setThemeMode("dark")}
                  className={`flex-1 py-1.5 flex justify-center items-center rounded-xl transition-all ${themeMode === "dark" ? "glass-active" : ""}`}
                  style={themeMode === "dark" ? { color: t.textPrimary } : { color: t.textSecondary }}
                  aria-label="Dark Mode"
                >
                  <Moon size={14} />
                </button>
                <button
                  onClick={() => setThemeMode("glass")}
                  className={`flex-1 py-1.5 flex justify-center items-center rounded-xl transition-all ${themeMode === "glass" ? "glass-active" : ""}`}
                  style={themeMode === "glass" ? { color: t.textPrimary } : { color: t.textSecondary }}
                  aria-label="Liquid Glass"
                >
                  <Droplet size={14} />
                </button>
              </div>
            </div>
          </div>

          <Button variant="primary" accent={t.accent} size="sm" className="w-full mt-2" onClick={handleLogout}>
            <LogOut size={14} /> Sign out
          </Button>
        </div>
      )}

      {step === "verify" && (
        <VerifyCode brand={activeBrand} mode={mode} reward={reward} onApprove={approve} onBack={() => setStep("home")} />
      )}

      {step === "approved" && (
        <div className="flex-1 flex flex-col items-center justify-center px-7 text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-scale-in" style={{ backgroundColor: `${t.moss}18` }}>
            <CheckCircle2 size={38} style={{ color: t.moss }} />
          </div>
          <h1 className="font-display text-2xl mb-1.5 tracking-tight" style={{ color: t.textPrimary }}>
            {mode === "redeem" ? "Reward redeemed" : "Points earned"}
          </h1>
          <p className="font-mono-data text-lg mb-1.5" style={{ color: lastGain >= 0 ? t.moss : t.textPrimary }}>
            {lastGain >= 0 ? "+" : ""}
            {lastGain} pts
          </p>
          <p className="text-sm mb-9" style={{ color: t.textSecondary }}>
            New balance: {points} pts
          </p>
          <Button variant="primary" accent={t.accent} size="lg" className="w-full" onClick={() => setStep("home")}>
            Back to home
          </Button>
        </div>
      )}
    </div>
  );
}

export default CustomerApp;
export { CustomerApp };
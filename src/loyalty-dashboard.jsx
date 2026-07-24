import { supabase } from "./supabase";
import React, { useState, useMemo, useEffect } from "react";
import {
  Smartphone,
  CheckCircle2,
  Bell,
  Sparkles,
  QrCode,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  ScanLine,
  Mail,
  Phone,
  X,
  Sun,
  Moon,
  Droplet,
  ArrowLeft,
  KeyRound,
  Trophy,
  Crown,
  Medal,
  Coffee,
  Percent,
  Cookie,
  UtensilsCrossed,
} from "lucide-react";

/* ========================================================================== */
/* CUSTOMER LOYALTY APP (BLUEDOX THEME MATCHED)                               */
/* ========================================================================== */

/* Standard, widely-supported system font stacks (no novelty/display fonts) */
const FONT_SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const FONT_MONO = 'ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace';

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
    canvas: "linear-gradient(135deg, #1B2A4A 0%, #2C4270 45%, #1B5E5A 100%)",
    header: "rgba(255, 255, 255, 0.07)",
    headerBorder: "rgba(255, 255, 255, 0.12)",
    cardBg: "rgba(255, 255, 255, 0.08)",
    cardBorder: "rgba(255, 255, 255, 0.16)",
    textPrimary: "#F5F7FA",
    textSecondary: "rgba(245, 247, 250, 0.72)",
    textMuted: "rgba(245, 247, 250, 0.48)",
    gridLine: "rgba(255, 255, 255, 0.12)",
    chip: "rgba(255, 255, 255, 0.10)",
    accent: "#3FD9C4",
    accentSoft: "#1CC7B0",
    blue: "#6C8FEE",
    slate: "#8C9BA5",
    gold: "#E8EAED",
    moss: "#3FD9C4",
    rust: "#E8EAED",
  },
};

function useTheme() {
  const [mode, setMode] = useState("light");
  const t = THEME[mode];
  return { mode, setMode, t };
}

/* ========================================================================== */
/* SHARED UI PRIMITIVES (inlined for single-file preview compatibility)      */
/* ========================================================================== */

function Logomark({ color = "#8C9BA5" }) {
  return (
    <span
      className="text-xs font-bold uppercase tracking-[0.2em] shrink-0"
      style={{ color, fontFamily: FONT_SANS }}
    >
    </span>
  );
}

function Button({ variant = "primary", accent, size = "md", className = "", disabled, onClick, children }) {
  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3.5 text-sm",
  };
  const base =
    "rounded-full font-medium inline-flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed";
  let style = {};
  if (variant === "primary") {
    style = { background: accent || "#1CC7B0", color: "#fff" };
  } else if (variant === "outline") {
    style = { background: "transparent", border: `1px solid ${accent || "#1CC7B0"}`, color: accent || "#1CC7B0" };
  } else {
    style = { background: "rgba(140,155,165,0.14)", color: "#6B7686" };
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${className}`} style={style}>
      {children}
    </button>
  );
}

/* Metal colors used to color-code tier names everywhere they appear */
const TIER_COLORS = {
  Bronze: "#B5651D",
  Silver: "#71797E",
  Gold: "#B8860B",
};
/* Lighter variants of the same metal colors, for use on dark/colored card backgrounds */
const TIER_COLORS_LIGHT = {
  Bronze: "#F0B27A",
  Silver: "#E8EAED",
  Gold: "#FFE08A",
};

function TierBadge({ tier }) {
  const c = TIER_COLORS[tier] || TIER_COLORS.Bronze;
  return (
    <span
      className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{ background: "rgba(255,255,255,0.92)", color: c }}
    >
      {tier}
    </span>
  );
}

function PoweredByPerch({ visible }) {
  if (visible === false) return null;
  return <p className="text-center text-[10px] tracking-wide opacity-40 mt-4">Powered by Perch</p>;
}

function VerifyCode({ brand, mode, reward, code, onCancel }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-7 text-center animate-fade-in-up">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: `${brand.primary}18` }}>
        <KeyRound size={26} style={{ color: brand.primary }} />
      </div>
      <h1 className="font-display text-xl mb-2 tracking-tight">{mode === "redeem" ? `Redeem ${reward?.name || "reward"}` : "Verify to earn points"}</h1>
      <p className="text-sm mb-7 opacity-60 max-w-[240px]">Show this code to staff — only they can confirm it at the counter.</p>
      <div className="text-3xl font-mono-data tracking-[0.3em] mb-7">{code}</div>
      <div className="flex items-center gap-2 mb-9 text-xs opacity-60">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: brand.primary }} />
        Waiting for staff to confirm…
      </div>
      <Button variant="ghost" size="md" className="w-full" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}

const rewardsCatalog = [
  { id: 1, name: "Free Coffee", cost: 100, icon: "Coffee" },
  { id: 2, name: "10% Off Next Visit", cost: 150, icon: "Percent" },
  { id: 3, name: "Free Pastry", cost: 220, icon: "Cookie" },
  { id: 4, name: "Free Meal", cost: 400, icon: "UtensilsCrossed" },
];

const activitySeed = [
  { id: 1, label: "Earned 18 pts", sub: "2 hours ago", type: "earn" },
  { id: 2, label: "Redeemed Free Coffee", sub: "Yesterday", type: "redeem" },
  { id: 3, label: "Earned 22 pts", sub: "3 days ago", type: "earn" },
];

const leaderboardSeed = [
  { id: "u1", name: "Anjali Shrestha", points: 612 },
  { id: "u2", name: "Bikash Gurung", points: 588 },
  { id: "u3", name: "Priya Karki", points: 545 },
  { id: "u4", name: "Rohan Thapa", points: 410 },
  { id: "u5", name: "Sujata Rai", points: 375 },
  { id: "u6", name: "Nabin Adhikari", points: 340 },
  { id: "u7", name: "Kripa Maharjan", points: 298 },
  { id: "u8", name: "Suresh Lama", points: 260 },
  { id: "u9", name: "Anita Basnet", points: 210 },
];

function initials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
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
  const [pendingRequestId, setPendingRequestId] = useState(null);
  const [pendingCode, setPendingCode] = useState("");

  // Auth / registration state
  const [authMethod, setAuthMethod] = useState(null); // "phone" | "email"
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailPhoneInput, setEmailPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [customer, setCustomer] = useState(DEMO_CUSTOMER);

  // Menu States
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [qrMode, setQrMode] = useState("show");

  const [rewards, setRewards] = useState(rewardsCatalog);

  useEffect(() => {
    async function loadRewards() {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("active", true)
        .order("cost", { ascending: true });
      if (error) console.error("Failed to load rewards:", error);
      else if (data && data.length) setRewards(data);
    }
    loadRewards();
  }, []);

  const [dbBrand, setDbBrand] = useState(null);

  useEffect(() => {
    async function loadBrand() {
      const { data, error } = await supabase
        .from("brand_setting")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
      if (error) {
        console.error("Failed to load brand settings:", error);
        return;
      }
      if (data) {
        setDbBrand({
          name: data.name,
          primary: data.primary_color,
          secondary: data.secondary_color,
          logoUrl: data.logo_url,
          poweredBy: data.powered_by,
        });
      }
    }
    loadBrand();
  }, []);

  const activeBrand = useMemo(() => {
    // dbBrand (owner's saved settings in Supabase) takes priority over
    // whatever brand prop this component was mounted with, so the customer
    // app always reflects what the owner dashboard has actually saved.
    const merged = { ...brand, ...dbBrand };
    return {
      ...merged,
      primary: merged?.primary || t.accent,
      secondary: merged?.secondary || t.blue,
      name: merged?.name || "Loyalty Rewards",
    };
  }, [brand, dbBrand, t]);

  const tierInfo =
    points >= 400
      ? { name: "Gold", next: null, floor: 400, ceil: null }
      : points >= 150
      ? { name: "Silver", next: "Gold", floor: 150, ceil: 400 }
      : { name: "Bronze", next: "Silver", floor: 0, ceil: 150 };

  const progressPct = tierInfo.ceil
    ? Math.min(100, Math.round(((points - tierInfo.floor) / (tierInfo.ceil - tierInfo.floor)) * 100))
    : 100;

  // Cheapest reward the customer hasn't unlocked yet — shown as a quick, concrete goal
  const nextReward = useMemo(() => {
    const locked = rewards.filter((r) => r.cost > points).sort((a, b) => a.cost - b.cost);
    return locked[0] || null;
  }, [rewards, points]);

  const monthLabel = useMemo(() => new Date().toLocaleString("en-US", { month: "long", year: "numeric" }), []);

  const leaderboard = useMemo(() => {
    const merged = [
      ...leaderboardSeed,
      { id: "me", name: customer.name || "You", points, isMe: true },
    ];
    merged.sort((a, b) => b.points - a.points);
    return merged.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [customer.name, points]);

  const myEntry = leaderboard.find((e) => e.isMe);
  const topThree = leaderboard.slice(0, 3);
  const restOfTen = leaderboard.slice(3, 10);
  const podiumOrder = topThree.length === 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;

  function goAuth(nextStep, validate) {
    if (validate && !validate()) return;
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setStep(nextStep);
    }, 600);
  }

  function chooseAuthMethod(methodName) {
    setAuthMethod(methodName);
    setOtpInput("");
    setStep(methodName === "phone" ? "phone_number" : "email_input");
  }

async function finishRegistration() {
  if (!nameInput.trim()) return;

  const payload = {
    name: nameInput.trim(),
    email: authMethod === "email" ? emailInput.trim() || null : null,
    phone: authMethod === "phone" ? phoneInput.trim() || null : emailPhoneInput.trim() || null,
  };

  const { data, error } = await supabase
    .from("customers")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert failed:", error);
    return;
  }

  setCustomer({
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    memberId: data.id.slice(0, 8),
    joined: new Date(data.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
  });
  setPoints(data.points ?? 0);
  goAuth("home");
}
  function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  // Customer can only ever CREATE a pending request. Staff on the owner
  // dashboard must confirm it (updating `pending_actions.status` to
  // "approved") before any points move — the customer app never writes to
  // `points` directly. This closes the loophole where a customer could tap
  // "Approve" on their own device.
  async function startEarn() {
    const code = generateCode();
    setModeState("earn");
    setReward(null);
    setPendingCode(code);
    setStep("verify");

    const { data, error } = await supabase
      .from("pending_actions")
      .insert([{ customer_id: customer.id, type: "earn", reward_id: null, code, status: "pending" }])
      .select()
      .single();

    if (error) {
      console.error("Failed to create pending earn request:", error);
      return;
    }
    setPendingRequestId(data.id);
  }

  async function startRedeem(selectedReward) {
    const code = generateCode();
    setModeState("redeem");
    setReward(selectedReward);
    setPendingCode(code);
    setStep("verify");

    const { data, error } = await supabase
      .from("pending_actions")
      .insert([{ customer_id: customer.id, type: "redeem", reward_id: selectedReward.id, code, status: "pending" }])
      .select()
      .single();

    if (error) {
      console.error("Failed to create pending redeem request:", error);
      return;
    }
    setPendingRequestId(data.id);
  }

  // Poll the pending request while the customer is on the "verify" screen.
  // Only a staff-side action (owner dashboard) can flip status to "approved".
  useEffect(() => {
    if (step !== "verify" || !pendingRequestId) return;

    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from("pending_actions")
        .select("*")
        .eq("id", pendingRequestId)
        .single();

      if (error) {
        console.error("Failed to poll pending request:", error);
        return;
      }

      if (data?.status === "approved") {
        clearInterval(interval);
        const { data: customerRow, error: customerError } = await supabase
          .from("customers")
          .select("points")
          .eq("id", customer.id)
          .single();

        if (customerError) {
          console.error("Failed to refresh points after approval:", customerError);
          return;
        }

        setLastGain((customerRow.points ?? points) - points);
        setPoints(customerRow.points ?? points);
        setPendingRequestId(null);
        setStep("approved");
      } else if (data?.status === "declined") {
        clearInterval(interval);
        setPendingRequestId(null);
        setStep("home");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [step, pendingRequestId, customer.id, points]);

  async function cancelVerify() {
    if (pendingRequestId) {
      const { error } = await supabase.from("pending_actions").update({ status: "cancelled" }).eq("id", pendingRequestId);
      if (error) console.error("Failed to cancel pending request:", error);
    }
    setPendingRequestId(null);
    setStep("home");
  }

  function toggleQrMenu() {
    setAccountOpen(false);
    setNotifOpen(false);
    setScannerOpen((prev) => !prev);
  }

  function handleLogout() {
    setAccountOpen(false);
    setNotifOpen(false);
    setAppearanceOpen(false);
    setScannerOpen(false);
    setReward(null);
    setPendingRequestId(null);
    setPendingCode("");
    setModeState("earn");
    setLastGain(0);
    setAuthMethod(null);
    setPhoneInput("");
    setEmailInput("");
    setEmailPhoneInput("");
    setOtpInput("");
    setNameInput("");
    setStep("auth");
  }

  const isAuthStep = ["auth", "phone_number", "phone_verify", "email_input", "email_verify"].includes(step);
  const ICONS = { Coffee, Percent, Cookie, UtensilsCrossed };

  return (
    <div
      className="flex flex-col w-full h-[100dvh] overflow-hidden relative"
      style={{ background: t.canvas, fontFamily: FONT_SANS, transition: "background-color 200ms ease-out, background 200ms ease-out", willChange: "background" }}
    >
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
  background-color: rgba(255, 255, 255, 0.10) !important;
  backdrop-filter: blur(14px) saturate(130%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(130%) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.16) !important;
  transition: none !important;
  transform: translateZ(0);
  will-change: backdrop-filter;
}
.otp-input {
  letter-spacing: 0.5em;
  text-indent: 0.5em;
}
.font-display {
  font-family: ${FONT_SANS};
  font-weight: 800;
}
.font-body {
  font-family: ${FONT_SANS};
}
.font-mono-data {
  font-family: ${FONT_MONO};
  font-weight: 700;
}
      `}</style>

      {/* ==================== AUTH: METHOD CHOICE ==================== */}
      {step === "auth" && (
        <div className="flex-1 flex flex-col relative overflow-hidden animate-fade-in-up">
          {/* Decorative brand-colored glow, echoes the balance card gradient elsewhere in the app */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none opacity-25 blur-3xl"
            style={{ background: `linear-gradient(135deg, ${activeBrand.secondary}, ${activeBrand.primary})` }}
          />

          <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
            <div className="w-full max-w-sm mx-auto flex flex-col items-center">
              {activeBrand.logoUrl ? (
                <img src={activeBrand.logoUrl} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-soft-lg mb-5" />
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft-lg mb-5"
                  style={{ background: `linear-gradient(135deg, ${activeBrand.secondary}, ${activeBrand.primary})` }}
                >
                  <Coffee size={26} className="text-white" />
                </div>
              )}

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-center" style={{ color: t.textPrimary }}>
                {activeBrand.name}
              </h1>
              <p className="text-sm mt-1.5 mb-10 text-center" style={{ color: t.textSecondary }}>
                Sign in to earn points and unlock rewards
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => chooseAuthMethod("phone")}
                  disabled={authLoading}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 shadow-soft-lg ${themeMode === "glass" ? "glass-active" : ""}`}
                  style={themeMode === "glass" ? { color: "#fff" } : { background: activeBrand.primary, color: "#fff" }}
                >
                  <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <Phone size={14} />
                  </span>
                  Continue with phone number
                </button>

                <button
                  onClick={() => chooseAuthMethod("email")}
                  disabled={authLoading}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 ${themeMode === "glass" ? "glass-active" : ""}`}
                  style={themeMode === "glass" ? { color: t.textPrimary } : { border: `1.5px solid ${t.cardBorder}`, color: t.textPrimary, background: t.cardBg }}
                >
                  <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: t.chip }}>
                    <Mail size={14} style={{ color: t.textSecondary }} />
                  </span>
                  Continue with email
                </button>
              </div>
            </div>
          </div>

          <div className="pb-6">
            <PoweredByPerch visible={activeBrand.poweredBy} />
          </div>
        </div>
      )}

      {/* ==================== AUTH: PHONE NUMBER ==================== */}
      {step === "phone_number" && (
        <AuthScreen
          t={t}
          themeMode={themeMode}
          onBack={() => setStep("auth")}
          icon={<Smartphone size={22} style={{ color: activeBrand.primary }} />}
          title="Enter your phone number"
          subtitle="We'll text you a one-time code to verify."
        >
          <input
            type="tel"
            inputMode="tel"
            autoFocus
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !authLoading && phoneInput.trim()) goAuth("phone_verify", () => phoneInput.trim().length > 0);
            }}
            placeholder="+977 98XXXXXXXX"
            className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none mb-5 font-mono-data"
            style={{ background: t.chip, color: t.textPrimary, border: `1px solid ${t.cardBorder}` }}
          />
          <Button
            variant="primary"
            accent={activeBrand.primary}
            size="lg"
            className="w-full"
            disabled={authLoading || !phoneInput.trim()}
            onClick={() => goAuth("phone_verify", () => phoneInput.trim().length > 0)}
          >
            {authLoading ? "Sending code…" : "Send code"}
          </Button>
        </AuthScreen>
      )}

      {/* ==================== AUTH: PHONE VERIFY (code + name combined) ==================== */}
      {step === "phone_verify" && (
        <AuthScreen
          t={t}
          themeMode={themeMode}
          onBack={() => setStep("phone_number")}
          icon={<KeyRound size={22} style={{ color: activeBrand.primary }} />}
          title="Almost there"
          subtitle={`Enter the 4-digit code we sent to ${phoneInput || "your phone"}, and tell us your name.`}
        >
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            autoFocus
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !authLoading && otpInput.length >= 4 && nameInput.trim()) finishRegistration();
            }}
            placeholder="••••"
            className="otp-input w-full rounded-2xl px-4 py-3.5 text-center text-2xl outline-none mb-3 font-mono-data"
            style={{ background: t.chip, color: t.textPrimary, border: `1px solid ${t.cardBorder}` }}
          />
          <input
            type="text"
            autoFocus={false}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !authLoading && otpInput.length >= 4 && nameInput.trim()) finishRegistration();
            }}
            placeholder="Full name"
            className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none mb-5"
            style={{ background: t.chip, color: t.textPrimary, border: `1px solid ${t.cardBorder}` }}
          />
          <Button
            variant="primary"
            accent={activeBrand.primary}
            size="lg"
            className="w-full"
            disabled={authLoading || otpInput.length < 4 || !nameInput.trim()}
            onClick={finishRegistration}
          >
            {authLoading ? "Setting up…" : "Continue"}
          </Button>
        </AuthScreen>
      )}

      {/* ==================== AUTH: EMAIL INPUT (phone optional) ==================== */}
      {step === "email_input" && (
        <AuthScreen
          t={t}
          themeMode={themeMode}
          onBack={() => setStep("auth")}
          icon={<Mail size={22} style={{ color: activeBrand.primary }} />}
          title="Enter your email"
          subtitle="We'll email you a one-time code to verify."
        >
          <input
            type="email"
            inputMode="email"
            autoFocus
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !authLoading && emailInput.trim()) goAuth("email_verify", () => emailInput.trim().length > 0);
            }}
            placeholder="you@example.com"
            className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none mb-3"
            style={{ background: t.chip, color: t.textPrimary, border: `1px solid ${t.cardBorder}` }}
          />
          <input
            type="tel"
            inputMode="tel"
            value={emailPhoneInput}
            onChange={(e) => setEmailPhoneInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !authLoading && emailInput.trim()) goAuth("email_verify", () => emailInput.trim().length > 0);
            }}
            placeholder="Phone number (optional)"
            className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none mb-5 font-mono-data"
            style={{ background: t.chip, color: t.textPrimary, border: `1px solid ${t.cardBorder}` }}
          />
          <Button
            variant="primary"
            accent={activeBrand.primary}
            size="lg"
            className="w-full"
            disabled={authLoading || !emailInput.trim()}
            onClick={() => goAuth("email_verify", () => emailInput.trim().length > 0)}
          >
            {authLoading ? "Sending code…" : "Send code"}
          </Button>
        </AuthScreen>
      )}

      {/* ==================== AUTH: EMAIL VERIFY (code + name combined) ==================== */}
      {step === "email_verify" && (
        <AuthScreen
          t={t}
          themeMode={themeMode}
          onBack={() => setStep("email_input")}
          icon={<KeyRound size={22} style={{ color: activeBrand.primary }} />}
          title="Almost there"
          subtitle={`Enter the 4-digit code we sent to ${emailInput || "your email"}, and tell us your name.`}
        >
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            autoFocus
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !authLoading && otpInput.length >= 4 && nameInput.trim()) finishRegistration();
            }}
            placeholder="••••"
            className="otp-input w-full rounded-2xl px-4 py-3.5 text-center text-2xl outline-none mb-3 font-mono-data"
            style={{ background: t.chip, color: t.textPrimary, border: `1px solid ${t.cardBorder}` }}
          />
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !authLoading && otpInput.length >= 4 && nameInput.trim()) finishRegistration();
            }}
            placeholder="Full name"
            className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none mb-5"
            style={{ background: t.chip, color: t.textPrimary, border: `1px solid ${t.cardBorder}` }}
          />
          <Button
            variant="primary"
            accent={activeBrand.primary}
            size="lg"
            className="w-full"
            disabled={authLoading || otpInput.length < 4 || !nameInput.trim()}
            onClick={finishRegistration}
          >
            {authLoading ? "Setting up…" : "Continue"}
          </Button>
        </AuthScreen>
      )}

      {/* ==================== HOME ==================== */}
      {step === "home" && (
        <div className="flex-1 flex flex-col overflow-y-auto scroll-thin animate-fade-in-up relative">
          <div
            className={`px-5 py-4 flex items-center justify-between sticky top-0 z-50 ${themeMode === "glass" ? "glass-active" : ""}`}
            style={themeMode === "glass" ? {} : { backgroundColor: t.header, borderBottom: `1px solid ${t.headerBorder}` }}
          >
            <div className="flex items-center gap-2">
              {activeBrand.logoUrl && (
                <img src={activeBrand.logoUrl} alt="" className="w-6 h-6 rounded-md object-cover shrink-0" />
              )}
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
                background: `linear-gradient(135deg, ${activeBrand.secondary}, ${activeBrand.primary})`,
                border: themeMode === "glass" ? "1px solid rgba(255,255,255,0.3)" : "none",
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-14 -left-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">Your balance</span>
                  <TierBadge tier={tierInfo.name} />
                </div>
                <div className="font-mono-data text-4xl font-extrabold mb-4 tracking-tight">
                  {points} <span className="font-body text-base font-semibold opacity-80">pts</span>
                </div>
                {tierInfo.next ? (
                  <>
                    <div className="h-1.5 rounded-full bg-white/25 overflow-hidden mb-1.5">
                      <div className="h-full rounded-full bg-white transition-all duration-700 ease-out" style={{ width: `${progressPct}%` }} />
                    </div>
                    <div className="text-xs opacity-90">
                      {tierInfo.ceil - points} pts to{" "}
                      <span className="font-bold" style={{ color: TIER_COLORS_LIGHT[tierInfo.next] }}>
                        {tierInfo.next}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-xs opacity-80 flex items-center gap-1.5">
                    <Sparkles size={12} /> You&apos;ve reached the top tier
                  </div>
                )}
              </div>
            </div>

            {/* NEXT REWARD — a concrete, immediate goal instead of just an abstract tier */}
            {nextReward && (
              <div
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 mb-5 ${themeMode === "glass" ? "glass-active" : ""}`}
                style={themeMode === "glass" ? {} : { background: t.cardBg, border: `1px solid ${t.cardBorder}` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs" style={{ color: t.textSecondary }}>
                    <span className="font-bold" style={{ color: activeBrand.primary }}>{Math.max(0, nextReward.cost - points)} pts</span> away from
                  </div>
                  <div className="text-sm font-bold truncate" style={{ color: t.textPrimary }}>
                    {nextReward.name}
                  </div>
                </div>
                <div className="h-1.5 w-16 rounded-full overflow-hidden shrink-0" style={{ background: t.gridLine }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((points / nextReward.cost) * 100))}%`,
                      background: activeBrand.primary,
                    }}
                  />
                </div>
              </div>
            )}

            {/* PRIMARY ACTION — one big, thumb-reachable button for earning/redeeming */}
            <div className="mb-4">
              <Button variant="primary" accent={activeBrand.primary} size="lg" className="w-full shadow-soft-lg !py-4 !text-base" onClick={toggleQrMenu}>
                <QrCode size={18} /> Earn or redeem points
              </Button>
            </div>

            {/* Leaderboard — demoted to a small secondary link, not a full card */}
            <button
              type="button"
              onClick={() => setStep("leaderboard")}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-medium mb-7 py-1.5 transition-opacity hover:opacity-70"
              style={{ color: t.textSecondary }}
            >
              <Trophy size={12} />
              You&apos;re #{myEntry?.rank ?? "N/A"} on the leaderboard this month
              <ChevronRight size={12} />
            </button>

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
                    <Button variant="primary" accent={activeBrand.primary} size="sm" onClick={startEarn}>
                      Share QR
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-extrabold tracking-tight" style={{ color: t.textPrimary }}>
                Rewards
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2.5 mb-7">
  {rewards.map((item) => {
    const canRedeem = points >= item.cost;
    const shortfall = item.cost - points;
    const RewardIcon = ICONS[item.icon] || Coffee;
    return (
      <div
        key={item.id}
        className={`flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors duration-200 shadow-sm hover:shadow-md ${themeMode === "glass" ? "glass-active" : ""}`}
        style={{
          opacity: canRedeem ? 1 : 0.55,
          ...(themeMode === "glass" ? {} : { background: t.cardBg, border: `1px solid ${t.cardBorder}` }),
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: canRedeem ? "linear-gradient(135deg,#F5C518,#F0932B)" : t.chip }}
          >
            <RewardIcon size={16} className={canRedeem ? "text-white" : ""} style={canRedeem ? {} : { color: t.textSecondary }} />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: t.textPrimary }}>
              {item.name}
            </div>
            <div className="text-xs font-mono-data" style={{ color: canRedeem ? activeBrand.primary : t.textSecondary }}>
              {canRedeem ? `${item.cost} pts` : `Need ${shortfall} more pts`}
            </div>
          </div>
        </div>

        {canRedeem ? (
          <Button variant="primary" accent={activeBrand.primary} size="sm" onClick={() => startRedeem(item)}>
            Redeem
          </Button>
        ) : (
          <Button variant="ghost" size="sm" disabled>
            Locked
          </Button>
        )}
      </div>
    );
  })}
            </div>
            <div className="mt-auto pb-4">
              <PoweredByPerch visible={activeBrand.poweredBy} />
            </div>
          </div>
        </div>
      )}

      {/* ==================== LEADERBOARD ==================== */}
      {step === "leaderboard" && (
        <div className="flex-1 flex flex-col overflow-y-auto scroll-thin animate-fade-in-up relative">
          <div
            className={`px-5 py-4 flex items-center gap-3 sticky top-0 z-10 ${themeMode === "glass" ? "glass-active" : ""}`}
            style={themeMode === "glass" ? {} : { backgroundColor: t.header, borderBottom: `1px solid ${t.headerBorder}` }}
          >
            <button
              type="button"
              onClick={() => setStep("home")}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:opacity-80 shrink-0"
              style={{ background: t.chip }}
              aria-label="Back"
            >
              <ArrowLeft size={15} style={{ color: t.textPrimary }} />
            </button>
            <span className="font-display text-lg font-extrabold tracking-tight" style={{ color: t.textPrimary }}>
              Leaderboard
            </span>
          </div>

          <div className="px-5 pt-6 pb-8">
            {/* MONTH LABEL */}
            <div className="flex flex-col items-center mb-6">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-1"
                style={{ background: `${activeBrand.primary}18`, color: activeBrand.primary }}
              >
                {monthLabel}
              </span>
              <p className="text-xs" style={{ color: t.textSecondary }}>
                Rankings reset at the start of every month
              </p>
            </div>

            {/* PODIUM: TOP 3 */}
            {podiumOrder.length === 3 && (
              <div
                className={`rounded-3xl px-4 pt-7 pb-5 mb-6 relative overflow-hidden shadow-soft-lg ${themeMode === "glass" ? "glass-active" : ""}`}
                style={
                  themeMode === "glass"
                    ? {}
                    : { background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)` }
                }
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                <div className="flex items-end justify-center gap-3 relative">
                  {podiumOrder.map((entry) => {
                    const isFirst = entry.rank === 1;
                    const isSecond = entry.rank === 2;
                    const medal = isFirst
                      ? { ring: "#F5C518", label: "Gold", h: "h-28" }
                      : isSecond
                      ? { ring: "#C7CDD6", label: "Silver", h: "h-20" }
                      : { ring: "#CD7F32", label: "Bronze", h: "h-16" };
                    return (
                      <div key={entry.id} className="flex flex-col items-center w-24">
                        {isFirst && <Crown size={20} className="mb-1" style={{ color: "#F5C518" }} />}
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-sm mb-2 relative"
                          style={{
                            background: entry.isMe ? activeBrand.primary : "rgba(255,255,255,0.12)",
                            border: `2px solid ${medal.ring}`,
                            color: "#fff",
                          }}
                        >
                          {initials(entry.name)}
                        </div>
                        <p className="text-xs font-semibold text-white text-center truncate w-full">{entry.isMe ? "You" : entry.name}</p>
                        <p className="text-[11px] font-mono-data mb-2" style={{ color: medal.ring }}>
                          {entry.points} pts
                        </p>
                        <div
                          className={`w-full rounded-t-xl flex items-start justify-center pt-1.5 ${medal.h}`}
                          style={{ background: `linear-gradient(180deg, ${medal.ring}55, ${medal.ring}22)` }}
                        >
                          <span className="text-white font-display font-extrabold text-lg">{entry.rank}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RANKS 4-10 */}
            <div className="flex flex-col gap-2 mb-6">
              {restOfTen.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-colors duration-200 ${themeMode === "glass" ? "glass-active" : ""}`}
                  style={
                    themeMode === "glass"
                      ? {}
                      : {
                          background: entry.isMe ? `${activeBrand.primary}12` : t.cardBg,
                          border: entry.isMe ? `1.5px solid ${activeBrand.primary}` : `1px solid ${t.cardBorder}`,
                        }
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-sm font-mono-data font-semibold text-center" style={{ color: t.textSecondary }}>
                      {entry.rank}
                    </span>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0"
                      style={{ background: entry.isMe ? activeBrand.primary : t.chip, color: entry.isMe ? "#fff" : t.textSecondary }}
                    >
                      {initials(entry.name)}
                    </div>
                    <span className="text-sm font-medium" style={{ color: t.textPrimary }}>
                      {entry.isMe ? "You" : entry.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono-data" style={{ color: t.textSecondary }}>
                    {entry.points} pts
                  </span>
                </div>
              ))}
            </div>

            {/* YOUR RANK */}
            {myEntry && (
              <div
                className={`rounded-3xl px-5 py-4 shadow-soft-lg ${themeMode === "glass" ? "glass-active" : ""}`}
                style={
                  themeMode === "glass"
                    ? {}
                    : { background: `linear-gradient(135deg, ${activeBrand.secondary}, ${activeBrand.primary})` }
                }
              >
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Medal size={20} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-90">Your rank · {monthLabel}</p>
                      <p className="font-display text-2xl font-extrabold">#{myEntry.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-data text-lg font-extrabold">{myEntry.points} pts</p>
                    <TierBadge tier={tierInfo.name} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-auto pb-4 px-5">
            <PoweredByPerch visible={activeBrand.poweredBy} />
          </div>
        </div>
      )}

      {/* NEW MENU PLACEMENT:
        Moving the menus OUT of the sticky header and putting them at the root level fixes the nested backdrop-filter bug. 
      */}
      {step === "home" && (notifOpen || accountOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotifOpen(false);
            setAccountOpen(false);
            setAppearanceOpen(false);
          }}
        />
      )}
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
                {customer.name}
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
            {customer.email && (
              <div className="flex items-center gap-2" style={{ color: t.textSecondary }}>
                <Mail size={14} />
                <span className="font-semibold" style={{ color: t.textPrimary }}>{customer.email}</span>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2" style={{ color: t.textSecondary }}>
                <Phone size={14} />
                <span className="font-semibold" style={{ color: t.textPrimary }}>{customer.phone}</span>
              </div>
            )}
            <div className="rounded-2xl px-3 py-2 flex items-center justify-between" style={{ background: t.chip }}>
              <div>
                <p className="text-xs" style={{ color: t.textSecondary }}>
                  Loyalty ID
                </p>
                <p className="text-sm font-medium" style={{ color: t.textPrimary }}>
                  {customer.memberId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: t.textSecondary }}>
                  Member since
                </p>
                <p className="text-sm font-medium" style={{ color: t.textPrimary }}>
                  {customer.joined}
                </p>
              </div>
            </div>

            {/* Appearance — tucked behind a collapsed row so it doesn't compete with account info */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setAppearanceOpen((v) => !v)}
                className="w-full flex items-center justify-between rounded-2xl px-3 py-2 transition-opacity hover:opacity-80"
                style={{ background: t.chip }}
              >
                <span className="flex items-center gap-2 text-xs" style={{ color: t.textSecondary }}>
                  {themeMode === "light" ? <Sun size={13} /> : themeMode === "dark" ? <Moon size={13} /> : <Droplet size={13} />}
                  Appearance
                </span>
                <ChevronDown
                  size={13}
                  style={{ color: t.textSecondary, transform: appearanceOpen ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
                />
              </button>
              {appearanceOpen && (
                <div className="p-1 rounded-2xl flex gap-1 mt-2" style={{ background: t.chip }}>
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
              )}
            </div>
          </div>

          <Button variant="primary" accent={activeBrand.primary} size="sm" className="w-full mt-2" onClick={handleLogout}>
            <LogOut size={14} /> Sign out
          </Button>
        </div>
      )}

      {step === "verify" && (
        <VerifyCode brand={activeBrand} mode={mode} reward={reward} code={pendingCode} onCancel={cancelVerify} />
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
          <Button variant="primary" accent={activeBrand.primary} size="lg" className="w-full" onClick={() => setStep("home")}>
            Back to home
          </Button>
        </div>
      )}
    </div>
  );
}

/* Reusable auth step shell: icon + title + subtitle + back button + content */
function AuthScreen({ t, themeMode, onBack, icon, title, subtitle, children }) {
  return (
    <div className="flex-1 flex flex-col px-6 py-8 animate-fade-in-up">
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:opacity-80 mb-8"
        style={{ background: t.chip }}
        aria-label="Back"
      >
        <ArrowLeft size={15} style={{ color: t.textPrimary }} />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: t.chip }}>
          {icon}
        </div>
        <h1 className="font-display text-2xl font-extrabold mb-1.5 tracking-tight" style={{ color: t.textPrimary }}>
          {title}
        </h1>
        <p className="text-sm mb-7" style={{ color: t.textSecondary }}>
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
}

export default CustomerApp;
export { CustomerApp };
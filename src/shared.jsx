import React, { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import {
  QrCode, TrendingUp, TrendingDown, Users, Bell, Palette, Gift,
  Mail, ChevronRight, Check, CheckCircle2, Clock, Sun, Cloud,
  CloudRain, ArrowLeft, Award, AlertTriangle, Send, Plus, Upload,
  BarChart3, Home, DollarSign, Smartphone, MessageSquare, Apple, Sparkles,
} from "lucide-react";

/* ---------------------------------- tokens ---------------------------------- */

const PLATFORM = { name: "Perch", tagline: "Loyalty for independent cafés" };

const CHART = {
  copper: "#C15A2C",
  moss: "#4B5D3A",
  slate: "#5B6B79",
  gold: "#C9972B",
  rust: "#A4462B",
};

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#C15A2C");
  if (!m) return [193, 90, 44];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "white",
    border: "none",
    borderRadius: 12,
    boxShadow: "0 8px 24px -8px rgba(28,25,23,0.20)",
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
    padding: "8px 12px",
  },
  labelStyle: { color: "#a8a29e", fontSize: 11, marginBottom: 2 },
  itemStyle: { padding: 0 },
};

/* ---------------------------------- mock data ---------------------------------- */

const revenueSplitData = [
  { name: "Loyalty customers", value: 62 },
  { name: "Walk-in", value: 38 },
];

const visitFrequencyData = [
  { month: "Jan", avgVisits: 2.1 },
  { month: "Feb", avgVisits: 2.3 },
  { month: "Mar", avgVisits: 2.6 },
  { month: "Apr", avgVisits: 2.4 },
  { month: "May", avgVisits: 2.9 },
  { month: "Jun", avgVisits: 3.2 },
];

const weeklyTrafficData = [
  { day: "Mon", visits: 210 },
  { day: "Tue", visits: 198 },
  { day: "Wed", visits: 225 },
  { day: "Thu", visits: 240 },
  { day: "Fri", visits: 289 },
  { day: "Sat", visits: 312 },
  { day: "Sun", visits: 260 },
];

const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function heatValue(dayIdx, hour) {
  const isWeekend = dayIdx >= 5;
  const morningPeak = Math.exp(-Math.pow(hour - (isWeekend ? 10 : 8), 2) / 8) * 100;
  const lunchPeak = Math.exp(-Math.pow(hour - 12.5, 2) / 3) * 70;
  const afternoonPeak = isWeekend
    ? Math.exp(-Math.pow(hour - 15, 2) / 6) * 60
    : Math.exp(-Math.pow(hour - 16, 2) / 10) * 35;
  const base = 15 + (dayIdx === 4 || dayIdx === 5 ? 10 : 0);
  return Math.round(base + morningPeak + lunchPeak + afternoonPeak);
}
const heatmapData = DAYS.map((_, di) => HOURS.map((h) => heatValue(di, h)));

const forecastData = [
  { day: "Today", date: "Jul 2", predicted: 265, weather: "sunny", temp: 24 },
  { day: "Fri", date: "Jul 3", predicted: 310, weather: "sunny", temp: 26, note: "Payday Friday — expect a bump" },
  { day: "Sat", date: "Jul 4", predicted: 295, weather: "rain", temp: 19, note: "Rain may cut walk-ins ~8%" },
  { day: "Sun", date: "Jul 5", predicted: 250, weather: "rain", temp: 18 },
  { day: "Mon", date: "Jul 6", predicted: 300, weather: "sunny", temp: 23, note: "Farmers market next door" },
  { day: "Tue", date: "Jul 7", predicted: 235, weather: "cloudy", temp: 21 },
  { day: "Wed", date: "Jul 8", predicted: 245, weather: "cloudy", temp: 22 },
];

const sleeperSeed = [
  { id: 1, name: "Sachet Poudel", initials: "MC", tier: "Gold", lastVisit: 16, points: 420, lifetimeVisits: 87 },
  { id: 2, name: "Aditya Khanal", initials: "PP", tier: "Silver", lastVisit: 19, points: 210, lifetimeVisits: 34 },
  { id: 3, name: "Sneha Uprety", initials: "SO", tier: "Bronze", lastVisit: 22, points: 95, lifetimeVisits: 12 },
  { id: 4, name: "Yojana Malla", initials: "ER", tier: "Gold", lastVisit: 15, points: 510, lifetimeVisits: 103 },
  { id: 5, name: "Dinesh Shrestha", initials: "DM", tier: "Silver", lastVisit: 28, points: 180, lifetimeVisits: 29 },
];

const campaignSeed = [
  { id: 1, name: "Sleepy Regulars Win-back", segment: "14+ days inactive", channel: "SMS", sent: 142, sentDate: "Jun 18", openRate: 71, redemptionRate: 24 },
  { id: 2, name: "Rainy Day Double Points", segment: "All active members", channel: "Email", sent: 890, sentDate: "Jun 22", openRate: 38, redemptionRate: 12 },
  { id: 3, name: "Gold Tier Early Access", segment: "Gold tier", channel: "SMS", sent: 64, sentDate: "Jun 25", openRate: 88, redemptionRate: 41 },
  { id: 4, name: "Weekend Warm-up", segment: "New members (<30 days)", channel: "Email", sent: 56, sentDate: "Jun 28", openRate: 52, redemptionRate: 18 },
];

const tiersSeed = [
  { name: "Bronze", threshold: "0 – 149 pts", color: "#A8763E", perks: ["1 pt per $1 spent", "Birthday drink"] },
  { name: "Silver", threshold: "150 – 399 pts", color: "#9AA5B1", perks: ["1.25 pt per $1", "Free size upgrade", "Birthday drink"] },
  { name: "Gold", threshold: "400+ pts", color: "#C9972B", perks: ["1.5 pt per $1", "Free drink monthly", "Early access to drops", "Birthday drink"] },
];

const challengeSeed = [
  { id: 1, name: "Weekend Warrior", rule: "Visit 2× on Sat & Sun this month", reward: "+50 bonus pts", status: "Active" },
  { id: 2, name: "Early Bird", rule: "Order before 9am, 5 times", reward: "+30 bonus pts", status: "Active" },
  { id: 3, name: "Bring a Friend", rule: "Refer 1 friend who joins", reward: "Free drink for both", status: "Paused" },
];

const rewardsCatalog = [
  { id: 1, name: "Free drip coffee", cost: 80 },
  { id: 2, name: "Any drink, any size", cost: 150 },
  { id: 3, name: "Pastry of your choice", cost: 100 },
];

const activitySeed = [
  { id: 1, label: "Earned 12 pts", sub: "Jun 29 · Flat White", type: "earn" },
  { id: 2, label: "Redeemed Free drip coffee", sub: "Jun 24 · −80 pts", type: "redeem" },
  { id: 3, label: "Earned 9 pts", sub: "Jun 21 · Cappuccino", type: "earn" },
];

/* ---------------------------------- shared bits ---------------------------------- */

function Logomark({ color = "#C15A2C", size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <line x1="4" y1="30" x2="36" y2="30" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <path
        d="M14 28c-1-8 5-14 13-13 3 0.3 5 2 5 2s-2 0.5-4 0.2c3 2 4 5 3 8-1-3-3-4-3-4s1 4-2 6c-3 2-7 1.5-9-1-1-1-2-3-3 1.8z"
        fill={color}
      />
      <circle cx="25.5" cy="16.5" r="1.2" fill="#fff" />
    </svg>
  );
}

function PoweredByPerch({ visible }) {
  if (!visible) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 py-4 text-stone-300">
      <Logomark color="#D6D3CD" size={12} />
      <span className="text-xs">Powered by {PLATFORM.name}</span>
    </div>
  );
}

function TierBadge({ tier }) {
  const colors = { Bronze: "#A8763E", Silver: "#9AA5B1", Gold: "#C9972B" };
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white tracking-wide"
      style={{ backgroundColor: colors[tier] || CHART.slate }}
    >
      {tier}
    </span>
  );
}

function Button({ variant = "primary", accent, size = "md", className = "", children, disabled, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-200 ease-out active:scale-95 disabled:opacity-40 disabled:pointer-events-none rounded-full";
  const sizes = { sm: "text-xs px-3.5 py-1.5", md: "text-sm px-4 py-2.5", lg: "text-sm px-5 py-3" };
  const variants = {
    primary: "text-white shadow-soft hover:shadow-soft-lg hover:brightness-105",
    ghost: "bg-stone-100 text-stone-400",
    outline: "border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300",
  };
  const style = variant === "primary" ? { backgroundColor: accent || CHART.copper } : {};
  return (
    <button type="button" disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} style={style} {...props}>
      {children}
    </button>
  );
}

function SegmentedToggle({ options, value, onChange, accent = CHART.copper, dark = false }) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;
  return (
    <div
      className={`relative grid p-1 rounded-full ${dark ? "bg-white/10" : "bg-stone-100"}`}
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
    >
      <div
        className="absolute top-1 bottom-1 rounded-full transition-transform duration-300 ease-out"
        style={{
          width: `calc(${100 / n}% - 4px)`,
          left: 4,
          transform: `translateX(calc(${idx * 100}% + ${idx * 4}px))`,
          backgroundColor: dark ? "white" : accent,
        }}
      />
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
              active ? (dark ? "text-stone-900" : "text-white") : dark ? "text-stone-300" : "text-stone-500"
            }`}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function CountdownRing({ seconds, total = 60, color = CHART.copper, size = 26, trackColor = "#EDE6D8" }) {
  const stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, seconds / total));
  const offset = c * (1 - pct);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
    </div>
  );
}

function PhoneFrame({ children, minHeight = 700, showNotch = true, maxWidth = 380 }) {
  return (
    <div className="mx-auto" style={{ maxWidth }}>
      <div className="bg-stone-900 rounded-3xl p-2.5 shadow-soft-lg">
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col relative" style={{ minHeight }}>
          {showNotch && (
            <div className="h-6 flex items-center justify-center shrink-0 bg-white">
              <div className="w-16 h-1.5 bg-stone-200 rounded-full" />
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

function Card({ title, action, className = "", children }) {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-3xl ring-1 ring-stone-900/5 shadow-soft p-6 transition-shadow duration-300 hover:shadow-soft-lg ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-100">
          <h3 className="font-display text-lg text-stone-900 tracking-tight">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, delta, positive, accent }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl ring-1 ring-stone-900/5 shadow-soft p-6 transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">{label}</span>
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}14` }}>
          <Icon size={15} style={{ color: accent }} />
        </div>
      </div>
      <div className="font-mono-data text-3xl text-stone-900 tracking-tight">{value}</div>
      {delta && (
        <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${positive ? "text-emerald-600" : "text-rose-600"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {delta}
        </div>
      )}
    </div>
  );
}

function pseudoQRGrid(seedStr, size = 7) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const grid = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      row.push((seed >> 16) % 2 === 0);
    }
    grid.push(row);
  }
  return grid;
}

function VerifyCode({ brand, mode, reward, onApprove, onBack }) {
  const [display, setDisplay] = useState("qr");
  const [seed, setSeed] = useState(() => Math.random().toString(36).slice(2, 10));
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setSeed(Math.random().toString(36).slice(2, 10));
          return 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const grid = useMemo(() => pseudoQRGrid(seed), [seed]);
  const pin = useMemo(() => {
    let s = 0;
    for (let i = 0; i < seed.length; i++) s = (s * 7 + seed.charCodeAt(i)) % 9000;
    return String(1000 + s);
  }, [seed]);

  return (
    <div className="flex-1 flex flex-col px-6 py-5 animate-fade-in-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-stone-400 text-sm mb-4 self-start transition-colors duration-200 hover:text-stone-700"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <h2 className="font-display text-xl text-stone-900 mb-1 tracking-tight">
        {mode === "redeem" ? `Redeem: ${reward?.name}` : "Confirm your visit"}
      </h2>
      <p className="text-sm text-stone-500 mb-5 leading-relaxed">
        {mode === "redeem"
          ? "Show this to your barista to redeem your reward."
          : "Show this to your barista to earn points on today's order."}
      </p>

      <div className="flex justify-center mb-5">
        <SegmentedToggle
          value={display}
          onChange={setDisplay}
          accent={brand.primary}
          options={[
            { value: "qr", label: "QR code" },
            { value: "pin", label: "4-digit PIN" },
          ]}
        />
      </div>

      <div
        className="rounded-3xl p-7 flex items-center justify-center mb-4 ring-1 ring-stone-900/5"
        style={{ minHeight: 210, background: "linear-gradient(180deg, #FAF8F4, #F2ECE0)" }}
      >
        <div key={display + seed} className="animate-scale-in">
          {display === "qr" ? (
            <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(7, 1fr)", width: 168 }}>
              {grid.flat().map((on, i) => (
                <div key={i} style={{ width: 20, height: 20, backgroundColor: on ? "#1c1917" : "transparent" }} />
              ))}
            </div>
          ) : (
            <div className="font-mono-data text-5xl tracking-widest text-stone-900">{pin}</div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2.5 mb-7">
        <CountdownRing seconds={secondsLeft} color={brand.primary} size={26} />
        <span className="text-xs text-stone-400">refreshes automatically</span>
      </div>

      <div className="border border-stone-200/70 rounded-2xl p-4 mt-auto bg-stone-50/60">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone size={13} className="text-stone-400" />
          <span className="text-xs text-stone-400">Barista tablet (simulated)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-stone-800">Code {display === "qr" ? "scanned" : pin}</div>
            <div className="text-xs text-stone-400">{mode === "redeem" ? reward?.name : "Visit verification"}</div>
          </div>
          <Button variant="primary" accent={CHART.moss} size="sm" onClick={onApprove}>
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}

export {
  PLATFORM, CHART, hexToRgb, tooltipStyle,
  revenueSplitData, visitFrequencyData, weeklyTrafficData,
  HOURS, DAYS, heatValue, heatmapData, forecastData,
  sleeperSeed, campaignSeed, tiersSeed, challengeSeed, rewardsCatalog, activitySeed,
  Logomark, PoweredByPerch, TierBadge, Button, SegmentedToggle,
  CountdownRing, PhoneFrame, Card, StatCard, pseudoQRGrid, VerifyCode,
};
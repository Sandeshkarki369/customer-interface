import AddCustomerForm from './AddCustomerForm';
import React, { useState, useEffect } from "react";
import CustomerApp from "./loyalty-dashboard";
import { supabase } from "./supabase"; 

export default function PerchApp() {
  const [brand] = useState({
    name: "By Perch",
    primary: "#C15A2C",
    secondary: "#4B5D3A",
    poweredBy: true,
  });

  // Silently test the connection in the background
  useEffect(() => {
    async function fetchTestMessage() {
      const { data, error } = await supabase.from('test').select('*').single()
      
      if (error) {
        console.error("Supabase Error:", error)
      } else {
        console.log("✅ Supabase Connected! Database says:", data.message)
      }
    }

    fetchTestMessage()
  }, [])

  return (
    <div className="min-h-screen w-full" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#F3EEE3" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

        .font-display { font-family: 'Fraunces', serif; font-weight: 600; letter-spacing: -0.015em; }
        .font-mono-data { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }
        .font-body { font-family: 'Inter', sans-serif; }

        input[type="color"] { padding: 0; cursor: pointer; }

        .shadow-soft { box-shadow: 0 1px 2px rgba(28,25,23,0.04), 0 10px 24px -10px rgba(28,25,23,0.10); }
        .shadow-soft-lg { box-shadow: 0 2px 6px rgba(28,25,23,0.05), 0 24px 48px -16px rgba(28,25,23,0.16); }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }

        .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out both; }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }

        .scroll-thin::-webkit-scrollbar { height: 6px; width: 6px; }
        .scroll-thin::-webkit-scrollbar-thumb { background: rgba(28,25,23,0.14); border-radius: 999px; }
        .scroll-thin::-webkit-scrollbar-track { background: transparent; }

        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
          outline: 2px solid rgba(28,25,23,0.35);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Directly renders the loyalty dashboard alone */}
      <CustomerApp brand={brand} />
    </div>
  );
}
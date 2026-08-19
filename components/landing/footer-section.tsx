"use client";

import { useEffect, useState } from "react";

const LINKS = {
  PLATFORM: [
    { name: "Agents",          href: "#features" },
    { name: "Orchestration",   href: "#how-it-works" },
    { name: "Infrastructure",  href: "#infrastructure" },
    { name: "Integrations",    href: "#integrations" },
    { name: "Security",        href: "#security" },
  ],
  DEVELOPERS: [
    { name: "Documentation",   href: "#developers" },
    { name: "API Reference",   href: "#" },
    { name: "SDK",             href: "#developers" },
    { name: "Status",          href: "#" },
    { name: "Changelog",       href: "#" },
  ],
  COMPANY: [
    { name: "About",           href: "#" },
    { name: "Blog",            href: "#" },
    { name: "Careers",         href: "#", badge: "HIRING" },
    { name: "Contact",         href: "#" },
  ],
  LEGAL: [
    { name: "Privacy",         href: "#" },
    { name: "Terms",           href: "#" },
    { name: "Security",        href: "#security" },
  ],
};

export function FooterSection() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative border-t border-[#1e1e1e]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Top row — brand + tagline */}
        <div className="border-b border-[#1e1e1e] py-12 grid lg:grid-cols-[1fr_2fr] gap-10">
          <div>
            {/* Logo */}
            <a href="#" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-8 h-8 border border-[#2196f3] flex items-center justify-center relative">
                <div className="w-2.5 h-2.5 bg-[#2196f3]" />
                <div className="absolute inset-0 bg-[#2196f3]/10 group-hover:bg-[#2196f3]/20 transition-colors" />
              </div>
              <span className="font-display text-2xl tracking-[0.12em] text-[#f2ede6]">JARVIS</span>
            </a>
            <p className="text-sm text-[#3a3a3a] leading-relaxed max-w-xs font-mono">
              The platform to build, orchestrate, and scale autonomous AI agents in production.
            </p>
            <div className="flex gap-5 mt-6">
              {["TWITTER", "GITHUB", "DISCORD"].map(s => (
                <a key={s} href="#" className="font-mono text-[10px] tracking-widest text-[#3a3a3a] hover:text-[#2196f3] transition-colors">
                  {s} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(LINKS).map(([section, links]) => (
              <div key={section}>
                <h3 className="font-mono text-[9px] tracking-[0.2em] text-[#2196f3] mb-5">{section}</h3>
                <ul className="space-y-3">
                  {links.map(l => (
                    <li key={l.name}>
                      <a href={l.href} className="font-mono text-[11px] text-[#3a3a3a] hover:text-[#f2ede6] transition-colors inline-flex items-center gap-2">
                        {l.name}
                        {"badge" in l && l.badge && (
                          <span className="text-[9px] border border-[#2196f3]/30 text-[#2196f3] px-1.5 py-0.5 tracking-wider">
                            {l.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-[#3a3a3a]">
            © 2025 JARVIS SYSTEMS INC. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] text-[#3a3a3a] tabular-nums">{time} UTC</span>
            <div className="flex items-center gap-2">
              <span className="status-pulse w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
              <span className="font-mono text-[10px] text-[#22c55e] tracking-widest">ALL_SYSTEMS_OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

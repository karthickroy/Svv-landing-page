"use client";

import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    id: "01",
    tag: "ORCHESTRATION",
    title: "MULTI-AGENT\nSWARMS",
    desc: "Deploy fleets of specialized agents that collaborate, delegate, and self-coordinate. JARVIS manages task graphs, resolves dependencies, and routes work to the right agent — automatically.",
    stat: { v: "10K+", l: "concurrent agents" },
  },
  {
    id: "02",
    tag: "COGNITION",
    title: "LONG-HORIZON\nREASONING",
    desc: "Persistent memory, reflective loops, multi-step planning. Not one-shot completions — agents that hold context across hours, days, and complex workflows without losing the thread.",
    stat: { v: "∞", l: "context retention" },
  },
  {
    id: "03",
    tag: "EXECUTION",
    title: "TOOL &\nAPI LAYER",
    desc: "Give your agents hands. Browse the web, call APIs, write and run code, query databases, trigger stack actions — all with built-in retries, rate limiting, and full audit logging.",
    stat: { v: "200+", l: "native tool integrations" },
  },
  {
    id: "04",
    tag: "SECURITY",
    title: "ZERO-TRUST\nSANDBOX",
    desc: "Every agent action is sandboxed, policy-controlled, and cryptographically audited. Define permission scopes, SOC 2 Type II, end-to-end encryption. Enterprise-grade from day one.",
    stat: { v: "SOC2", l: "type II certified" },
  },
];

function FeatureRow({ f, index }: { f: typeof FEATURES[0]; index: number }) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group border-b border-[#1e1e1e] transition-all duration-500 row-hover ${
        vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="grid grid-cols-[56px_1fr] lg:grid-cols-[56px_260px_1fr_160px] gap-0">
        {/* Number col */}
        <div className="border-r border-[#1e1e1e] p-5 flex items-start pt-6">
          <span className="font-mono text-[10px] text-[#3a3a3a] tracking-widest">{f.id}</span>
        </div>

        {/* Tag + Title */}
        <div className="border-r border-[#1e1e1e] p-6 flex flex-col gap-3">
          <span className="sys-tag text-[9px]">{f.tag}</span>
          <h3 className="font-display text-3xl lg:text-4xl leading-[0.9] text-[#f2ede6] group-hover:text-[#2196f3] transition-colors duration-300 whitespace-pre-line">
            {f.title}
          </h3>
        </div>

        {/* Description */}
        <div className="col-span-2 lg:col-span-1 border-r border-[#1e1e1e] p-6 flex items-center">
          <p className="text-sm text-[#5a5a5a] leading-relaxed max-w-lg">{f.desc}</p>
        </div>

        {/* Stat */}
        <div className="hidden lg:flex flex-col items-end justify-center p-6">
          <div className="font-display text-4xl text-[#2196f3]">{f.stat.v}</div>
          <div className="font-mono text-[9px] text-[#3a3a3a] tracking-widest mt-1 text-right">{f.stat.l}</div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="features" className="relative border-t border-[#1e1e1e] scroll-mt-[88px]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section header row */}
        <div
          ref={ref}
          className={`grid grid-cols-[56px_1fr] lg:grid-cols-[56px_260px_1fr_160px] border-b border-[#1e1e1e] transition-all duration-500 ${
            vis ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="border-r border-[#1e1e1e] p-5" />
          <div className="col-span-2 lg:col-span-3 p-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <span className="sys-tag mb-4 block">CAPABILITIES</span>
              <h2 className="font-display text-6xl lg:text-8xl text-[#f2ede6] leading-[0.88] tracking-tight">
                WHAT JARVIS<br />
                <span className="text-[#3a3a3a]" style={{ WebkitTextStroke: "1px #3a3a3a", color: "transparent" }}>
                  CAN DO
                </span>
              </h2>
            </div>
            <p className="font-mono text-[10px] text-[#3a3a3a] tracking-widest max-w-[200px] text-right hidden lg:block">
              FOUR CORE MODULES &nbsp;/ &nbsp;ENTERPRISE-GRADE &nbsp;/ &nbsp;PRODUCTION-READY
            </p>
          </div>
        </div>

        {/* Feature rows */}
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.id} f={f} index={i} />
        ))}

        {/* CTA row */}
        <div className="grid grid-cols-[56px_1fr] border-b border-[#1e1e1e]">
          <div className="border-r border-[#1e1e1e]" />
          <div className="p-6 flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#3a3a3a]">VIEW ALL CAPABILITIES IN DOCS →</span>
            <a href="#" className="font-mono text-xs text-[#2196f3] hover:underline tracking-wider">EXPLORE SDK</a>
          </div>
        </div>
      </div>
    </section>
  );
}

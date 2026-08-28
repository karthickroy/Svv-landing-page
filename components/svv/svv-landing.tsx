"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion"
import Lenis from "lenis"
import { ArrowDown, ArrowUpRight, Camera, Facebook, Instagram, Mail, MapPin, Menu, Phone, QrCode, Sparkles, X } from "lucide-react"
import { GallerySection } from "@/components/gallery/gallery-section"
import { MembersTeaserSection } from "@/components/landing/members-teaser-section"
import Link from "next/link"

import { NoticeModal } from "@/components/landing/notice-modal"

// Gallery data is now fetched dynamically from MongoDB via /api/gallery
// Use the Admin Dashboard at /admin to upload images and videos

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, margin: "-80px" })
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 28 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: .8, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}

function SmoothScroll({ isNoticeOpen }: { isNoticeOpen: boolean }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ lerp: .08 })
    lenisRef.current = lenis
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (lenisRef.current) {
      if (isNoticeOpen) {
        lenisRef.current.stop()
      } else {
        lenisRef.current.start()
      }
    }
  }, [isNoticeOpen])

  return null
}

function Navigation({ onOpenNotice }: { onOpenNotice: () => void }) {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll) }, [])
  const links = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Gallery", href: "#gallery" },
    { name: "Members", href: "/members" },
    { name: "Journey", href: "#journey" },
    { name: "Contact", href: "#contact" },
  ]
  return <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`fixed top-0 z-50 w-full border-b transition-colors duration-500 ${scrolled ? "border-gold/20 bg-brown/90 backdrop-blur-xl" : "border-transparent"}`}>
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10" aria-label="Main navigation">
      <a href="#home" className="flex items-center gap-3 font-display text-2xl tracking-[.18em] text-cream group">
        <img src="/svv-logo.png" alt="SVV Logo" className="h-9 w-9 rounded-full border border-gold/40 object-cover p-0.5 bg-cream/10 transition-transform group-hover:scale-105" />
        <span>SVV<span className="text-gold">.</span></span>
      </a>
      <div className="hidden items-center gap-6 md:flex">
        {links.map((link) => (
          link.href.startsWith("/") ? (
            <Link key={link.name} href={link.href} className="group relative font-mono text-[10px] uppercase tracking-[.2em] text-gold font-bold transition-colors hover:text-cream">
              {link.name}<span className="absolute -bottom-2 left-0 h-px w-full bg-gold" />
            </Link>
          ) : (
            <a key={link.name} href={link.href} className="group relative font-mono text-[10px] uppercase tracking-[.2em] text-beige/70 transition-colors hover:text-gold">
              {link.name}<span className="absolute -bottom-2 left-0 h-px w-0 bg-gold transition-all group-hover:w-full" />
            </a>
          )
        ))}
        <button
          type="button"
          onClick={onOpenNotice}
          className="cursor-pointer flex items-center gap-1.5 rounded border border-gold/60 bg-gold/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.18em] text-gold font-bold transition-all hover:bg-gold hover:text-brown shadow-sm hover:scale-105"
        >
          <Sparkles size={12} className="animate-pulse text-gold cursor-pointer" />
          <span>SVV 2026 Notice</span>
        </button>
      </div>
      <button onClick={() => setOpen(!open)} className="text-cream md:hidden" aria-label={open ? "Close menu" : "Open menu"}>{open ? <X size={22} /> : <Menu size={22} />}</button>
    </nav>
    {open && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-gold/15 bg-brown px-6 py-5 md:hidden space-y-2">
      {links.map(link => (
        link.href.startsWith("/") ? (
          <Link onClick={() => setOpen(false)} key={link.name} href={link.href} className="block border-b border-gold/10 py-3 font-mono text-xs uppercase tracking-[.2em] text-gold font-bold">{link.name}</Link>
        ) : (
          <a onClick={() => setOpen(false)} key={link.name} href={link.href} className="block border-b border-gold/10 py-3 font-mono text-xs uppercase tracking-[.2em] text-beige">{link.name}</a>
        )
      ))}
      <button
        type="button"
        onClick={() => { setOpen(false); onOpenNotice(); }}
        className="w-full flex items-center justify-center gap-2 rounded border border-gold bg-gold/20 py-3 font-mono text-xs uppercase tracking-[.2em] text-gold font-bold hover:bg-gold hover:text-brown"
      >
        <Sparkles size={14} /> SVV 2026 Notice
      </button>
    </motion.div>}
  </motion.header>
}

function Hero({ onOpenNotice }: { onOpenNotice: () => void }) {
  const { scrollY } = useScroll(); const y = useTransform(scrollY, [0, 800], [0, 180]); const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  return <section id="home" className="relative flex min-h-screen items-end overflow-hidden bg-brown pb-20 pt-32 lg:pb-28">
    <motion.img style={{ y }} src="/svv-vinayagar.png" alt="Lord Vinayagar idol during celebration" className="absolute inset-0 h-full w-full object-cover object-center opacity-55" />
    <div className="hero-wash absolute inset-0" /><div className="pattern absolute inset-0 opacity-30" />
    <motion.div style={{ opacity }} className="relative mx-auto w-full max-w-7xl px-6 lg:px-10">
      <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.28em] text-gold"><span className="h-px w-10 bg-gold" /> A living tradition since 1999</div>
      <h1 className="max-w-5xl font-display text-[clamp(4rem,11vw,10rem)] font-bold uppercase leading-[.8] tracking-[-.04em] text-cream">Sree Veera<br /><span className="ml-[8vw] text-gold">Vigneshwar</span></h1>
      <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.32em] text-beige/80">27 years of blessings</p>
          <p className="mt-3 max-w-sm text-pretty text-lg leading-relaxed text-cream/75">Celebrating faith, tradition &amp; togetherness.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onOpenNotice}
            className="cursor-pointer group flex w-fit items-center gap-3 border border-gold bg-gold px-6 py-4 font-mono text-[10px] uppercase tracking-[.2em] text-brown font-bold transition-transform hover:-translate-y-1 shadow-lg"
          >
            <span>SVV 2026 Notice</span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
          <a href="#gallery" className="group flex w-fit items-center gap-4 border border-gold/70 px-6 py-4 font-mono text-[10px] uppercase tracking-[.2em] text-cream transition-colors hover:bg-gold/20 hover:border-gold">
            Explore gallery <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
      <div className="mt-16 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.2em] text-beige/50"><ArrowDown size={13} className="animate-bounce" /> Scroll to remember</div>
    </motion.div>
  </section>
}

function About() { return <section id="about" className="section-shell bg-cream text-brown"><div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-10"><Reveal className="relative"><div className="absolute -bottom-4 -right-4 h-full w-full border border-gold/60" /><img src="/svv-vinayagar.png" alt="A devotional celebration gathering" className="relative aspect-[4/5] w-full object-cover grayscale-[20%]" /></Reveal><Reveal delay={.15}><p className="eyebrow text-gold-dark">Our story</p><h2 className="mt-5 max-w-xl font-display text-5xl uppercase leading-[.92] tracking-tight lg:text-7xl">27 years of faith, tradition &amp; memories</h2><div className="my-8 h-px w-20 bg-gold" /><p className="max-w-lg text-lg leading-relaxed text-brown/70">Sree Veera Vigneshwar has been a place where devotion becomes memory. For 27 years, our Vinayagar Chathurthi celebrations have brought families, friends and generations together in faith, joy and togetherness.</p><div className="mt-10 flex items-center gap-4"><span className="font-display text-5xl text-gold-dark">27+</span><span className="font-mono text-[10px] uppercase leading-loose tracking-[.2em] text-brown/60">Years of<br />blessings</span></div></Reveal></div></section> }

function Services() { const items = [{ icon: Sparkles, title: "Celebrations", text: "Annual Vinayagar Chathurthi celebrations filled with devotion, happiness and togetherness." }, { icon: Camera, title: "Memories", text: "Preserving beautiful moments and unforgettable memories from our celebrations." }, { icon: "ॐ", title: "Pooja & Traditions", text: "Keeping our spiritual traditions and cultural values alive through every celebration." }]; return <section id="services" className="section-shell bg-brown text-cream"><div className="mx-auto max-w-7xl px-6 lg:px-10"><Reveal><p className="eyebrow text-gold">Services</p><h2 className="mt-5 max-w-2xl font-display text-5xl uppercase leading-[.92] tracking-tight lg:text-7xl">Celebrating tradition through every moment</h2></Reveal><div className="mt-16 grid gap-px border border-gold/20 bg-gold/20 md:grid-cols-3">{items.map(({ icon: Icon, title, text }, i) => <Reveal key={title} delay={i * .1} className="h-full"><article className="group h-full bg-brown p-8 transition-colors hover:bg-brown-light lg:p-10"><div className="mb-16 flex h-12 w-12 items-center justify-center border border-gold/50 text-gold transition-transform group-hover:-translate-y-1">{typeof Icon === "string" ? <span className="font-serif text-2xl">{Icon}</span> : <Icon size={22} />}</div><h3 className="font-display text-3xl uppercase text-cream">{title}</h3><p className="mt-4 leading-relaxed text-beige/65">{text}</p></article></Reveal>)}</div></div></section> }


function Journey() { const ref = useRef(null); const inView = useInView(ref, { once: true }); return <section id="journey" ref={ref} className="section-shell bg-gold text-brown"><div className="mx-auto max-w-7xl px-6 text-center lg:px-10"><Reveal><p className="eyebrow text-brown/60">Our journey</p><motion.div initial={{ scale: .8, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 1 }} className="mt-6 font-display text-[clamp(7rem,22vw,19rem)] font-bold leading-[.7] tracking-[-.08em]">27<span className="text-[.45em]">+</span></motion.div><p className="mt-12 font-mono text-xs uppercase tracking-[.35em] text-brown/70">Faith <span className="mx-2">•</span> Celebration <span className="mx-2">•</span> Togetherness</p><p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-brown/70">From the early celebrations to the present day, every year has added another chapter to a story held together by devotion and love.</p></Reveal></div></section> }

function Contact() {
  const [isOpen, setIsOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)

  return <section id="contact" className="relative overflow-hidden bg-brown text-cream"><div className="contact-image absolute inset-0 opacity-20" /><div className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40"><Reveal><p className="eyebrow text-gold">Contact</p><h2 className="mt-5 max-w-3xl font-display text-6xl uppercase leading-[.88] lg:text-8xl">Feel free to<br /><span className="text-gold">support us?</span></h2><p className="mt-8 max-w-lg text-lg leading-relaxed text-beige/70">Help us continue our three-day Vinayagar Chathurthi celebrations, devotional programs and community events. If you would like to donate or support the celebration, please reach out to us.</p><button type="button" onClick={() => setIsOpen(true)} className="mt-10 inline-flex items-center gap-4 bg-gold px-7 py-5 font-mono text-[10px] uppercase tracking-[.2em] text-brown transition-transform hover:-translate-y-1">Get in touch <ArrowUpRight size={16} /></button></Reveal><div className="mt-24 grid gap-6 border-t border-gold/20 pt-8 text-sm text-beige/70 sm:grid-cols-2 lg:grid-cols-4"><span className="flex items-center gap-3"><MapPin size={16} className="text-gold" /> Pernambut, Tamil Nadu</span><a href="https://www.instagram.com/sree_veera_vighneshwar?igsi=YWwzMGhjMXZ3a203" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-gold"><Instagram size={16} className="text-gold" /> Svv Instagram</a><span className="flex items-center gap-3"><Phone size={16} className="text-gold" /> +91 6369873711</span><button type="button" onClick={() => setIsQrModalOpen(true)} className="flex items-center gap-3 transition-colors hover:text-gold text-left group cursor-pointer"><QrCode size={16} className="text-gold" /> <span>Scan QR</span> <img src="/qr-code.png" alt="QR Code" className="h-9 w-9 rounded bg-white p-0.5 border border-gold/40 object-contain transition-transform group-hover:scale-110" /></button></div></div>{isOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brown/80 px-5 py-8 backdrop-blur-sm" role="presentation" onClick={() => setIsOpen(false)}><div role="dialog" aria-modal="true" aria-labelledby="donation-title" className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto border border-gold/40 bg-cream p-7 text-brown shadow-2xl sm:p-10" onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => setIsOpen(false)} aria-label="Close contact details" className="absolute right-5 top-5 text-brown/60 transition-colors hover:text-gold-dark"><X size={22} /></button><p className="eyebrow text-gold-dark">Vinayagar Chathurthi</p><h3 id="donation-title" className="mt-4 pr-8 font-display text-4xl uppercase leading-[.92] sm:text-5xl">Three days of devotion &amp; celebration</h3><div className="my-6 h-px w-16 bg-gold" /><p className="text-base leading-relaxed text-brown/75">Every year, we come together for three meaningful days of Vinayagar Chathurthi with pooja, cultural programs, devotional activities and community events for families and friends.</p><p className="mt-4 text-base leading-relaxed text-brown/75">If you would like to support the celebrations or make a donation, kindly reach out to our coordinators or scan our QR code below:</p><div className="mt-6 flex flex-col items-center border border-gold/30 bg-gold/10 p-6 text-center rounded"><p className="font-mono text-xs uppercase tracking-[.15em] text-gold-dark font-bold mb-3">Scan QR Code to Support</p><img src="/qr-code.png" alt="Sree Veera Vigneshwar QR Code" className="h-72 w-72 max-w-full rounded-lg border-2 border-gold/40 bg-white p-3 shadow-lg object-contain" /></div><div className="mt-6 grid gap-3 border border-gold/30 bg-gold/10 p-5 font-mono text-xs uppercase tracking-[.12em]"><div className="flex items-center justify-between gap-4"><span className="text-brown/60">Dinesh</span><a href="tel:8144497802" className="inline-flex items-center gap-2 text-gold-dark hover:underline"><Phone size={14} aria-hidden="true" />8144497802<span className="sr-only"> Call Dinesh</span></a></div><div className="flex items-center justify-between gap-4"><span className="text-brown/60">Raga</span><a href="tel:8861958809" className="inline-flex items-center gap-2 text-gold-dark hover:underline"><Phone size={14} aria-hidden="true" />8861958809<span className="sr-only"> Call Raga</span></a></div></div><p className="mt-6 font-mono text-[10px] uppercase tracking-[.16em] text-brown/55">Thank you for helping us keep this tradition alive.</p></div></div>}{isQrModalOpen && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brown/85 px-5 py-8 backdrop-blur-sm" role="presentation" onClick={() => setIsQrModalOpen(false)}><div role="dialog" aria-modal="true" className="relative max-h-[90vh] w-full max-w-md border border-gold/40 bg-cream p-8 text-brown shadow-2xl text-center" onClick={(e) => e.stopPropagation()}><button type="button" onClick={() => setIsQrModalOpen(false)} aria-label="Close QR modal" className="absolute right-4 top-4 text-brown/60 hover:text-gold-dark"><X size={22} /></button><p className="eyebrow text-gold-dark">Scan to Support</p><h3 className="mt-2 font-display text-4xl uppercase">Sree Veera Vigneshwar</h3><div className="my-4 mx-auto h-px w-16 bg-gold" /><div className="mx-auto my-6 max-w-[340px] rounded-xl border-2 border-gold/40 bg-white p-4 shadow-xl"><img src="/qr-code.png" alt="Sree Veera Vigneshwar QR Code" className="w-full h-auto object-contain max-h-[60vh]" /></div><p className="mt-3 font-mono text-xs uppercase tracking-[.15em] text-brown/70 font-semibold">Scan with any UPI / Banking App</p></div></div>}</section>
}

function Footer() { return <footer className="border-t border-gold/15 bg-brown px-6 py-10 text-cream lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end"><div className="flex items-center gap-3.5"><img src="/svv-logo.png" alt="SVV Logo" className="h-11 w-11 rounded-full border border-gold/40 object-cover p-0.5 bg-cream/10" /><div><div className="font-display text-3xl tracking-[.18em]">SVV<span className="text-gold">.</span></div><p className="mt-1 font-mono text-[10px] uppercase tracking-[.18em] text-beige/55">Sree Veera Vigneshwar · 27 years of blessings</p></div></div><div className="flex items-center gap-5 text-beige/60"><a href="https://www.instagram.com/sree_veera_vighneshwar?igsi=YWwzMGhjMXZ3a203" target="_blank" rel="noopener noreferrer" aria-label="Svv Instagram" className="hover:text-gold"><Instagram size={18} /></a><a href="#home" aria-label="Facebook" className="hover:text-gold"><Facebook size={18} /></a><a href="#home" aria-label="Email" className="hover:text-gold"><Mail size={18} /></a></div></div><div className="mx-auto mt-10 flex max-w-7xl justify-between border-t border-gold/10 pt-5 font-mono text-[9px] uppercase tracking-[.15em] text-beige/40"><span>© 2026 Sree Veera Vigneshwar</span><span>Faith · Tradition · Togetherness</span></div></footer> }

export function SvvLanding() {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)

  return (
    <>
      <SmoothScroll isNoticeOpen={isNoticeOpen} />
      <Navigation onOpenNotice={() => setIsNoticeOpen(true)} />
      <main>
        <Hero onOpenNotice={() => setIsNoticeOpen(true)} />
        <About />
        <Services />
        <GallerySection />
        <MembersTeaserSection />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <NoticeModal isOpen={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} />
    </>
  )
}

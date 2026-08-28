"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Users,
  Award,
  Calendar,
  Sparkles,
  ArrowLeft,
  Grid,
  List,
  HeartHandshake,
  Loader2,
  X,
  MapPin,
  ChevronRight,
} from "lucide-react"
import { SvvMember, SVV_MEMBERS } from "@/lib/svv-members-data"
import Link from "next/link"

export function MembersScreen() {
  const [members, setMembers] = useState<SvvMember[]>(SVV_MEMBERS)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMember, setSelectedMember] = useState<SvvMember | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Fetch members dynamically from MongoDB database in exact order
  useEffect(() => {
    async function loadMembersFromDb() {
      try {
        const res = await fetch("/api/members")
        const data = await res.json()
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMembers(
            data.data.map((m: any, idx: number) => ({
              id: m._id || `mem-${idx}`,
              name: m.name,
              role: m.role || "SVV Group Member",
              category: m.category || "SVV Group Member",
              joinedYear: m.joinedYear || 1999,
              badge: m.badge || "",
              avatarColor: m.avatarColor || "from-amber-600 to-yellow-500",
              order: m.order ?? idx,
            }))
          )
        }
      } catch (err) {
        console.error("Failed to load members from MongoDB:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadMembersFromDb()
  }, [])

  // Filter members based on search query without altering original sequence
  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [members, searchQuery])

  return (
    <div className="min-h-screen bg-brown text-cream selection:bg-gold selection:text-brown font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-gold/20 bg-brown/90 backdrop-blur-xl transition-colors">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <img src="/svv-logo.png" alt="SVV Logo" className="h-9 w-9 rounded-full border border-gold/40 object-cover p-0.5 bg-cream/10 transition-transform group-hover:scale-105" />
            <span className="font-display text-2xl tracking-[.18em] text-cream transition-colors group-hover:text-gold">
              SVV<span className="text-gold">.</span>
            </span>
            <span className="hidden sm:inline-block rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-gold">
              Group Members
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-[.18em] text-beige/80 transition-colors hover:text-gold"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gold/15 bg-brown-light/40 py-16 lg:py-24">
        <div className="pattern absolute inset-0 opacity-25 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.28em] text-gold">
              <span className="h-px w-10 bg-gold" /> Sree Veera Vigneshwar Group
            </div>
            <h1 className="font-display text-5xl font-bold uppercase leading-[.9] tracking-tight text-cream sm:text-7xl lg:text-8xl">
              SVV Group <br />
              <span className="text-gold">Members</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-beige/80">
              Honorary directory of our SVV Group Members celebrating 27 years of devotion, unity, and togetherness in Pernambut since 1999.
            </p>
          </motion.div>

          {/* Quick Statistics Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6"
          >
            <div className="border border-gold/25 bg-brown/80 p-5 backdrop-blur-sm transition-all hover:border-gold/50">
              <div className="flex items-center gap-3 text-gold">
                <Users size={20} />
                <span className="font-mono text-xs uppercase tracking-widest text-beige/60">
                  Total Members
                </span>
              </div>
              <p className="mt-3 font-display text-4xl font-bold text-cream">
                {members.length}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-beige/60">
                SVV Group Members
              </p>
            </div>

            <div className="border border-gold/25 bg-brown/80 p-5 backdrop-blur-sm transition-all hover:border-gold/50">
              <div className="flex items-center gap-3 text-gold">
                <Calendar size={20} />
                <span className="font-mono text-xs uppercase tracking-widest text-beige/60">
                  Member Since
                </span>
              </div>
              <p className="mt-3 font-display text-4xl font-bold text-cream">
                1999
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-beige/60">
                Living Tradition
              </p>
            </div>

            <div className="border border-gold/25 bg-brown/80 p-5 backdrop-blur-sm transition-all hover:border-gold/50">
              <div className="flex items-center gap-3 text-gold">
                <HeartHandshake size={20} />
                <span className="font-mono text-xs uppercase tracking-widest text-beige/60">
                  Legacy
                </span>
              </div>
              <p className="mt-3 font-display text-4xl font-bold text-cream">
                27+
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-beige/60">
                Years of Blessings
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* Controls: Search Bar & View Toggle */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-gold/15 pb-8">
          {/* Search Box */}
          <div className="relative w-full md:w-80 lg:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/70"
            />
            <input
              type="text"
              placeholder="Search member name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gold/30 bg-brown-light/60 py-3.5 pl-11 pr-10 text-sm text-cream placeholder-beige/40 outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-beige/50 hover:text-gold"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* View Mode Toggle & Result Count */}
          <div className="flex items-center justify-between gap-4 md:justify-end">
            <span className="font-mono text-xs uppercase tracking-widest text-beige/60">
              Showing{" "}
              <strong className="text-gold font-bold">
                {filteredMembers.length}
              </strong>{" "}
              of {members.length} members
            </span>

            <div className="flex items-center border border-gold/30 bg-brown-light/60 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-gold text-brown font-bold"
                    : "text-beige/70 hover:text-gold"
                }`}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-gold text-brown font-bold"
                    : "text-beige/70 hover:text-gold"
                }`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="my-20 text-center">
            <Loader2 size={32} className="animate-spin text-gold mx-auto" />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-beige/60">
              Loading SVV Group Members from database...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMembers.length === 0 && (
          <div className="my-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center border border-gold/30 text-gold">
              <Users size={32} />
            </div>
            <h3 className="mt-4 font-display text-2xl uppercase text-cream">
              No members found
            </h3>
            <p className="mt-2 text-sm text-beige/60">
              No member matches your search "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-6 border border-gold px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-brown transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Grid View */}
        {!isLoading && viewMode === "grid" && filteredMembers.length > 0 && (
          <motion.div
            layout
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredMembers.map((member, index) => {
                const initials = member.name
                  .trim()
                  .split(/\s+/)
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()

                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: index * 0.01 }}
                    onClick={() => setSelectedMember(member)}
                    className="group relative cursor-pointer border border-gold/20 bg-brown-light/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-brown-light/90 hover:shadow-xl"
                  >
                    {/* Top Badge */}
                    <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                        <Sparkles size={11} /> SVV Group Member
                      </span>
                    </div>

                    {/* Member Profile Avatar & Name */}
                    <div className="mt-5 flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center border-2 border-gold/40 bg-gradient-to-br ${member.avatarColor} font-display text-xl font-bold text-cream shadow-md group-hover:border-gold group-hover:scale-105 transition-all`}
                      >
                        {initials}
                      </div>

                      <div className="overflow-hidden">
                        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-cream group-hover:text-gold transition-colors">
                          {member.name}
                        </h3>
                        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-beige/70">
                          SVV Group Member
                        </p>
                      </div>
                    </div>

                    {/* Footer Pill */}
                    <div className="mt-6 border-t border-gold/10 pt-4 flex items-center justify-end">
                      <span className="flex items-center gap-0.5 text-gold text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        View Profile <ChevronRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* List View */}
        {!isLoading && viewMode === "list" && filteredMembers.length > 0 && (
          <div className="mt-8 border border-gold/20 divide-y divide-gold/15 bg-brown-light/40">
            {filteredMembers.map((member) => {
              const initials = member.name
                .trim()
                .split(/\s+/)
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase()

              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="group flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-brown-light transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center border border-gold/40 bg-gradient-to-br ${member.avatarColor} font-display text-base font-bold text-cream`}
                    >
                      {initials}
                    </div>

                    <div>
                      <h3 className="font-display text-xl uppercase tracking-wide text-cream group-hover:text-gold transition-colors">
                        {member.name}
                      </h3>
                      <p className="font-mono text-xs text-beige/70">
                        SVV Group Member
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-xs">
                    <ChevronRight size={16} className="text-gold" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Member Quick Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown/85 p-4 backdrop-blur-md"
            role="presentation"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden border border-gold/40 bg-brown p-8 text-cream shadow-2xl"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="absolute right-5 top-5 text-beige/60 hover:text-gold transition-colors"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>

              {/* Eyebrow */}
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-gold">
                <Sparkles size={14} /> SVV Member Profile
              </div>

              {/* Header Info */}
              <div className="mt-6 flex items-center gap-5 border-b border-gold/20 pb-6">
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center border-2 border-gold bg-gradient-to-br ${selectedMember.avatarColor} font-display text-3xl font-bold text-cream shadow-xl`}
                >
                  {selectedMember.name
                    .trim()
                    .split(/\s+/)
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                <div>
                  <h2 className="font-display text-3xl uppercase tracking-tight text-cream">
                    {selectedMember.name}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-gold font-bold">
                    SVV Group Member
                  </p>

                  {selectedMember.badge ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
                        {selectedMember.badge}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Details Body */}
              <div className="mt-6 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <span className="text-beige/60 uppercase tracking-widest text-[10px]">
                    Affiliation
                  </span>
                  <span className="text-cream font-bold">
                    Sree Veera Vigneshwar Group
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                  <span className="text-beige/60 uppercase tracking-widest text-[10px]">
                    Location
                  </span>
                  <span className="text-cream flex items-center gap-1 font-semibold">
                    <MapPin size={13} className="text-gold" /> Pernambut, Tamil Nadu
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2">
                  <span className="text-beige/60 uppercase tracking-widest text-[10px]">
                    Legacy
                  </span>
                  <span className="text-gold font-bold">
                    27 Years of Faith &amp; Blessings
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex justify-end border-t border-gold/20 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="border border-gold bg-gold px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-brown font-bold hover:bg-gold-dark hover:text-cream transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 border-t border-gold/15 bg-brown px-6 py-10 text-cream lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="flex items-center gap-3.5">
            <img src="/svv-logo.png" alt="SVV Logo" className="h-11 w-11 rounded-full border border-gold/40 object-cover p-0.5 bg-cream/10" />
            <div>
              <div className="font-display text-3xl tracking-[.18em]">
                SVV<span className="text-gold">.</span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.18em] text-beige/55">
                Sree Veera Vigneshwar · {members.length} Members · 27 Years of Blessings (Since 1999)
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-gold hover:underline"
          >
            ← Return to SVV Landing Page
          </Link>
        </div>
      </footer>
    </div>
  )
}

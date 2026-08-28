"use client"

import { useState } from "react"
import { SVV_MEMBERS, SvvMember } from "@/lib/svv-members-data"
import { ArrowUpRight, Users, Award, Sparkles, X, MapPin, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function MembersTeaserSection() {
  const router = useRouter()
  const [selectedMember, setSelectedMember] = useState<SvvMember | null>(null)

  // Select top 6 featured members in exact order shared by user
  const featuredMembers = SVV_MEMBERS.slice(0, 6)

  const handleNavigateToMembers = () => {
    setSelectedMember(null)
    router.push("/members")
  }

  return (
    <section id="members" className="section-shell bg-brown text-cream border-t border-gold/15">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-gold">SVV Group Members</p>
            <h2 className="mt-4 font-display text-5xl uppercase leading-[.9] tracking-tight lg:text-7xl">
              Meet Our <span className="text-gold">Group Members</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-beige/70">
              Dedicated members carrying forward 27 years of Vinayagar Chathurthi celebrations, faith, and togetherness in Pernambut since 1999.
            </p>
          </div>

          <Link
            href="/members"
            className="group flex w-fit items-center gap-3 border border-gold bg-gold/10 px-6 py-4 font-mono text-[10px] uppercase tracking-[.2em] text-cream transition-all hover:bg-gold hover:text-brown"
          >
            <span>View All {SVV_MEMBERS.length} Members</span>
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* Featured Members Grid Preview */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredMembers.map((member) => {
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
                className="group relative cursor-pointer border border-gold/20 bg-brown-light/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-brown-light/90 hover:shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gold flex items-center gap-1 font-bold">
                    <Sparkles size={11} /> SVV Group Member
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center border border-gold/40 bg-gradient-to-br ${member.avatarColor} font-display text-lg font-bold text-cream transition-transform group-hover:scale-105`}
                  >
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase text-cream group-hover:text-gold transition-colors">
                      {member.name}
                    </h3>
                    <p className="font-mono text-[11px] text-beige/70">
                      SVV Group Member
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end border-t border-gold/10 pt-3 font-mono text-[10px] uppercase text-gold">
                  <span className="flex items-center gap-0.5 text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    View Profile <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border border-gold/30 bg-gold/10 p-6 sm:flex-row sm:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center border border-gold text-gold">
              <Users size={24} />
            </div>
            <div>
              <h4 className="font-display text-2xl uppercase text-cream">
                {SVV_MEMBERS.length} SVV Group Members
              </h4>
              <p className="font-mono text-xs uppercase tracking-wider text-beige/70">
                Faith · Tradition · Togetherness (Since 1999)
              </p>
            </div>
          </div>

          <Link
            href="/members"
            className="w-full text-center border border-gold bg-gold px-8 py-3.5 font-mono text-xs uppercase tracking-widest text-brown font-bold hover:bg-gold-dark hover:text-cream transition-colors sm:w-auto"
          >
            Explore Full Member Directory →
          </Link>
        </div>
      </div>

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
              <div className="mt-8 flex flex-col gap-3 sm:flex-row border-t border-gold/20 pt-5">
                <button
                  type="button"
                  onClick={handleNavigateToMembers}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-gold bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-brown font-bold hover:bg-gold-dark hover:text-cream transition-colors"
                >
                  <span>Explore SVV Members Page</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

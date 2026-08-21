import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  suffix?: string
}

export function StatCard({ label, value, icon: Icon, suffix }: StatCardProps) {
  return (
    <div className="group border border-gold/20 bg-brown-light p-6 transition-colors hover:border-gold/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[.22em] text-beige/50">{label}</p>
          <p className="mt-3 font-display text-4xl font-bold text-cream">
            {value}
            {suffix && <span className="ml-1 text-xl text-gold">{suffix}</span>}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-gold/30 text-gold/70 transition-colors group-hover:border-gold group-hover:text-gold">
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

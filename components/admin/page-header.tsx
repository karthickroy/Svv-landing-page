interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="border-b border-gold/15 bg-brown px-6 py-8 lg:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[.28em] text-gold">
            SVV Admin
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-tight text-cream lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-beige/60">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}

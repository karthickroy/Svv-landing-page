interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="border-b border-gold/15 bg-brown px-4 py-6 pl-16 sm:px-6 sm:py-8 lg:px-10 lg:pl-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] uppercase tracking-[.28em] text-gold">
            SVV Admin
          </p>
          <h1 className="mt-1.5 font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-cream break-words">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-beige/60">{description}</p>
          )}
        </div>
        {action && <div className="w-full sm:w-auto shrink-0">{action}</div>}
      </div>
    </div>
  )
}

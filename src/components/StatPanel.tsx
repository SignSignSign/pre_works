import { CheckCircle2, Clock3, ListTodo, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatPanelProps {
  total: number
  completed: number
  active: number
}

interface StatCard {
  label: string
  value: string
  icon: LucideIcon
  iconClass: string
}

const cardClass =
  'rounded-xl border border-line/70 bg-paper-soft/70 p-4 shadow-[0_1px_2px_rgba(90,74,52,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line hover:shadow-[0_6px_20px_rgba(90,74,52,0.08)] sm:p-5'

export default function StatPanel({ total, completed, active }: StatPanelProps) {
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100)

  const cards: StatCard[] = [
    { label: '总任务', value: String(total), icon: ListTodo, iconClass: 'bg-ink/5 text-ink-soft' },
    { label: '进行中', value: String(active), icon: Clock3, iconClass: 'bg-ochre/10 text-ochre' },
    {
      label: '已完成',
      value: String(completed),
      icon: CheckCircle2,
      iconClass: 'bg-celadon/10 text-celadon',
    },
  ]

  return (
    <section aria-label="任务统计" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, iconClass }) => (
        <div key={label} className={cardClass}>
          <div className={`grid size-9 place-items-center rounded-lg ${iconClass}`}>
            <Icon className="size-4.5" />
          </div>
          <p className="mt-3 text-xs tracking-[0.18em] text-ink-faint">{label}</p>
          <p className="mt-1 text-2xl font-medium text-ink tabular-nums">{value}</p>
        </div>
      ))}

      <div className={cardClass}>
        <div className="grid size-9 place-items-center rounded-lg bg-cinnabar/10 text-cinnabar">
          <TrendingUp className="size-4.5" />
        </div>
        <p className="mt-3 text-xs tracking-[0.18em] text-ink-faint">完成率</p>
        <p className="mt-1 text-2xl font-medium text-ink tabular-nums">{rate}%</p>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line-soft">
          <div
            className="h-full rounded-full bg-gradient-to-r from-celadon/60 to-celadon transition-[width] duration-500 ease-out"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>
    </section>
  )
}

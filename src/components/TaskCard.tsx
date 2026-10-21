import { CalendarDays, Check, Pencil, Tag, Trash2 } from 'lucide-react'
import { differenceInCalendarDays, format, isValid, parseISO, startOfDay } from 'date-fns'
import { useTaskStore } from '../store/taskStore'
import { PRIORITY_META, type Priority, type Task } from '../types/task'

const PRIORITY_BADGE: Record<Priority, string> = {
  high: 'bg-cinnabar/8 text-cinnabar ring-cinnabar/25',
  medium: 'bg-ochre/8 text-ochre ring-ochre/25',
  low: 'bg-celadon/8 text-celadon ring-celadon/25',
}

const PRIORITY_ACCENT: Record<Priority, string> = {
  high: 'bg-cinnabar/75',
  medium: 'bg-ochre/75',
  low: 'bg-celadon/75',
}

type DueTone = 'normal' | 'soon' | 'today' | 'overdue' | 'muted'

const DUE_TONE: Record<DueTone, string> = {
  normal: 'text-ink-faint',
  soon: 'text-celadon',
  today: 'text-ochre',
  overdue: 'text-cinnabar',
  muted: 'text-ink-faint/70',
}

function getDueInfo(dueDate: string, completed: boolean): { text: string; tone: DueTone } {
  const due = parseISO(dueDate)
  if (!isValid(due)) return { text: '未设置截止日期', tone: 'muted' }

  const diff = differenceInCalendarDays(due, startOfDay(new Date()))
  const label = format(due, 'M月d日')

  if (completed) return { text: `截止 ${label}`, tone: 'muted' }
  if (diff < 0) return { text: `已逾期 ${Math.abs(diff)} 天`, tone: 'overdue' }
  if (diff === 0) return { text: '今天截止', tone: 'today' }
  if (diff === 1) return { text: '明天截止', tone: 'soon' }
  return { text: `${label} 截止`, tone: 'normal' }
}

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
}

export default function TaskCard({ task, index, onEdit }: TaskCardProps) {
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const due = getDueInfo(task.dueDate, task.completed)

  return (
    <article
      className={`group relative animate-rise-in overflow-hidden rounded-xl border border-line/70 bg-paper-soft/75 p-4 pl-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line hover:bg-paper-soft hover:shadow-[0_8px_24px_rgba(90,74,52,0.09)] sm:p-5 sm:pl-6 ${task.completed ? 'bg-paper-soft/45 opacity-75' : ''
        }`}
      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
    >
      <span
        aria-hidden="true"
        className={`absolute top-4 bottom-4 left-0 w-1 rounded-r-full ${PRIORITY_ACCENT[task.priority]}`}
      />

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          aria-label={
            task.completed ? `将「${task.title}」标记为进行中` : `将「${task.title}」标记为已完成`
          }
          aria-pressed={task.completed}
          className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-all duration-200 ${task.completed
            ? 'border-celadon bg-celadon text-silk'
            : 'border-line text-transparent hover:border-celadon hover:bg-celadon/10'
            }`}
        >
          <Check className="size-3" strokeWidth={2.5} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3
              className={`text-[15px] break-words transition-colors duration-200 ${task.completed ? 'text-ink-faint line-through' : 'text-ink'
                }`}
            >
              {task.title}
            </h3>
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-[11px] tracking-wide ring-1 ring-inset ${PRIORITY_BADGE[task.priority]}`}
            >
              {PRIORITY_META[task.priority].label}优先级
            </span>
          </div>

          {task.description !== '' && (
            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed break-words text-ink-soft/90">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <span className={`flex items-center gap-1.5 ${DUE_TONE[due.tone]}`}>
              <CalendarDays className="size-3.5" />
              {due.text}
            </span>
            <span className="flex items-center gap-1.5 text-ink-faint">
              <Tag className="size-3.5" />
              {task.category}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`编辑「${task.title}」`}
            className="grid size-8 place-items-center rounded-lg text-ink-faint transition-colors duration-200 hover:bg-ink/5 hover:text-ink"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => deleteTask(task.id)}
            aria-label={`删除「${task.title}」`}
            className="grid size-8 place-items-center rounded-lg text-ink-faint transition-colors duration-200 hover:bg-cinnabar/8 hover:text-cinnabar"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

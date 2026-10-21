import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect } from 'react'
import { useFilterStore } from '../store/filterStore'
import type { Priority, TaskStatusFilter } from '../types/task'

const STATUS_OPTIONS: { value: TaskStatusFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '进行中' },
  { value: 'completed', label: '已完成' },
]

const PRIORITY_OPTIONS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: '全部优先级' },
  { value: 'high', label: '高优先级' },
  { value: 'medium', label: '中优先级' },
  { value: 'low', label: '低优先级' },
]

const selectClass =
  'w-full rounded-lg border border-line/80 bg-silk px-3 py-2 text-sm text-ink outline-none transition-colors duration-200 hover:border-line focus:border-celadon/60 focus:ring-2 focus:ring-celadon/15 sm:w-40'

interface FilterBarProps {
  categories: string[]
  counts: Record<TaskStatusFilter, number>
}

export default function FilterBar({ categories, counts }: FilterBarProps) {
  const status = useFilterStore((state) => state.status)
  const priority = useFilterStore((state) => state.priority)
  const category = useFilterStore((state) => state.category)
  const keyword = useFilterStore((state) => state.keyword)
  const setStatus = useFilterStore((state) => state.setStatus)
  const setPriority = useFilterStore((state) => state.setPriority)
  const setCategory = useFilterStore((state) => state.setCategory)
  const setKeyword = useFilterStore((state) => state.setKeyword)
  const resetFilters = useFilterStore((state) => state.resetFilters)

  // 分类被删除后，避免筛选条件停留在不存在的分类上
  useEffect(() => {
    if (category !== 'all' && !categories.includes(category)) {
      setCategory('all')
    }
  }, [categories, category, setCategory])

  const hasFilters =
    status !== 'all' || priority !== 'all' || category !== 'all' || keyword.trim() !== ''

  return (
    <section
      aria-label="搜索与筛选"
      className="space-y-3 rounded-xl border border-line/70 bg-paper-soft/70 p-4 shadow-[0_1px_2px_rgba(90,74,52,0.04)] backdrop-blur-sm sm:p-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索任务标题或描述…"
            aria-label="搜索任务"
            className="w-full rounded-lg border border-line/80 bg-silk py-2.5 pr-9 pl-9 text-sm text-ink placeholder:text-ink-faint/80 outline-none transition-colors duration-200 hover:border-line focus:border-celadon/60 focus:ring-2 focus:ring-celadon/15"
          />
          {keyword !== '' && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              aria-label="清空搜索"
              className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div
          className="flex shrink-0 rounded-lg bg-ink/[0.04] p-1"
          role="group"
          aria-label="任务状态筛选"
        >
          {STATUS_OPTIONS.map((option) => {
            const isActive = status === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setStatus(option.value)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-all duration-200 lg:flex-none ${isActive
                    ? 'border border-line/70 bg-silk text-ink shadow-sm shadow-ink/5'
                    : 'border border-transparent text-ink-soft hover:text-ink'
                  }`}
              >
                {option.label}
                <span
                  className={`text-[11px] tabular-nums ${isActive ? 'text-cinnabar/80' : 'text-ink-faint/70'}`}
                >
                  {counts[option.value]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="hidden items-center gap-1.5 text-xs tracking-[0.2em] text-ink-faint sm:flex">
          <SlidersHorizontal className="size-3.5" />
          筛选
        </span>

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority | 'all')}
          aria-label="按优先级筛选"
          className={selectClass}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="按分类筛选"
          className={selectClass}
        >
          <option value="all">全部分类</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasFilters}
          className="self-start rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors duration-200 hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 sm:ml-auto"
        >
          重置筛选
        </button>
      </div>
    </section>
  )
}

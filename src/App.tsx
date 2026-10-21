import { useCallback, useMemo, useState } from 'react'
import { ClipboardList, Plus, SearchX } from 'lucide-react'
import FilterBar from './components/FilterBar'
import StatPanel from './components/StatPanel'
import TaskCard from './components/TaskCard'
import TaskForm from './components/TaskForm'
import { useFilterStore } from './store/filterStore'
import { useTaskStore } from './store/taskStore'
import type { Task, TaskStatusFilter } from './types/task'

export default function App() {
  const tasks = useTaskStore((state) => state.tasks)

  const status = useFilterStore((state) => state.status)
  const priority = useFilterStore((state) => state.priority)
  const category = useFilterStore((state) => state.category)
  const keyword = useFilterStore((state) => state.keyword)
  const resetFilters = useFilterStore((state) => state.resetFilters)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const counts = useMemo<Record<TaskStatusFilter, number>>(() => {
    const completed = tasks.filter((task) => task.completed).length
    return {
      all: tasks.length,
      active: tasks.length - completed,
      completed,
    }
  }, [tasks])

  const categories = useMemo(() => {
    const unique = new Set(tasks.map((task) => task.category))
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'zh-CN'))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    const query = keyword.trim().toLowerCase()

    return tasks.filter((task) => {
      if (status === 'active' && task.completed) return false
      if (status === 'completed' && !task.completed) return false
      if (priority !== 'all' && task.priority !== priority) return false
      if (category !== 'all' && task.category !== category) return false
      if (query !== '') {
        const matched =
          task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
        if (!matched) return false
      }
      return true
    })
  }, [tasks, status, priority, category, keyword])

  const openCreateForm = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const openEditForm = useCallback((task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingTask(null)
  }, [])

  const hasAnyTask = tasks.length > 0

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="grid size-11 shrink-0 place-items-center rounded-md border border-cinnabar/25 bg-cinnabar font-kai text-lg leading-none text-paper shadow-sm shadow-cinnabar/20">
            待
          </div>
          <div>
            <h1 className="font-kai text-2xl tracking-[0.18em] text-ink sm:text-[28px]">
              我的待办
            </h1>
            <p className="mt-1 text-xs tracking-[0.3em] text-ink-faint">
              静心以事 · 逐项而成
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm tracking-wider text-paper transition-all duration-200 hover:bg-ink/90 hover:shadow-md hover:shadow-ink/15 active:scale-[0.99] sm:w-auto"
        >
          <Plus className="size-4" />
          新建任务
        </button>
      </header>

      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-line to-transparent sm:mt-7" />

      <main className="mt-6 space-y-4 md:space-y-5">
        <StatPanel total={counts.all} completed={counts.completed} active={counts.active} />

        <FilterBar categories={categories} counts={counts} />

        <section aria-label="任务列表">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="flex items-center gap-2 text-sm tracking-[0.2em] text-ink-soft">
              <span className="size-1 rounded-full bg-cinnabar/70" aria-hidden="true" />
              任务列表
            </h2>
            <span className="text-xs text-ink-faint tabular-nums">
              {filteredTasks.length} / {tasks.length} 项
            </span>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onEdit={openEditForm} />
              ))}
            </div>
          ) : (
            <div className="animate-fade-in rounded-xl border border-dashed border-line bg-paper-soft/40 px-6 py-14 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-ink/5 text-ink-faint">
                {hasAnyTask ? <SearchX className="size-5" /> : <ClipboardList className="size-5" />}
              </div>
              <p className="mt-4 font-kai text-base tracking-[0.12em] text-ink-soft">
                {hasAnyTask ? '未寻得相符任务' : '暂无待办'}
              </p>
              <p className="mt-1.5 text-xs text-ink-faint">
                {hasAnyTask ? '试试调整搜索关键词或筛选条件' : '点击「新建任务」添一桩事'}
              </p>
              {hasAnyTask && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-lg border border-line px-3.5 py-1.5 text-xs text-ink-soft transition-colors duration-200 hover:bg-ink/5 hover:text-ink"
                >
                  重置筛选
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-10 text-center text-xs tracking-[0.18em] text-ink-faint">
        数据留存于本机浏览器 LocalStorage · 刷新不散
      </footer>

      {isFormOpen && <TaskForm task={editingTask} onClose={closeForm} />}
    </div>
  )
}

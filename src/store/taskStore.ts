import { addDays, format } from 'date-fns'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { isTask, type Task, type TaskInput } from '../types/task'
import { STORAGE_KEY, safeStorage } from '../utils/storage'

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function dateFromToday(offset: number): string {
  return format(addDays(new Date(), offset), 'yyyy-MM-dd')
}

/** 首次打开页面时展示的 3 条示例任务 */
function createSeedTasks(): Task[] {
  return [
    {
      id: 'seed-study',
      title: '完成进阶版待办事项应用',
      description: '按 PRD 和技术设计文档实现任务增删改查、筛选搜索与统计面板，并完成打包。',
      dueDate: dateFromToday(2),
      priority: 'high',
      category: '学习',
      completed: false,
    },
    {
      id: 'seed-life',
      title: '整理本周学习笔记',
      description: '把课堂笔记按章节归档，补充数字经济课程的案例摘录。',
      dueDate: dateFromToday(0),
      priority: 'medium',
      category: '生活',
      completed: false,
    },
    {
      id: 'seed-done',
      title: '准备课程展示材料',
      description: '整理演示文稿与讲稿，已完成初稿。',
      dueDate: dateFromToday(-1),
      priority: 'low',
      category: '学习',
      completed: true,
    },
  ]
}

interface TaskStore {
  tasks: Task[]
  addTask: (input: TaskInput) => void
  updateTask: (id: string, input: TaskInput) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: createSeedTasks(),
      addTask: (input) =>
        set((state) => ({
          tasks: [{ ...input, id: createId(), completed: false }, ...state.tasks],
        })),
      updateTask: (id, input) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...input } : task)),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ tasks: state.tasks }),
      merge: (persisted, current) => {
        const saved = (persisted as { tasks?: unknown } | undefined)?.tasks
        if (!Array.isArray(saved)) return current
        return { ...current, tasks: saved.filter(isTask) }
      },
    },
  ),
)

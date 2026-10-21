export type Priority = 'low' | 'medium' | 'high'

export type TaskStatusFilter = 'all' | 'active' | 'completed'

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: Priority
  category: string
  completed: boolean
}

export type TaskInput = Omit<Task, 'id' | 'completed'>

export const PRIORITY_META: Record<Priority, { label: string; order: number }> = {
  high: { label: '高', order: 0 },
  medium: { label: '中', order: 1 },
  low: { label: '低', order: 2 },
}

/** 校验从 LocalStorage 读出的数据是否为合法任务 */
export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.dueDate === 'string' &&
    (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high') &&
    typeof task.category === 'string' &&
    typeof task.completed === 'boolean'
  )
}

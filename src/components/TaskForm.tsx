import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import { useTaskStore } from '../store/taskStore'
import type { Priority, Task, TaskInput } from '../types/task'

const fieldClass =
  'w-full rounded-lg border border-line/80 bg-silk px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint/80 outline-none transition-colors duration-200 hover:border-line focus:border-celadon/60 focus:ring-2 focus:ring-celadon/15'

const labelClass = 'mb-1.5 block text-[11px] tracking-[0.2em] text-ink-soft'

const PRIORITY_CHOICES: { value: Priority; label: string; selectedClass: string }[] = [
  { value: 'high', label: '高', selectedClass: 'border-cinnabar/40 bg-cinnabar/8 text-cinnabar' },
  { value: 'medium', label: '中', selectedClass: 'border-ochre/40 bg-ochre/8 text-ochre' },
  { value: 'low', label: '低', selectedClass: 'border-celadon/40 bg-celadon/8 text-celadon' },
]

const CATEGORY_SUGGESTIONS = ['工作', '学习', '生活', '其他']

interface TaskFormProps {
  task: Task | null
  onClose: () => void
}

export default function TaskForm({ task, onClose }: TaskFormProps) {
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)

  const [form, setForm] = useState<TaskInput>(() =>
    task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          category: task.category,
        }
      : {
          title: '',
          description: '',
          dueDate: format(new Date(), 'yyyy-MM-dd'),
          priority: 'medium',
          category: '',
        },
  )
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({})

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const updateField = <K extends keyof TaskInput>(key: K, value: TaskInput[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const submitForm = () => {
    const title = form.title.trim()
    const nextErrors: { title?: string; dueDate?: string } = {}
    if (title === '') nextErrors.title = '请填写任务标题'
    if (form.dueDate === '') nextErrors.dueDate = '请选择截止日期'
    if (nextErrors.title !== undefined || nextErrors.dueDate !== undefined) {
      setErrors(nextErrors)
      return
    }

    const payload: TaskInput = {
      ...form,
      title,
      description: form.description.trim(),
      category: form.category.trim() === '' ? '未分类' : form.category.trim(),
    }

    if (task) {
      updateTask(task.id, payload)
    } else {
      addTask(payload)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center overflow-y-auto bg-ink/25 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        className="my-auto w-full max-w-lg animate-pop-in rounded-xl border border-line bg-paper-soft p-5 shadow-2xl shadow-ink/15 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="task-form-title"
              className="font-kai text-xl tracking-[0.15em] text-ink"
            >
              {task ? '编辑任务' : '新建任务'}
            </h2>
            <p className="mt-1 text-xs font-serif text-ink-faint">
              {task ? '修改后保存即可更新任务信息' : '填写任务信息，稍后可以随时调整'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭弹窗"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors duration-200 hover:bg-ink/5 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            submitForm()
          }}
          className="mt-5 space-y-4"
          noValidate
        >
          <div>
            <label htmlFor="task-title" className={labelClass}>
              任务标题 <span className="text-cinnabar">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              autoFocus
              value={form.title}
              onChange={(event) => {
                updateField('title', event.target.value)
                if (errors.title !== undefined) {
                  setErrors((previous) => ({ ...previous, title: undefined }))
                }
              }}
              placeholder="例如：完成课程作业"
              className={fieldClass}
            />
            {errors.title !== undefined && (
              <p className="mt-1.5 text-xs text-cinnabar">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="task-description" className={labelClass}>
              任务描述
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="补充任务细节（可选）"
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="task-due-date" className={labelClass}>
                截止日期 <span className="text-cinnabar">*</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                required
                value={form.dueDate}
                onChange={(event) => {
                  updateField('dueDate', event.target.value)
                  if (errors.dueDate !== undefined) {
                    setErrors((previous) => ({ ...previous, dueDate: undefined }))
                  }
                }}
                className={fieldClass}
              />
              {errors.dueDate !== undefined && (
                <p className="mt-1.5 text-xs text-cinnabar">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="task-category" className={labelClass}>
                分类标签
              </label>
              <input
                id="task-category"
                type="text"
                list="category-options"
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
                placeholder="学习 / 工作 / 生活"
                className={fieldClass}
              />
              <datalist id="category-options">
                {CATEGORY_SUGGESTIONS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <span className={labelClass}>优先级</span>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="任务优先级">
              {PRIORITY_CHOICES.map((choice) => {
                const isActive = form.priority === choice.value
                return (
                  <button
                    key={choice.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => updateField('priority', choice.value)}
                    className={`rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
                      isActive
                        ? choice.selectedClass
                        : 'border-line/80 bg-silk text-ink-soft hover:border-line hover:text-ink'
                    }`}
                  >
                    {choice.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line px-4 py-2.5 text-sm text-ink-soft transition-colors duration-200 hover:bg-ink/5 hover:text-ink"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-lg bg-ink px-4 py-2.5 text-sm tracking-wide text-paper transition-all duration-200 hover:bg-ink/90 hover:shadow-lg hover:shadow-ink/15"
            >
              {task ? '保存修改' : '添加任务'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

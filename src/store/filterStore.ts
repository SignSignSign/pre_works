import { create } from 'zustand'
import type { Priority, TaskStatusFilter } from '../types/task'

export type PriorityFilter = Priority | 'all'

interface FilterStore {
  status: TaskStatusFilter
  priority: PriorityFilter
  category: string
  keyword: string
  setStatus: (status: TaskStatusFilter) => void
  setPriority: (priority: PriorityFilter) => void
  setCategory: (category: string) => void
  setKeyword: (keyword: string) => void
  resetFilters: () => void
}

const initialFilters = {
  status: 'all' as TaskStatusFilter,
  priority: 'all' as PriorityFilter,
  category: 'all',
  keyword: '',
}

export const useFilterStore = create<FilterStore>()((set) => ({
  ...initialFilters,
  setStatus: (status) => set({ status }),
  setPriority: (priority) => set({ priority }),
  setCategory: (category) => set({ category }),
  setKeyword: (keyword) => set({ keyword }),
  resetFilters: () => set(initialFilters),
}))

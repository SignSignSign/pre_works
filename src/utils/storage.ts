import type { StateStorage } from 'zustand/middleware'

export const STORAGE_KEY = 'todo-app:tasks'

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch (error) {
    console.warn('[storage] 读取本地数据失败', error)
    return null
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch (error) {
    console.warn('[storage] 写入本地数据失败', error)
  }
}

function remove(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn('[storage] 删除本地数据失败', error)
  }
}

/** 提供给 zustand persist 的安全存储实现，所有读写均带容错 */
export const safeStorage: StateStorage = {
  getItem: (name) => read(name),
  setItem: (name, value) => write(name, value),
  removeItem: (name) => remove(name),
}

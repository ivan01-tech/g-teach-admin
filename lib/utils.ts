import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Recursively converts Firestore Timestamps to serializable numbers (milliseconds).
 * Also handles nested objects and arrays.
 */
export function toSerializable(data: any): any {
  if (data === null || data === undefined) return data;

  // Handle Firestore Timestamp
  if (typeof data.toDate === "function") {
    return data.toDate().getTime();
  }

  // Handle Array
  if (Array.isArray(data)) {
    return data.map(toSerializable);
  }

  // Handle Object
  if (typeof data === "object" && data.constructor.name === "Object") {
    const result: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = toSerializable(data[key]);
      }
    }
    return result;
  }

  return data;
}

export
  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
export const formatTime = (date?: Date) => {

  if (!date) return ""
  let d = new Date(date) 
    console.log("Formatting date:", date)
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return d.toLocaleDateString([], { weekday: "short" })
    } else {
      return d.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }
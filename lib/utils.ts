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

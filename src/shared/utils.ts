import { randomUUID, createHash } from 'node:crypto';

export function generateUUID(): string {
  return randomUUID();
}

export function generateExp(seconds: number): number {
  const secondNumber = +seconds;
  return Math.floor(Math.floor(new Date().getTime() / 1000)) + (secondNumber ?? 0);
}

function getDateTimeInSecs(): number {
  return Math.floor(new Date().getTime() / 1000);
}

export function getCurrentTime(): number {
  return Math.floor(getDateTimeInSecs());
}

export function getKeys(object: any): any {
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof object[key] === 'object') {
      keys.splice(i + 1, 0, getKeys(object[key]));
      i++;
    }
  }

  return keys;
}


export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function removeNonAlphanumeric(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

import { UserBirthInfo } from './types';

export function saveUserInfo(info: Partial<UserBirthInfo>) {
  const existing = getUserInfo();
  const updated = { ...existing, ...info };
  localStorage.setItem('user-birth-info', JSON.stringify(updated));
}

export function getUserInfo(): Partial<UserBirthInfo> {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem('user-birth-info');
  if (!stored) return {};
  
  return JSON.parse(stored);
}

export function isUserInfoComplete(info: Partial<UserBirthInfo>): boolean {
  const required: (keyof UserBirthInfo)[] = ['name', 'dateOfBirth', 'timeOfBirth', 'placeOfBirth', 'gender'];
  return required.every(key => info[key]);
} 
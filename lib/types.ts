export interface UserBirthInfo {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: 'male' | 'female' | 'other';
  latitude?: number;
  longitude?: number;
}

export type OnboardingStep = 'name' | 'birth-date' | 'birth-place' | 'gender' | 'complete'; 
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUserInfo, saveUserInfo, isUserInfoComplete } from '@/lib/storage';
import type { UserBirthInfo, OnboardingStep } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function Home() {
  const [step, setStep] = useState<OnboardingStep>('name');
  const [userInfo, setUserInfo] = useState<Partial<UserBirthInfo>>({});
  const router = useRouter();

  useEffect(() => {
    const stored = getUserInfo();
    setUserInfo(stored);
    
    if (isUserInfoComplete(stored)) {
      router.push('/dashboard');
    }
  }, [router]);

  const updateInfo = (data: Partial<UserBirthInfo>) => {
    const updated = { ...userInfo, ...data };
    setUserInfo(updated);
    saveUserInfo(updated);
  };

  const formatTimeForInput = (time: string | undefined) => {
    if (!time) return '';
    return time.length === 5 ? time : `${time}:00`;
  };

  const nextStep = () => {
    const steps: OnboardingStep[] = ['name', 'birth-date', 'birth-place', 'gender', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
    
    if (step === 'gender') {
      saveUserInfo(userInfo);
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-background relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="space-y-8">
            <motion.div 
              className="text-center space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-purple-600">
                Discover Your Cosmic Journey
              </h1>
              <p className="text-foreground/70 text-lg">
                Let&apos;s start by getting to know you better
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-secondary/20 backdrop-blur-sm rounded-xl p-8"
              >
                {step === 'name' && (
                  <div className="space-y-4">
                    <label className="block text-base font-medium text-foreground/90">
                      What&apos;s your name?
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={userInfo.name || ''}
                      onChange={(e) => updateInfo({ name: e.target.value })}
                      className="transition-all duration-200 focus:scale-[1.02]"
                    />
                    <Button 
                      className="w-full transition-all duration-200 hover:scale-[1.02]"
                      onClick={nextStep}
                      disabled={!userInfo.name}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {step === 'birth-date' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-base font-medium text-foreground/90">
                        When were you born?
                      </label>
                      <Input
                        type="date"
                        className="w-full transition-all duration-200 focus:scale-[1.02]"
                        value={userInfo.dateOfBirth || ''}
                        onChange={(e) => updateInfo({ dateOfBirth: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-base font-medium text-foreground/90">
                        At what time?
                      </label>
                      <Input
                        type="time"
                        className="w-full transition-all duration-200 focus:scale-[1.02]"
                        value={formatTimeForInput(userInfo.timeOfBirth)}
                        onChange={(e) => updateInfo({ timeOfBirth: e.target.value })}
                      />
                    </div>
                    
                    <Button 
                      className="w-full transition-all duration-200 hover:scale-[1.02]"
                      onClick={nextStep}
                      disabled={!userInfo.dateOfBirth || !userInfo.timeOfBirth}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {step === 'birth-place' && (
                  <div className="space-y-4">
                    <label className="block text-base font-medium text-foreground/90">
                      Where were you born?
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter city, country"
                      value={userInfo.placeOfBirth || ''}
                      onChange={(e) => updateInfo({ placeOfBirth: e.target.value })}
                      className="transition-all duration-200 focus:scale-[1.02]"
                    />
                    <Button 
                      className="w-full transition-all duration-200 hover:scale-[1.02]"
                      onClick={nextStep}
                      disabled={!userInfo.placeOfBirth}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {step === 'gender' && (
                  <div className="space-y-4">
                    <label className="block text-base font-medium text-foreground/90">
                      What&apos;s your gender?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['male', 'female', 'other'] as const).map((gender) => (
                        <Button
                          key={gender}
                          variant={userInfo.gender === gender ? 'default' : 'outline'}
                          className={cn(
                            "transition-all duration-200 hover:scale-[1.05]",
                            userInfo.gender === gender && "border-primary text-primary-foreground"
                          )}
                          onClick={() => updateInfo({ gender })}
                        >
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </Button>
                      ))}
                    </div>
                    <Button 
                      className="w-full transition-all duration-200 hover:scale-[1.02]"
                      onClick={nextStep}
                      disabled={!userInfo.gender}
                    >
                      Start Your Journey
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              {['name', 'birth-date', 'birth-place', 'gender'].map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "h-3 w-3 rounded-full transition-all duration-300 ring-2 ring-offset-2 ring-offset-background",
                    ['name', 'birth-date', 'birth-place', 'gender'].indexOf(step) >= i
                      ? 'bg-primary ring-primary/30 scale-100'
                      : 'bg-primary ring-muted/20 scale-75 opacity-50'
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

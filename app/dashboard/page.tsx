'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserInfo, isUserInfoComplete } from '@/lib/storage';
import type { UserBirthInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAstroResponse } from '@/lib/gemini';
import { Sparkles, Moon, MessageSquare, LogOut, Calendar, Clock, MapPin, Info } from 'lucide-react';
import { RenderMarkdown } from '@/components/markdown';
import { ThemeSwitcher } from '@/components/theme-switcher';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<Partial<UserBirthInfo>>({});
  const [loading, setLoading] = useState(false);
  const [horoscopeResponse, setHoroscopeResponse] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  const [horoscopeLoading, setHoroscopeLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = getUserInfo();
    if (!isUserInfoComplete(stored)) {
      router.push('/');
      return;
    }
    setUserInfo(stored);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const getHoroscope = async () => {
    setHoroscopeLoading(true);
    try {
      const response = await getAstroResponse(
        `Dear ${userInfo.name}, I&apos;d love to share your daily astrological insights.

Birth Details:
- Date: ${userInfo.dateOfBirth}
- Time: ${userInfo.timeOfBirth}
- Location: ${userInfo.placeOfBirth}

Please provide a daily horoscope focusing on:
1. Overall energy and mood
2. Key opportunities or challenges
3. Practical guidance for the day

Format the response with clear sections using markdown headings and bullet points.`
      );
      setHoroscopeResponse(response);
    } catch (error) {
      console.error('Error getting response:', error);
      setHoroscopeResponse('Sorry, I had trouble connecting to the cosmic forces. Please try again.');
    } finally {
      setHoroscopeLoading(false);
    }
  };

  const askAstrologer = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const response = await getAstroResponse(
        `Dear ${userInfo.name}, I'll help you with your astrological question.

Birth Details:
- Date: ${userInfo.dateOfBirth}
- Time: ${userInfo.timeOfBirth}
- Location: ${userInfo.placeOfBirth}

Your Question: ${question}

Please provide specific insights related to the question, using your birth details for personalized guidance.`
      );
      setCustomResponse(response);
      setQuestion('');
    } catch (error) {
      console.error('Error getting response:', error);
      setCustomResponse('Sorry, I had trouble connecting to the cosmic forces. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Zodiac AI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* User Info Sidebar */}
          <aside className="md:w-72 shrink-0">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Welcome, {userInfo.name}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your birth details are used to calculate personalized astrological insights</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>Your Birth Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{userInfo.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{userInfo.timeOfBirth}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="line-clamp-2">{userInfo.placeOfBirth}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="horoscope" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="horoscope" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span>Daily Horoscope</span>
                    </TabsTrigger>
                    <TabsTrigger value="ask" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Ask AI</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="horoscope" className="space-y-4">
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>Get your personalized daily horoscope based on your exact birth details. Our AI analyzes celestial positions and their influence on your life.</p>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={getHoroscope} 
                        disabled={horoscopeLoading}
                      >
                        {horoscopeLoading ? (
                          <>
                            <span className="animate-pulse">Consulting the stars...</span>
                          </>
                        ) : (
                          "Get Today's Reading"
                        )}
                      </Button>
                      {horoscopeResponse && (
                        <Card className="mt-4">
                          <CardContent className="pt-6 prose prose-sm max-w-none prose-primary dark:prose-invert overflow-auto max-h-[60vh]">
                            <RenderMarkdown>{horoscopeResponse}</RenderMarkdown>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="ask" className="space-y-4">
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>Ask specific questions about your life, relationships, career, or any area you&apos;d like cosmic guidance on. Our AI astrologer will provide personalized insights.</p>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="E.g., What career path aligns with my zodiac sign?"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !loading && askAstrologer()}
                        />
                        <Button 
                          onClick={askAstrologer}
                          disabled={loading || !question.trim()}
                          className="shrink-0"
                        >
                          {loading ? 'Asking...' : 'Ask'}
                        </Button>
                      </div>
                      {customResponse && (
                        <Card>
                          <CardContent className="pt-6 prose prose-sm max-w-none prose-primary dark:prose-invert overflow-auto max-h-[60vh]">
                            <RenderMarkdown>{customResponse}</RenderMarkdown>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
} 
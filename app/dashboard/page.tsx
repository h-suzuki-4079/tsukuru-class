'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { WeekNavigation } from '@/components/week-navigation';
import { MissionCard } from '@/components/mission-card';
import { DialogueLog } from '@/components/dialogue-log';
import { Week1Page } from '@/components/week1-page';
import { SensibilityLogComponent } from '@/components/sensibility-log';
import { ThoughtTranslator } from '@/components/thought-translator';
import { QuestionGenerator } from '@/components/question-generator';
import { VirtualInterview } from '@/components/virtual-interview';
import { ActionRoadmap } from '@/components/action-roadmap';
import { GraduationCertificate } from '@/components/graduation-certificate';
import { OnboardingForm } from '@/components/onboarding-form';
import { DiagnosisReport } from '@/components/diagnosis-report';
import { OutputArea } from '@/components/output-area';
import { AiAdvisor } from '@/components/ai-advisor';
import { ThemeToggle } from '@/components/theme-toggle';
import { checkOnboardingStatus } from '@/app/actions/onboarding';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [hasOnboarding, setHasOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const isDeepFocusMode = currentWeek === 4;
  const isWeek0 = currentWeek === 0;
  const isWeek1 = currentWeek === 1;
  const isWeek2 = currentWeek === 2;
  const isWeek3 = currentWeek === 3;
  const isWeek4 = currentWeek === 4;
  const isWeek5 = currentWeek === 5;
  const isWeek6 = currentWeek === 6;
  const isWeek7 = currentWeek === 7;

  // URLパラメータからWeekを読み取る
  useEffect(() => {
    const weekParam = searchParams.get('week');
    if (weekParam) {
      const week = parseInt(weekParam, 10);
      if (!isNaN(week) && week >= 0 && week <= 7) {
        setCurrentWeek(week);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const checkStatus = async () => {
      if (isWeek0) {
        const result = await checkOnboardingStatus();
        setHasOnboarding(result.hasOnboarding || false);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkStatus();
  }, [isWeek0]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-72 border-r border-border bg-sidebar">
        <WeekNavigation currentWeek={currentWeek} onWeekChange={setCurrentWeek} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground font-sans">
                {isDeepFocusMode ? 'Deep Focus Mode' : '学習ダッシュボード'}
              </h1>
              <p className="text-sm text-muted-foreground font-sans">
                {isDeepFocusMode ? '集中して思考を深める時間' : 'AIと共に思考を変容させる'}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Week 0: オンボーディングフォーム or 診断レポート */}
          {isWeek0 ? (
            loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">読み込み中...</p>
              </div>
            ) : hasOnboarding ? (
              <DiagnosisReport isDeepFocusMode={isDeepFocusMode} onWeekChange={setCurrentWeek} />
            ) : (
              <OnboardingForm isDeepFocusMode={isDeepFocusMode} />
            )
          ) : (
            <>
              {/* Mission Card */}
              <MissionCard currentWeek={currentWeek} isDeepFocusMode={isDeepFocusMode} />

              {/* Week 1: 拡張案ジェネレーター / Week 2: 内省ログ / Week 3: 思考翻訳 / Week 4: 問いの設計 / Week 5: バーチャルインタビュー / Week 6: アクションプラン / Week 7: 修了証 / その他の週: AI Dialogue Log */}
              {isWeek1 ? (
                <Week1Page isDeepFocusMode={isDeepFocusMode} />
              ) : isWeek2 ? (
                <SensibilityLogComponent isDeepFocusMode={isDeepFocusMode} />
              ) : isWeek3 ? (
                <ThoughtTranslator isDeepFocusMode={isDeepFocusMode} />
              ) : isWeek4 ? (
                <QuestionGenerator isDeepFocusMode={isDeepFocusMode} />
              ) : isWeek5 ? (
                <VirtualInterview isDeepFocusMode={isDeepFocusMode} />
              ) : isWeek6 ? (
                <ActionRoadmap isDeepFocusMode={isDeepFocusMode} />
              ) : isWeek7 ? (
                <GraduationCertificate isDeepFocusMode={isDeepFocusMode} />
              ) : (
                <DialogueLog isDeepFocusMode={isDeepFocusMode} />
              )}

              {/* Output Area */}
              <OutputArea isDeepFocusMode={isDeepFocusMode} />
            </>
          )}
        </div>
      </main>

      {/* Right Sidebar - AI Advisor */}
      {!isDeepFocusMode && <AiAdvisor isOpen={isAdvisorOpen} onToggle={() => setIsAdvisorOpen(!isAdvisorOpen)} />}
    </div>
  );
}

// Page component: Suspense boundary wrapper only
// All hooks (useSearchParams, useState, useEffect) are in DashboardContent
export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

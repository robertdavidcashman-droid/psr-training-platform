'use client';

import { Award, Flame, Zap, BookOpen, Target, Trophy, Clock, CheckCircle, FileText, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconType = 'level' | 'streak' | 'modules' | 'book' | 'target' | 'trophy' | 'clock' | 'check' | 'certificate' | 'career';

interface StatIconProps {
  type: IconType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap = {
  level: Award,
  streak: Flame,
  modules: Zap,
  book: BookOpen,
  target: Target,
  trophy: Trophy,
  clock: Clock,
  check: CheckCircle,
  certificate: FileText,
  career: Briefcase,
};

const bgColorMap = {
  level: 'bg-amber-50 dark:bg-amber-900/30',
  streak: 'bg-rose-50 dark:bg-rose-900/30',
  modules: 'bg-sky-50 dark:bg-sky-900/30',
  book: 'bg-sky-50 dark:bg-sky-900/30',
  target: 'bg-emerald-50 dark:bg-emerald-900/30',
  trophy: 'bg-violet-50 dark:bg-violet-900/30',
  clock: 'bg-slate-100 dark:bg-slate-800',
  check: 'bg-green-50 dark:bg-green-900/30',
  certificate: 'bg-indigo-50 dark:bg-indigo-900/30',
  career: 'bg-orange-50 dark:bg-orange-900/30',
};

const iconColorMap = {
  level: 'text-amber-500 dark:text-amber-400',
  streak: 'text-rose-500 dark:text-rose-400',
  modules: 'text-sky-500 dark:text-sky-400',
  book: 'text-sky-500 dark:text-sky-400',
  target: 'text-emerald-500 dark:text-emerald-400',
  trophy: 'text-violet-500 dark:text-violet-400',
  clock: 'text-slate-500 dark:text-slate-400',
  check: 'text-green-500 dark:text-green-400',
  certificate: 'text-indigo-500 dark:text-indigo-400',
  career: 'text-orange-500 dark:text-orange-400',
};

const sizeMap = {
  sm: { wrapper: 'w-10 h-10 rounded-xl', icon: 18 },
  md: { wrapper: 'w-14 h-14 rounded-xl', icon: 26 },
  lg: { wrapper: 'w-16 h-16 rounded-2xl', icon: 30 },
};

export function StatIcon({ type, size = 'md', className }: StatIconProps) {
  const Icon = iconMap[type];
  const sizeConfig = sizeMap[size];

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        sizeConfig.wrapper,
        bgColorMap[type],
        className
      )}
    >
      <Icon className={iconColorMap[type]} size={sizeConfig.icon} strokeWidth={2} />
    </div>
  );
}

export { Award, Flame, Zap, BookOpen, Target, Trophy, Clock, CheckCircle };


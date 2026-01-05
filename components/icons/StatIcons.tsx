import { Award, Flame, Zap, BookOpen, Target, Trophy, Clock, CheckCircle, Star, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconBackground = 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'orange';

interface StatIconProps {
  icon: 'award' | 'flame' | 'zap' | 'book' | 'target' | 'trophy' | 'clock' | 'check' | 'star' | 'graduation';
  background?: IconBackground;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap = {
  award: Award,
  flame: Flame,
  zap: Zap,
  book: BookOpen,
  target: Target,
  trophy: Trophy,
  clock: Clock,
  check: CheckCircle,
  star: Star,
  graduation: GraduationCap,
};

const backgroundColors: Record<IconBackground, string> = {
  yellow: 'bg-amber-100',
  pink: 'bg-pink-100',
  blue: 'bg-sky-100',
  green: 'bg-emerald-100',
  purple: 'bg-purple-100',
  orange: 'bg-orange-100',
};

const iconColors: Record<IconBackground, string> = {
  yellow: 'text-amber-500',
  pink: 'text-pink-500',
  blue: 'text-sky-500',
  green: 'text-emerald-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
};

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
};

const iconSizes = {
  sm: 20,
  md: 28,
  lg: 32,
};

export function StatIcon({ icon, background = 'blue', size = 'md', className }: StatIconProps) {
  const IconComponent = iconMap[icon];
  
  return (
    <div
      className={cn(
        'rounded-xl flex items-center justify-center',
        sizeClasses[size],
        backgroundColors[background],
        className
      )}
    >
      <IconComponent size={iconSizes[size]} className={iconColors[background]} strokeWidth={2} />
    </div>
  );
}

// Pre-configured stat icons for dashboard
export function LevelIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <StatIcon icon="award" background="yellow" size={size} />;
}

export function StreakIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <StatIcon icon="flame" background="pink" size={size} />;
}

export function ModulesIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <StatIcon icon="zap" background="blue" size={size} />;
}

export function ProgressIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <StatIcon icon="target" background="green" size={size} />;
}

export function BookIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <StatIcon icon="book" background="blue" size={size} />;
}


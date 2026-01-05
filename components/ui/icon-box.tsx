'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { 
  Award, 
  Flame, 
  Zap, 
  BookOpen, 
  Target, 
  Trophy,
  GraduationCap,
  FileText,
  MessageSquare,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Check,
  AlertCircle,
  Clock,
  Bookmark,
  Star,
  Shield,
  Scale
} from "lucide-react";

// Icon mapping for easy reference
export const Icons = {
  award: Award,
  flame: Flame,
  zap: Zap,
  book: BookOpen,
  target: Target,
  trophy: Trophy,
  graduation: GraduationCap,
  file: FileText,
  message: MessageSquare,
  search: Search,
  user: User,
  settings: Settings,
  logout: LogOut,
  menu: Menu,
  close: X,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  check: Check,
  alert: AlertCircle,
  clock: Clock,
  bookmark: Bookmark,
  star: Star,
  shield: Shield,
  scale: Scale,
};

export type IconName = keyof typeof Icons;

interface IconBoxProps {
  icon: IconName;
  variant?: 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  yellow: 'bg-amber-100 text-amber-600',
  pink: 'bg-rose-100 text-rose-500',
  blue: 'bg-sky-100 text-sky-600',
  green: 'bg-emerald-100 text-emerald-600',
  purple: 'bg-purple-100 text-purple-600',
  default: 'bg-gray-100 text-gray-600',
};

const sizeStyles = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const iconSizes = {
  sm: 18,
  md: 22,
  lg: 26,
};

export function IconBox({ icon, variant = 'default', size = 'md', className }: IconBoxProps) {
  const IconComponent = Icons[icon];
  
  return (
    <div 
      className={cn(
        "rounded-xl flex items-center justify-center flex-shrink-0",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <IconComponent size={iconSizes[size]} strokeWidth={2} />
    </div>
  );
}

export { Award, Flame, Zap, BookOpen, Target, Trophy, GraduationCap, FileText, MessageSquare, Search, User, Settings, LogOut, Menu, X, ChevronRight, ChevronDown, Check, AlertCircle, Clock, Bookmark, Star, Shield, Scale };


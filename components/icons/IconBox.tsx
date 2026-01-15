import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconVariant = 'yellow' | 'pink' | 'blue' | 'green' | 'navy' | 'primary';

interface IconBoxProps {
  icon: LucideIcon;
  variant?: IconVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles: Record<IconVariant, string> = {
  yellow: 'bg-amber-100 text-amber-600',
  pink: 'bg-pink-100 text-pink-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  navy: 'bg-navy-800 text-white',
  primary: 'bg-primary-100 text-primary-600',
};

const sizeStyles = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const iconSizes = {
  sm: 20,
  md: 24,
  lg: 28,
};

export function IconBox({ 
  icon: Icon, 
  variant = 'blue', 
  size = 'md',
  className 
}: IconBoxProps) {
  return (
    <div 
      className={cn(
        'rounded-xl flex items-center justify-center',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <Icon size={iconSizes[size]} strokeWidth={2} />
    </div>
  );
}


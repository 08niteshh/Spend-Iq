import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}: KPICardProps) {
  const variantStyles = {
    default: 'border-border/50',
    success: 'border-success/30',
    warning: 'border-warning/30',
    danger: 'border-destructive/30',
  };

  const iconBgStyles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  };

  return (
    <div
      className={cn(
        'stat-card group transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        variantStyles[variant],
        className
      )}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-2">
          <p className="kpi-label">{title}</p>
          <p className="kpi-value">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
              iconBgStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

import { Insight } from '@/types/expense';
import { cn } from '@/lib/utils';

interface InsightBadgeProps {
  insight: Insight;
}

export function InsightBadge({ insight }: InsightBadgeProps) {
  const typeStyles = {
    positive: 'insight-positive',
    negative: 'insight-negative',
    neutral: 'insight-neutral',
  };

  return (
    <div
      className={cn(
        'insight-badge animate-fade-in border',
        typeStyles[insight.type]
      )}
    >
      <span className="text-base">{insight.icon}</span>
      <span>{insight.message}</span>
    </div>
  );
}

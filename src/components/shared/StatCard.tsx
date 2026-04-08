import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  iconBg?: string;
  trend?: { value: string; direction: 'up' | 'down' | 'flat' };
  color?: 'teal' | 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

const colorMap = {
  teal: 'bg-merz-teal-light text-merz-teal',
  blue: 'bg-product-xeomin-light text-product-xeomin',
  green: 'bg-compliance-compliant-bg text-compliance-compliant',
  amber: 'bg-compliance-pv-flag-bg text-compliance-pv-flag',
  red: 'bg-compliance-off-label-bg text-compliance-off-label',
  purple: 'bg-compliance-low-confidence-bg text-compliance-low-confidence',
};

export default function StatCard({ title, value, subtitle, icon, iconBg, trend, color = 'teal' }: Props) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend?.direction === 'up'
      ? 'text-compliance-compliant'
      : trend?.direction === 'down'
      ? 'text-compliance-off-label'
      : 'text-merz-slate-light';

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-merz-slate-light uppercase tracking-wide">{title}</p>
        {icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg || colorMap[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-2xl font-bold text-merz-slate">{value}</p>
        {trend && (
          <div className={`flex items-center gap-0.5 mb-0.5 ${trendColor}`}>
            <TrendIcon size={13} />
            <span className="text-xs font-medium">{trend.value}</span>
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-merz-slate-light">{subtitle}</p>}
    </div>
  );
}

import { AlertTriangle, AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import type { ComplianceFlag } from '../../types';

const config: Record<ComplianceFlag, {
  label: string;
  icon: React.ReactNode;
  className: string;
}> = {
  'off-label': {
    label: 'Off-Label Refused',
    icon: <AlertCircle size={11} />,
    className: 'badge-red',
  },
  'pv-signal': {
    label: 'PV Signal Flagged',
    icon: <AlertTriangle size={11} />,
    className: 'badge-amber',
  },
  'competitive': {
    label: 'Competitive Mention',
    icon: <TrendingUp size={11} />,
    className: 'badge-purple',
  },
  'low-confidence': {
    label: 'Low Confidence',
    icon: <Info size={11} />,
    className: 'badge-gray',
  },
  'escalated': {
    label: 'Escalated',
    icon: <AlertCircle size={11} />,
    className: 'badge-amber',
  },
  'compliant': {
    label: 'Compliant',
    icon: <CheckCircle size={11} />,
    className: 'badge-green',
  },
};

interface Props {
  flag: ComplianceFlag;
}

export default function ComplianceBadge({ flag }: Props) {
  const c = config[flag];
  return (
    <span className={c.className}>
      {c.icon}
      {c.label}
    </span>
  );
}

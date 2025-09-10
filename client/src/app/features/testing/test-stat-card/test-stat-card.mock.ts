export interface DashboardStat {
  id: number;
  title: string;
  value: string | number;
  subtitle?: string;
}

export const MOCK_STATS: DashboardStat[] = [
  { id: 1, title: 'Total Apps', value: 123092, subtitle: 'All-time' },
  { id: 6, title: 'Revenue', value: '$1.2M', subtitle: 'Last 30 days' },
  { id: 7, title: 'Conversion Rate', value: '4.7%', subtitle: 'This quarter' },
  { id: 10, title: 'CPU Load', value: '68%', subtitle: 'Avg past hour' },
  { id: 13, title: 'Storage Used', value: '72 GB', subtitle: 'Of 100 GB' },
  { id: 20, title: 'Latency', value: '120ms', subtitle: 'Avg response time' },
  { id: 24, title: 'Satisfaction Score', value: '92%', subtitle: 'Customer survey' },
  { id: 28, title: 'Downloads', value: 45231, subtitle: 'This month' },
];

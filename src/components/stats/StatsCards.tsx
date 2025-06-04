import { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Network, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Calendar,
  BarChart3
} from 'lucide-react';
import type { ParameterUpdate } from '../../types';
import { calculateStats } from '../../data/mockData';
import { cn } from '../../utils';

interface StatsCardsProps {
  updates: ParameterUpdate[];
  className?: string;
}

export const StatsCards = ({ updates, className }: StatsCardsProps) => {
  const stats = useMemo(() => calculateStats(updates), [updates]);

  const statCards = [
    {
      id: 'total-updates',
      title: 'Total Updates',
      value: stats.totalUpdates.toLocaleString(),
      icon: BarChart3,
      color: 'blue',
      subtitle: `${stats.totalToday} today`,
      trend: stats.totalToday > 0 ? 'up' : 'neutral',
    },
    {
      id: 'most-active-asset',
      title: 'Most Active Asset',
      value: stats.mostActiveAsset.symbol || 'N/A',
      icon: Target,
      color: 'purple',
      subtitle: `${stats.mostActiveAsset.count} updates`,
      trend: 'neutral',
    },
    {
      id: 'most-active-network',
      title: 'Most Active Network',
      value: stats.mostActiveNetwork.name || 'N/A',
      icon: Network,
      color: 'indigo',
      subtitle: `${stats.mostActiveNetwork.count} updates`,
      trend: 'neutral',
    },
    {
      id: 'avg-time-between',
      title: 'Avg Time Between',
      value: `${stats.averageTimeBetween.toFixed(1)}h`,
      icon: Clock,
      color: 'gray',
      subtitle: 'Between updates',
      trend: stats.averageTimeBetween < 24 ? 'up' : 'down',
    },
    {
      id: 'success-rate',
      title: 'Success Rate',
      value: `${stats.successRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: 'green',
      subtitle: 'Of all updates',
      trend: stats.successRate >= 95 ? 'up' : stats.successRate >= 90 ? 'neutral' : 'down',
    },
    {
      id: 'automation-rate',
      title: 'Automation Rate',
      value: `${stats.automationRate.toFixed(1)}%`,
      icon: Zap,
      color: 'yellow',
      subtitle: 'Automated updates',
      trend: stats.automationRate >= 60 ? 'up' : 'neutral',
    },
    {
      id: 'critical-updates',
      title: 'Critical Updates',
      value: stats.criticalUpdates.toString(),
      icon: AlertTriangle,
      color: 'red',
      subtitle: 'High risk changes',
      trend: stats.criticalUpdates > 0 ? 'up' : 'neutral',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600 bg-blue-100',
        text: 'text-blue-600',
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600 bg-purple-100',
        text: 'text-purple-600',
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: 'text-indigo-600 bg-indigo-100',
        text: 'text-indigo-600',
      },
      gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'text-gray-600 bg-gray-100',
        text: 'text-gray-600',
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600 bg-green-100',
        text: 'text-green-600',
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-600 bg-yellow-100',
        text: 'text-yellow-600',
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600 bg-red-100',
        text: 'text-red-600',
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4", className)}>
      {statCards.map((card) => {
        const Icon = card.icon;
        const colors = getColorClasses(card.color);
        
        return (
          <div
            key={card.id}
            className={cn(
              "bg-white rounded-lg border p-4 hover:shadow-md transition-shadow",
              colors.border
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                  {getTrendIcon(card.trend)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {card.subtitle}
                </p>
              </div>
              <div className={cn("p-2 rounded-lg", colors.icon)}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Enhanced Stats with More Details
interface DetailedStatsProps {
  updates: ParameterUpdate[];
}

export const DetailedStats = ({ updates }: DetailedStatsProps) => {
  
  // Calculate additional detailed metrics
  const detailedMetrics = useMemo(() => {
    const last7Days = updates.filter(u => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return u.timestamp >= weekAgo;
    });

    const last30Days = updates.filter(u => {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return u.timestamp >= monthAgo;
    });

    // Parameter type distribution
    const parameterCounts: { [key: string]: number } = {};
    updates.forEach(u => {
      parameterCounts[u.parameter] = (parameterCounts[u.parameter] || 0) + 1;
    });
    const topParameter = Object.entries(parameterCounts).reduce((max, [param, count]) => 
      count > max.count ? { param, count } : max, { param: '', count: 0 });

    // Network distribution
    const networkCounts: { [key: string]: number } = {};
    updates.forEach(u => {
      networkCounts[u.network.name] = (networkCounts[u.network.name] || 0) + 1;
    });

    return {
      last7Days: last7Days.length,
      last30Days: last30Days.length,
      topParameter,
      networkDistribution: Object.entries(networkCounts),
      avgUpdatesPerDay: last30Days.length / 30,
    };
  }, [updates]);

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <StatsCards updates={updates} />

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time-based Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Last 7 days</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {detailedMetrics.last7Days}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Last 30 days</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {detailedMetrics.last30Days}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Avg per day</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {detailedMetrics.avgUpdatesPerDay.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Parameter */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Parameters</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{detailedMetrics.topParameter.param}</p>
                <p className="text-sm text-gray-600">Most updated parameter</p>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {detailedMetrics.topParameter.count}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {detailedMetrics.networkDistribution.map(([network, count]) => (
            <div key={network} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{network}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
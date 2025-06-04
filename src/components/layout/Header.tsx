import { Shield, TrendingUp, Network, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { DashboardStats } from '../../types';

interface HeaderProps {
  stats: DashboardStats;
}

export const Header = ({ stats }: HeaderProps) => {
  const statCards = [
    {
      label: 'Updates Today',
      value: stats.totalUpdatesToday,
      icon: Clock,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: 'Active Networks',
      value: stats.activeNetworks,
      icon: Network,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      label: 'Manual Updates',
      value: stats.manualUpdates,
      icon: Shield,
      color: 'text-manual-600 bg-manual-50 border-manual-200',
    },
    {
      label: 'Automated Updates',
      value: stats.automatedUpdates,
      icon: TrendingUp,
      color: 'text-automated-600 bg-automated-50 border-automated-200',
    },
    {
      label: 'Successful',
      value: stats.successfulUpdates,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
      label: 'Failed',
      value: stats.failedUpdates,
      icon: XCircle,
      color: 'text-red-600 bg-red-50 border-red-200',
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            RiskSteward Parameter Updates
          </h1>
          <p className="mt-2 text-gray-600">
            Real-time monitoring of parameter updates across all supported networks
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg border ${stat.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-manual-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Success Rate</h3>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-900">
                {stats.successfulUpdates + stats.failedUpdates > 0
                  ? Math.round((stats.successfulUpdates / (stats.successfulUpdates + stats.failedUpdates)) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-blue-700">
                ({stats.successfulUpdates} of {stats.successfulUpdates + stats.failedUpdates} updates)
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-automated-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-sm font-medium text-green-900 mb-2">Automation Rate</h3>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-green-900">
                {stats.manualUpdates + stats.automatedUpdates > 0
                  ? Math.round((stats.automatedUpdates / (stats.manualUpdates + stats.automatedUpdates)) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-green-700">
                ({stats.automatedUpdates} of {stats.manualUpdates + stats.automatedUpdates} updates)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
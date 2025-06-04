import React, { useState, useMemo } from 'react';
import { Search, Calendar } from 'lucide-react';
import type { ParameterUpdate } from '../../types';
import { UpdateCard } from './UpdateCard';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';

interface UpdatesTimelineProps {
  updates: ParameterUpdate[];
  onUpdateClick?: (update: ParameterUpdate) => void;
}

export const UpdatesTimeline: React.FC<UpdatesTimelineProps> = ({
  updates,
  onUpdateClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stewardFilter, setStewardFilter] = useState<string>('all');
  const [networkFilter, setNetworkFilter] = useState<string>('all');

  // Filter updates based on search and filters
  const filteredUpdates = useMemo(() => {
    return updates.filter(update => {
      const matchesSearch = 
        update.asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.network.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || update.status === statusFilter;
      const matchesSteward = stewardFilter === 'all' || update.stewardType === stewardFilter;
      const matchesNetwork = networkFilter === 'all' || update.network.id === networkFilter;

      return matchesSearch && matchesStatus && matchesSteward && matchesNetwork;
    });
  }, [updates, searchTerm, statusFilter, stewardFilter, networkFilter]);

  // Group updates by date
  const groupedUpdates = useMemo(() => {
    const groups: { [key: string]: ParameterUpdate[] } = {};

    filteredUpdates.forEach(update => {
      const dateKey = startOfDay(update.timestamp).toISOString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(update);
    });

    // Sort groups by date (newest first)
    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([dateKey, updates]) => ({
        date: new Date(dateKey),
        updates: updates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      }));
  }, [filteredUpdates]);

  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM dd, yyyy');
  };

  // Get unique networks for filter
  const uniqueNetworks = useMemo(() => {
    const networks = new Set(updates.map(u => JSON.stringify({ id: u.network.id, name: u.network.name })));
    return Array.from(networks).map(n => JSON.parse(n));
  }, [updates]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by asset, parameter, or network..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Steward Type</label>
              <select
                value={stewardFilter}
                onChange={(e) => setStewardFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Manual">Manual</option>
                <option value="Automated">Automated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
              <select
                value={networkFilter}
                onChange={(e) => setNetworkFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Networks</option>
                {uniqueNetworks.map(network => (
                  <option key={network.id} value={network.id}>
                    {network.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setStewardFilter('all');
                  setNetworkFilter('all');
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {filteredUpdates.length} of {updates.length} updates
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {groupedUpdates.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          groupedUpdates.map(({ date, updates: dayUpdates }) => (
            <div key={date.toISOString()}>
              {/* Date header */}
              <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-2 rounded-lg mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {getDateLabel(date)}
                  <span className="text-sm font-normal text-gray-500">
                    ({dayUpdates.length} update{dayUpdates.length !== 1 ? 's' : ''})
                  </span>
                </h2>
              </div>

              {/* Updates for this date */}
              <div className="grid gap-4">
                {dayUpdates.map(update => (
                  <UpdateCard
                    key={update.id}
                    update={update}
                    onClick={() => onUpdateClick?.(update)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
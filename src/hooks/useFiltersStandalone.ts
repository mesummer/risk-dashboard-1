import { useState, useMemo, useCallback } from 'react';
import type { FilterState, ParameterUpdate, ParameterType } from '../types';

const defaultFilters: FilterState = {
  networks: [],
  assets: [],
  parameters: [],
  stewardType: 'all',
  timeRange: { preset: '30d' },
  status: [],
  search: '',
};

export function useFiltersStandalone(updates: ParameterUpdate[]) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Filter updates based on current filters
  const filteredUpdates = useMemo(() => {
    return updates.filter(update => {
      // Network filter
      if (filters.networks.length > 0 && !filters.networks.includes(update.network.id)) {
        return false;
      }

      // Asset filter
      if (filters.assets.length > 0 && !filters.assets.includes(update.asset.symbol)) {
        return false;
      }

      // Parameter filter
      if (filters.parameters.length > 0 && !filters.parameters.includes(update.parameter)) {
        return false;
      }

      // Steward type filter
      if (filters.stewardType !== 'all' && update.stewardType !== filters.stewardType) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(update.status)) {
        return false;
      }

      // Time range filter
      if (!isWithinTimeRange(update.timestamp, filters.timeRange)) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          update.asset.symbol.toLowerCase().includes(searchLower) ||
          update.asset.name.toLowerCase().includes(searchLower) ||
          update.parameter.toLowerCase().includes(searchLower) ||
          update.network.name.toLowerCase().includes(searchLower) ||
          update.transactionHash.toLowerCase().includes(searchLower) ||
          update.oldValue.toLowerCase().includes(searchLower) ||
          update.newValue.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [updates, filters]);

  // Update individual filter
  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Clear specific filter
  const clearFilter = useCallback((key: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [key]: defaultFilters[key],
    }));
  }, []);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.networks.length > 0) count++;
    if (filters.assets.length > 0) count++;
    if (filters.parameters.length > 0) count++;
    if (filters.stewardType !== 'all') count++;
    if (filters.timeRange.preset !== '30d' || filters.timeRange.startDate) count++;
    if (filters.status.length > 0) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  // Check if any filters are active
  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    filteredUpdates,
    updateFilter,
    clearFilters,
    clearFilter,
    activeFilterCount,
    hasActiveFilters,
  };
}

// Helper function
function isWithinTimeRange(timestamp: Date, timeRange: FilterState['timeRange']): boolean {
  const now = new Date();
  const updateTime = new Date(timestamp);
  
  if (timeRange.preset === 'custom') {
    if (timeRange.startDate && updateTime < timeRange.startDate) return false;
    if (timeRange.endDate && updateTime > timeRange.endDate) return false;
    return true;
  }
  
  const cutoffTime = new Date();
  switch (timeRange.preset) {
    case '24h':
      cutoffTime.setHours(cutoffTime.getHours() - 24);
      break;
    case '7d':
      cutoffTime.setDate(cutoffTime.getDate() - 7);
      break;
    case '30d':
      cutoffTime.setDate(cutoffTime.getDate() - 30);
      break;
  }
  
  return updateTime >= cutoffTime;
}
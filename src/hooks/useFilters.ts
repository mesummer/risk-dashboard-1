import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterState, TimeRange, ParameterUpdate, ParameterType } from '../types';

const defaultFilters: FilterState = {
  networks: [],
  assets: [],
  parameters: [],
  stewardType: 'all',
  timeRange: { preset: '30d' },
  status: [],
  search: '',
};

export function useFilters(updates: ParameterUpdate[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    // Initialize from URL parameters
    return {
      networks: searchParams.get('networks')?.split(',').filter(Boolean) || [],
      assets: searchParams.get('assets')?.split(',').filter(Boolean) || [],
      parameters: (searchParams.get('parameters')?.split(',').filter(Boolean) || []) as ParameterType[],
      stewardType: (searchParams.get('stewardType') as FilterState['stewardType']) || 'all',
      timeRange: parseTimeRangeFromUrl(searchParams.get('timeRange')),
      status: (searchParams.get('status')?.split(',').filter(Boolean) || []) as FilterState['status'],
      search: searchParams.get('search') || '',
    };
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.networks.length > 0) params.set('networks', filters.networks.join(','));
    if (filters.assets.length > 0) params.set('assets', filters.assets.join(','));
    if (filters.parameters.length > 0) params.set('parameters', filters.parameters.join(','));
    if (filters.stewardType !== 'all') params.set('stewardType', filters.stewardType);
    if (filters.timeRange.preset !== '30d' || filters.timeRange.startDate) {
      params.set('timeRange', serializeTimeRange(filters.timeRange));
    }
    if (filters.status.length > 0) params.set('status', filters.status.join(','));
    if (filters.search) params.set('search', filters.search);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

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

// Helper functions
function parseTimeRangeFromUrl(timeRangeStr: string | null): TimeRange {
  if (!timeRangeStr) return { preset: '30d' };
  
  if (timeRangeStr === '24h' || timeRangeStr === '7d' || timeRangeStr === '30d') {
    return { preset: timeRangeStr };
  }
  
  // Parse custom range: "custom:2024-01-01:2024-01-31"
  if (timeRangeStr.startsWith('custom:')) {
    const [, startStr, endStr] = timeRangeStr.split(':');
    return {
      preset: 'custom',
      startDate: startStr ? new Date(startStr) : undefined,
      endDate: endStr ? new Date(endStr) : undefined,
    };
  }
  
  return { preset: '30d' };
}

function serializeTimeRange(timeRange: TimeRange): string {
  if (timeRange.preset !== 'custom') {
    return timeRange.preset;
  }
  
  const start = timeRange.startDate?.toISOString().split('T')[0] || '';
  const end = timeRange.endDate?.toISOString().split('T')[0] || '';
  return `custom:${start}:${end}`;
}

function isWithinTimeRange(timestamp: Date, timeRange: TimeRange): boolean {
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
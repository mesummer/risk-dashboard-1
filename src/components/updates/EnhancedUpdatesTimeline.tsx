import { useState, useMemo } from 'react';
import type { ParameterUpdate } from '../../types';
import { UpdateCard } from './UpdateCard';
import { SearchBar } from '../filters/SearchBar';
import { FilterPanel } from '../filters/FilterPanel';
import { FilterChips } from '../filters/FilterChips';
import { LoadingState } from '../states/LoadingState';
import { EmptyState } from '../states/EmptyState';
import { useFiltersStandalone } from '../../hooks/useFiltersStandalone';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';

interface EnhancedUpdatesTimelineProps {
  updates: ParameterUpdate[];
  onUpdateClick?: (update: ParameterUpdate) => void;
  isLoading?: boolean;
}

export const EnhancedUpdatesTimeline = ({
  updates,
  onUpdateClick,
  isLoading = false
}: EnhancedUpdatesTimelineProps) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const {
    filters,
    filteredUpdates,
    updateFilter,
    clearFilters,
    clearFilter,
    activeFilterCount,
    hasActiveFilters,
  } = useFiltersStandalone(updates);

  // Group updates by date for timeline display
  const groupedUpdates = useMemo(() => {
    const groups: { [key: string]: ParameterUpdate[] } = {};

    filteredUpdates.forEach(update => {
      const dateKey = startOfDay(update.timestamp).toISOString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(update);
    });

    // Sort groups by date (newest first) and updates within each group
    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([dateKey, updates]) => ({
        date: new Date(dateKey),
        updates: updates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      }));
  }, [filteredUpdates]);

  // Pagination
  const totalPages = Math.ceil(groupedUpdates.length / itemsPerPage);
  const paginatedGroups = groupedUpdates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM dd, yyyy');
  };

  const handleRefresh = () => {
    // In a real app, this would trigger a data refresh
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingState message="Loading parameter updates..." />;
  }

  return (
    <div className="flex h-full">
      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        updates={updates}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        isOpen={isFilterPanelOpen}
        onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header with Search and Filter Toggle */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <SearchBar
                value={filters.search}
                onChange={(value) => updateFilter('search', value)}
                updates={updates}
              />
            </div>

          </div>
        </div>

        {/* Filter Chips */}
        {hasActiveFilters && (
          <FilterChips
            filters={filters}
            updates={updates}
            onUpdateFilter={updateFilter}
            onClearFilter={clearFilter}
            onClearAll={clearFilters}
            activeFilterCount={activeFilterCount}
          />
        )}

        {/* Results Summary */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredUpdates.length} of {updates.length} updates
              {hasActiveFilters && (
                <span className="ml-1 text-blue-600">
                  ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)
                </span>
              )}
            </p>
            
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto">
          {filteredUpdates.length === 0 ? (
            <EmptyState
              type={hasActiveFilters ? 'filtered' : updates.length === 0 ? 'no-data' : 'no-results'}
              onClearFilters={hasActiveFilters ? clearFilters : undefined}
              onRefresh={handleRefresh}
              searchTerm={filters.search}
              filterCount={activeFilterCount}
            />
          ) : (
            <div className="p-4 space-y-8">
              {paginatedGroups.map(({ date, updates: dayUpdates }) => (
                <div key={date.toISOString()}>
                  {/* Date Header */}
                  <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 rounded-lg mb-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
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
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-500">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            currentPage === totalPages
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
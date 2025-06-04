import { Search, Filter, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-results' | 'no-data' | 'filtered';
  onClearFilters?: () => void;
  onRefresh?: () => void;
  searchTerm?: string;
  filterCount?: number;
}

export const EmptyState = ({ 
  type, 
  onClearFilters, 
  onRefresh,
  searchTerm,
  filterCount = 0
}: EmptyStateProps) => {
  const getContent = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: <Search className="w-12 h-12 text-gray-400" />,
          title: searchTerm ? `No results for "${searchTerm}"` : 'No results found',
          description: searchTerm 
            ? 'Try adjusting your search terms or filters'
            : 'No parameter updates match your current filters',
          actions: (
            <div className="flex flex-col sm:flex-row gap-3">
              {onClearFilters && filterCount > 0 && (
                <button
                  onClick={onClearFilters}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Clear all filters ({filterCount})
                </button>
              )}
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              )}
            </div>
          )
        };

      case 'filtered':
        return {
          icon: <Filter className="w-12 h-12 text-gray-400" />,
          title: 'No updates match your filters',
          description: `Your current filters (${filterCount}) are hiding all results. Try adjusting or clearing some filters.`,
          actions: onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          )
        };

      case 'no-data':
      default:
        return {
          icon: <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <Search className="w-6 h-6 text-gray-400" />
          </div>,
          title: 'No parameter updates yet',
          description: 'When parameter updates are made, they will appear here.',
          actions: onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Check for updates
            </button>
          )
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4">
        {content.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {content.title}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {content.description}
      </p>
      {content.actions && (
        <div className="flex justify-center">
          {content.actions}
        </div>
      )}
    </div>
  );
};
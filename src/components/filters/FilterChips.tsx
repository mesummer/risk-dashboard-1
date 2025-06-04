import { X } from 'lucide-react';
import type { FilterState, ParameterUpdate } from '../../types';
import { cn } from '../../utils';

interface FilterChipsProps {
  filters: FilterState;
  updates: ParameterUpdate[];
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearFilter: (key: keyof FilterState) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

export const FilterChips = ({ 
  filters, 
  updates, 
  onUpdateFilter,
  onClearFilter, 
  onClearAll, 
  activeFilterCount 
}: FilterChipsProps) => {
  if (activeFilterCount === 0) {
    return null;
  }

  const getNetworkName = (networkId: string) => {
    const network = updates.find(u => u.network.id === networkId)?.network;
    return network?.name || networkId;
  };

  const getAssetName = (symbol: string) => {
    const asset = updates.find(u => u.asset.symbol === symbol)?.asset;
    return asset?.name ? `${symbol} - ${asset.name}` : symbol;
  };

  const formatTimeRange = (timeRange: FilterState['timeRange']) => {
    switch (timeRange.preset) {
      case '24h':
        return 'Last 24 hours';
      case '7d':
        return 'Last 7 days';
      case '30d':
        return 'Last 30 days';
      case 'custom':
        if (timeRange.startDate && timeRange.endDate) {
          return `${timeRange.startDate.toLocaleDateString()} - ${timeRange.endDate.toLocaleDateString()}`;
        }
        if (timeRange.startDate) {
          return `From ${timeRange.startDate.toLocaleDateString()}`;
        }
        if (timeRange.endDate) {
          return `Until ${timeRange.endDate.toLocaleDateString()}`;
        }
        return 'Custom range';
      default:
        return timeRange.preset;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">Active filters ({activeFilterCount}):</span>
      </div>

      {/* Networks */}
      {filters.networks.map(networkId => (
        <FilterChip
          key={`network-${networkId}`}
          label={getNetworkName(networkId)}
          category="Network"
          onRemove={() => {
            const newNetworks = filters.networks.filter(id => id !== networkId);
            onUpdateFilter('networks', newNetworks);
          }}
        />
      ))}

      {/* Assets */}
      {filters.assets.map(symbol => (
        <FilterChip
          key={`asset-${symbol}`}
          label={getAssetName(symbol)}
          category="Asset"
          onRemove={() => {
            const newAssets = filters.assets.filter(s => s !== symbol);
            onUpdateFilter('assets', newAssets);
          }}
        />
      ))}

      {/* Parameters */}
      {filters.parameters.map(param => (
        <FilterChip
          key={`param-${param}`}
          label={param}
          category="Parameter"
          onRemove={() => {
            const newParams = filters.parameters.filter(p => p !== param);
            onUpdateFilter('parameters', newParams);
          }}
        />
      ))}

      {/* Steward Type */}
      {filters.stewardType !== 'all' && (
        <FilterChip
          label={filters.stewardType}
          category="Steward"
          onRemove={() => onClearFilter('stewardType')}
        />
      )}

      {/* Time Range */}
      {(filters.timeRange.preset !== '30d' || filters.timeRange.startDate) && (
        <FilterChip
          label={formatTimeRange(filters.timeRange)}
          category="Time"
          onRemove={() => onClearFilter('timeRange')}
        />
      )}

      {/* Status */}
      {filters.status.map(status => (
        <FilterChip
          key={`status-${status}`}
          label={status}
          category="Status"
          onRemove={() => {
            const newStatus = filters.status.filter(s => s !== status);
            onUpdateFilter('status', newStatus);
          }}
        />
      ))}

      {/* Search */}
      {filters.search && (
        <FilterChip
          label={`"${filters.search}"`}
          category="Search"
          onRemove={() => onClearFilter('search')}
        />
      )}

      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        className="ml-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
      >
        Clear All
      </button>
    </div>
  );
};

// Individual Filter Chip Component
interface FilterChipProps {
  label: string;
  category?: string;
  onRemove: () => void;
}

const FilterChip = ({ label, category, onRemove }: FilterChipProps) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 text-sm rounded-full border transition-colors",
      "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100"
    )}>
      {category && (
        <span className="text-xs font-medium text-blue-600">{category}:</span>
      )}
      <span className="max-w-32 truncate">{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors"
        aria-label={`Remove ${category} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
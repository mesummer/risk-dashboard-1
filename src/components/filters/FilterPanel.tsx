import { useState } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Calendar,
  Network,
  Coins,
  Settings,
  User,
  CheckCircle
} from 'lucide-react';
import type { FilterState, FilterOption, ParameterUpdate, ParameterType } from '../../types';
import { cn } from '../../utils';

interface FilterPanelProps {
  filters: FilterState;
  updates: ParameterUpdate[];
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterPanel = ({
  filters,
  updates,
  onFilterChange,
  onClearFilters,
  isOpen,
  onToggle
}: FilterPanelProps) => {
  const [expandedSections, setExpandedSections] = useState({
    networks: true,
    assets: true,
    parameters: false,
    stewardType: true,
    timeRange: true,
    status: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Generate filter options with counts
  const networkOptions: FilterOption[] = Array.from(
    new Set(updates.map(u => u.network.id))
  ).map(networkId => {
    const network = updates.find(u => u.network.id === networkId)?.network;
    const count = updates.filter(u => u.network.id === networkId).length;
    return {
      value: networkId,
      label: network?.name || networkId,
      count
    };
  });

  const assetOptions: FilterOption[] = Array.from(
    new Set(updates.map(u => u.asset.symbol))
  ).map(symbol => {
    const asset = updates.find(u => u.asset.symbol === symbol)?.asset;
    const count = updates.filter(u => u.asset.symbol === symbol).length;
    return {
      value: symbol,
      label: `${symbol} - ${asset?.name || ''}`,
      count
    };
  });

  const parameterOptions: FilterOption[] = Array.from(
    new Set(updates.map(u => u.parameter))
  ).map(param => {
    const count = updates.filter(u => u.parameter === param).length;
    return {
      value: param,
      label: param,
      count
    };
  });

  const statusOptions: FilterOption[] = [
    { value: 'Success', label: 'Success', count: updates.filter(u => u.status === 'Success').length },
    { value: 'Failed', label: 'Failed', count: updates.filter(u => u.status === 'Failed').length },
    { value: 'Pending', label: 'Pending', count: updates.filter(u => u.status === 'Pending').length },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Filter panel */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter content */}
        <div className="overflow-y-auto h-full pb-20">
          {/* Networks */}
          <FilterSection
            title="Networks"
            icon={Network}
            isExpanded={expandedSections.networks}
            onToggle={() => toggleSection('networks')}
          >
            <MultiSelectFilter
              options={networkOptions}
              selectedValues={filters.networks}
              onChange={(values) => onFilterChange('networks', values)}
            />
          </FilterSection>

          {/* Assets */}
          <FilterSection
            title="Assets"
            icon={Coins}
            isExpanded={expandedSections.assets}
            onToggle={() => toggleSection('assets')}
          >
            <MultiSelectFilter
              options={assetOptions}
              selectedValues={filters.assets}
              onChange={(values) => onFilterChange('assets', values)}
              searchable
            />
          </FilterSection>

          {/* Parameter Types */}
          <FilterSection
            title="Parameter Types"
            icon={Settings}
            isExpanded={expandedSections.parameters}
            onToggle={() => toggleSection('parameters')}
          >
            <MultiSelectFilter
              options={parameterOptions}
              selectedValues={filters.parameters}
              onChange={(values) => onFilterChange('parameters', values as ParameterType[])}
              searchable
            />
          </FilterSection>

          {/* Steward Type */}
          <FilterSection
            title="Steward Type"
            icon={User}
            isExpanded={expandedSections.stewardType}
            onToggle={() => toggleSection('stewardType')}
          >
            <RadioFilter
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'Manual', label: 'Manual' },
                { value: 'Automated', label: 'Automated' },
              ]}
              selectedValue={filters.stewardType}
              onChange={(value) => onFilterChange('stewardType', value as FilterState['stewardType'])}
            />
          </FilterSection>

          {/* Time Range */}
          <FilterSection
            title="Time Range"
            icon={Calendar}
            isExpanded={expandedSections.timeRange}
            onToggle={() => toggleSection('timeRange')}
          >
            <TimeRangeFilter
              timeRange={filters.timeRange}
              onChange={(value) => onFilterChange('timeRange', value)}
            />
          </FilterSection>

          {/* Status */}
          <FilterSection
            title="Status"
            icon={CheckCircle}
            isExpanded={expandedSections.status}
            onToggle={() => toggleSection('status')}
          >
            <MultiSelectFilter
              options={statusOptions}
              selectedValues={filters.status}
              onChange={(values) => onFilterChange('status', values as FilterState['status'])}
            />
          </FilterSection>
        </div>
      </div>
    </>
  );
};

// Filter Section Component
interface FilterSectionProps {
  title: string;
  icon: any;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection = ({ title, icon: Icon, isExpanded, onToggle, children }: FilterSectionProps) => (
  <div className="border-b border-gray-100">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-600" />
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      {isExpanded ? (
        <ChevronDown className="w-4 h-4 text-gray-600" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-600" />
      )}
    </button>
    {isExpanded && (
      <div className="px-4 pb-4">
        {children}
      </div>
    )}
  </div>
);

// Multi-select Filter Component
interface MultiSelectFilterProps {
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
}

const MultiSelectFilter = ({ options, selectedValues, onChange, searchable }: MultiSelectFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="space-y-2">
      {searchable && (
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
      <div className="max-h-40 overflow-y-auto space-y-1">
        {filteredOptions.map(option => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 flex-1">{option.label}</span>
            {option.count !== undefined && (
              <span className="text-xs text-gray-500">({option.count})</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

// Radio Filter Component
interface RadioFilterProps {
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioFilter = ({ options, selectedValue, onChange }: RadioFilterProps) => (
  <div className="space-y-2">
    {options.map(option => (
      <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
        <input
          type="radio"
          name="stewardType"
          value={option.value}
          checked={selectedValue === option.value}
          onChange={(e) => onChange(e.target.value)}
          className="border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{option.label}</span>
      </label>
    ))}
  </div>
);

// Time Range Filter Component
interface TimeRangeFilterProps {
  timeRange: FilterState['timeRange'];
  onChange: (timeRange: FilterState['timeRange']) => void;
}

const TimeRangeFilter = ({ timeRange, onChange }: TimeRangeFilterProps) => {
  const presetOptions = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'custom', label: 'Custom range' },
  ];

  return (
    <div className="space-y-3">
      {/* Preset options */}
      <div className="space-y-2">
        {presetOptions.map(option => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name="timeRange"
              value={option.value}
              checked={timeRange.preset === option.value}
              onChange={(e) => onChange({ preset: e.target.value as any })}
              className="border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      {/* Custom date inputs */}
      {timeRange.preset === 'custom' && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={timeRange.startDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => onChange({
                ...timeRange,
                startDate: e.target.value ? new Date(e.target.value) : undefined
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={timeRange.endDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => onChange({
                ...timeRange,
                endDate: e.target.value ? new Date(e.target.value) : undefined
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};
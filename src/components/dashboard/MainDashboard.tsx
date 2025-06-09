import { useState, useMemo } from 'react';
import { EnhancedUpdatesTimeline } from '../updates/EnhancedUpdatesTimeline';
import { UpdateChart } from '../charts/UpdateChart';
import { HeatmapView } from '../charts/HeatmapView';
import { StatsCards } from '../stats/StatsCards';
import { UpdateDetailModal } from '../modals/UpdateDetailModal';
import { ViewHeader } from '../navigation/ViewToggle';
import { useFiltersStandalone } from '../../hooks/useFilters';
import { useViewState } from '../../hooks/useViewState';
import type { ParameterUpdate } from '../../types';
import { cn } from '../../utils';

interface MainDashboardProps {
  updates: ParameterUpdate[];
  isLoading?: boolean;
  className?: string;
}

export const MainDashboard = ({ 
  updates, 
  isLoading = false,
  className 
}: MainDashboardProps) => {
  const { currentView, setCurrentView } = useViewState('timeline');
  const [selectedUpdate, setSelectedUpdate] = useState<ParameterUpdate | null>(null);
  
  // Use the standalone filters hook for this component
  const {
    filteredUpdates,
    hasActiveFilters,
    clearAllFilters
  } = useFiltersStandalone(updates);

  // Handle view-specific filtering (for chart and heatmap interactions)
  const handleTimeRangeFilter = (startDate: Date, endDate: Date) => {
    // This would integrate with the filters to add date range filtering
    console.log('Filter by date range:', startDate, endDate);
  };

  const handleAssetNetworkFilter = (asset: string, network: string) => {
    // This would integrate with the filters to add asset/network filtering
    console.log('Filter by asset/network:', asset, network);
  };

  const handleUpdateClick = (update: ParameterUpdate) => {
    setSelectedUpdate(update);
  };

  const handleCloseModal = () => {
    setSelectedUpdate(null);
  };

  // Get related updates for the modal
  const relatedUpdates = useMemo(() => {
    if (!selectedUpdate) return [];
    return filteredUpdates
      .filter(u => 
        u.id !== selectedUpdate.id &&
        (u.asset.symbol === selectedUpdate.asset.symbol ||
         u.network.id === selectedUpdate.network.id ||
         u.parameter === selectedUpdate.parameter)
      )
      .slice(0, 5);
  }, [selectedUpdate, filteredUpdates]);

  // Generate breadcrumb items based on current view and filters
  const breadcrumbItems = useMemo(() => {
    const items = [{ label: 'Dashboard' }];
    
    if (hasActiveFilters) {
      items.push({ label: 'Filtered Results' });
    }
    
    const viewLabels = {
      timeline: 'Timeline View',
      charts: 'Charts View',
      heatmap: 'Heatmap View'
    };
    
    items.push({ 
      label: viewLabels[currentView]
    });
    
    return items;
  }, [currentView, hasActiveFilters]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'timeline':
        return (
          <EnhancedUpdatesTimeline
            updates={filteredUpdates}
            onUpdateClick={handleUpdateClick}
            isLoading={isLoading}
          />
        );
      
      case 'charts':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Activity Timeline
              </h3>
              <UpdateChart 
                updates={filteredUpdates}
                height={400}
                onTimeRangeClick={handleTimeRangeFilter}
              />
            </div>
          </div>
        );
      
      case 'heatmap':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <HeatmapView 
              updates={filteredUpdates}
              onCellClick={handleAssetNetworkFilter}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <ViewHeader
          currentView={currentView}
          onViewChange={setCurrentView}
          breadcrumbItems={breadcrumbItems}
          title="Parameter Updates Dashboard"
          subtitle={`Monitoring ${filteredUpdates.length} updates across DeFi protocols`}
          actions={
            <div className="flex items-center gap-3">
              
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* Stats Cards - Show for all views */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <StatsCards updates={filteredUpdates} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </div>

      {/* Update Detail Modal */}
      <UpdateDetailModal
        update={selectedUpdate}
        onClose={handleCloseModal}
        relatedUpdates={relatedUpdates}
      />
    </div>
  );
};
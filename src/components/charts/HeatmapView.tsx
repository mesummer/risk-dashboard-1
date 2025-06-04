import { useState, useMemo } from 'react';
import { formatRelativeTime, cn } from '../../utils';
import type { ParameterUpdate, HeatmapDataPoint } from '../../types';
import { generateHeatmapData } from '../../data/mockData';

interface HeatmapViewProps {
  updates: ParameterUpdate[];
  onCellClick?: (asset: string, network: string) => void;
}

export const HeatmapView = ({ updates, onCellClick }: HeatmapViewProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ asset: string; network: string } | null>(null);

  const heatmapData = useMemo(() => generateHeatmapData(updates), [updates]);

  // Get unique assets and networks
  const assets = useMemo(() => 
    Array.from(new Set(heatmapData.map(d => d.asset))).sort(), 
    [heatmapData]
  );
  
  const networks = useMemo(() => 
    Array.from(new Set(heatmapData.map(d => d.network))).sort(), 
    [heatmapData]
  );

  // Create a map for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, HeatmapDataPoint>();
    heatmapData.forEach(d => {
      map.set(`${d.asset}-${d.network}`, d);
    });
    return map;
  }, [heatmapData]);

  // Calculate intensity levels
  const maxCount = useMemo(() => 
    Math.max(...heatmapData.map(d => d.count), 1), 
    [heatmapData]
  );

  const getIntensityLevel = (count: number): number => {
    if (count === 0) return 0;
    return Math.min(Math.ceil((count / maxCount) * 5), 5);
  };

  const getIntensityColor = (level: number): string => {
    const colors = [
      'bg-gray-100', // 0 - no activity
      'bg-blue-100', // 1 - very low
      'bg-blue-200', // 2 - low
      'bg-blue-400', // 3 - medium
      'bg-blue-600', // 4 - high
      'bg-blue-800', // 5 - very high
    ];
    return colors[level] || colors[0];
  };

  const getTextColor = (level: number): string => {
    return level >= 4 ? 'text-white' : 'text-gray-900';
  };

  const getCellData = (asset: string, network: string): HeatmapDataPoint | null => {
    return dataMap.get(`${asset}-${network}`) || null;
  };

  const handleCellClick = (asset: string, network: string) => {
    onCellClick?.(asset, network);
  };

  const handleCellHover = (asset: string, network: string) => {
    setHoveredCell({ asset, network });
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  if (assets.length === 0 || networks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">No updates found for the heatmap visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Update Activity by Asset and Network
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Less</span>
          {[0, 1, 2, 3, 4, 5].map(level => (
            <div
              key={level}
              className={cn("w-4 h-4 rounded border border-gray-300", getIntensityColor(level))}
              title={`Intensity level ${level}`}
            />
          ))}
          <span className="text-sm text-gray-600">More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${networks.length}, 1fr)` }}>
            {/* Header row */}
            <div></div>
            {networks.map(network => (
              <div 
                key={network} 
                className="p-2 text-xs font-medium text-gray-600 text-center min-w-[80px]"
              >
                {network}
              </div>
            ))}

            {/* Data rows */}
            {assets.map(asset => (
              <>
                {/* Row header */}
                <div 
                  key={`${asset}-header`}
                  className="p-2 text-sm font-medium text-gray-900 flex items-center"
                >
                  {asset}
                </div>

                {/* Data cells */}
                {networks.map(network => {
                  const cellData = getCellData(asset, network);
                  const count = cellData?.count || 0;
                  const intensityLevel = getIntensityLevel(count);
                  const isHovered = hoveredCell?.asset === asset && hoveredCell?.network === network;

                  return (
                    <div
                      key={`${asset}-${network}`}
                      className={cn(
                        "relative p-2 text-xs text-center border border-gray-200 rounded min-h-[60px] flex flex-col justify-center transition-all duration-200 cursor-pointer",
                        getIntensityColor(intensityLevel),
                        getTextColor(intensityLevel),
                        isHovered && "ring-2 ring-blue-500 transform scale-105 z-10",
                        count > 0 && "hover:ring-2 hover:ring-blue-400"
                      )}
                      onClick={() => handleCellClick(asset, network)}
                      onMouseEnter={() => handleCellHover(asset, network)}
                      onMouseLeave={handleCellLeave}
                    >
                      {count > 0 && (
                        <>
                          <div className="font-medium">{count}</div>
                          <div className="text-xs opacity-80">
                            {count === 1 ? 'update' : 'updates'}
                          </div>
                        </>
                      )}

                      {/* Tooltip */}
                      {isHovered && cellData && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium mb-2">
                              {asset} on {network}
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div>Updates: {cellData.count}</div>
                              <div>Last update: {formatRelativeTime(cellData.lastUpdate)}</div>
                            </div>
                            <div className="mt-2 text-xs text-blue-600">
                              Click to filter
                            </div>
                          </div>
                          {/* Arrow */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-white"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{heatmapData.length}</div>
          <div className="text-gray-600">Active Combinations</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{assets.length}</div>
          <div className="text-gray-600">Assets</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{networks.length}</div>
          <div className="text-gray-600">Networks</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{updates.length}</div>
          <div className="text-gray-600">Total Updates</div>
        </div>
      </div>

      {/* Most Active Combinations */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Most Active Combinations</h4>
        <div className="space-y-2">
          {heatmapData
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map(({ asset, network, count, lastUpdate }) => (
              <div 
                key={`${asset}-${network}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleCellClick(asset, network)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-4 h-4 rounded border border-gray-300",
                    getIntensityColor(getIntensityLevel(count))
                  )} />
                  <div>
                    <div className="font-medium text-sm">{asset} on {network}</div>
                    <div className="text-xs text-gray-600">
                      Last update: {formatRelativeTime(lastUpdate)}
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {count}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
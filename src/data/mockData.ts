import type { 
  ParameterUpdate, 
  Asset, 
  Network, 
  ParameterType, 
  Impact, 
  MarketContext, 
  ValidationRule,
  ChartDataPoint,
  HeatmapDataPoint,
  StatsData,
  RiskStewardInfo,
  ChangeRange
} from '../types';

export const networks: Network[] = [
  { id: 'ethereum', name: 'Ethereum', chainId: 1, icon: '🔷' },
  { id: 'polygon', name: 'Polygon', chainId: 137, icon: '🟣' },
  { id: 'arbitrum', name: 'Arbitrum', chainId: 42161, icon: '🔵' },
  { id: 'optimism', name: 'Optimism', chainId: 10, icon: '🔴' },
  { id: 'base', name: 'Base', chainId: 8453, icon: '🔵' },
];

export const assets: Asset[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '🔷' },
  { symbol: 'USDC', name: 'USD Coin', icon: '🟢' },
  { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🟡' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '🟠' },
  { symbol: 'USDT', name: 'Tether USD', icon: '🟢' },
  { symbol: 'AAVE', name: 'Aave Token', icon: '👻' },
  { symbol: 'LINK', name: 'Chainlink', icon: '🔗' },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄' },
  { symbol: 'MATIC', name: 'Polygon', icon: '🟣' },
  { symbol: 'ARB', name: 'Arbitrum', icon: '🔵' },
];

const parameterTypes: ParameterType[] = [
  'Supply Cap',
  'Borrow Cap',
  'uOptimal',
  'Base Rate',
  'Slope1',
  'Slope2',
  'LTV',
  'LT',
  'LB',
  'E Mode LTV',
  'E Mode LT',
  'E Mode LB',
  'Pendle Capo Discount Rate',
  'Capo Price Caps'
];

const generateRandomUpdate = (id: number): ParameterUpdate => {
  const network = networks[Math.floor(Math.random() * networks.length)];
  const asset = assets[Math.floor(Math.random() * assets.length)];
  const parameter = parameterTypes[Math.floor(Math.random() * parameterTypes.length)];
  const stewardType = Math.random() > 0.6 ? 'Automated' : 'Manual';
  const status = Math.random() > 0.9 ? 'Failed' : Math.random() > 0.95 ? 'Pending' : 'Success';
  
  // Generate enhanced data
  const impact = generateImpact(parameter);
  const marketContext = generateMarketContext(asset);
  const validationRules = generateValidationRules(parameter, status);
  const relatedUpdates = generateRelatedUpdates(id);
  
  // Generate realistic parameter values based on type
  const getParameterValues = (param: ParameterType) => {
    switch (param) {
      case 'Supply Cap':
        return {
          old: `${(Math.random() * 100000000).toFixed(0)} ${asset.symbol}`,
          new: `${(Math.random() * 100000000).toFixed(0)} ${asset.symbol}`
        };
      case 'Borrow Cap':
        return {
          old: `${(Math.random() * 50000000).toFixed(0)} ${asset.symbol}`,
          new: `${(Math.random() * 50000000).toFixed(0)} ${asset.symbol}`
        };
      case 'uOptimal':
      case 'LTV':
      case 'LT':
      case 'LB':
      case 'E Mode LTV':
      case 'E Mode LT':
      case 'E Mode LB':
        return {
          old: `${(Math.random() * 100).toFixed(1)}%`,
          new: `${(Math.random() * 100).toFixed(1)}%`
        };
      case 'Base Rate':
      case 'Slope1':
      case 'Slope2':
      case 'Pendle Capo Discount Rate':
        return {
          old: `${(Math.random() * 20).toFixed(2)}%`,
          new: `${(Math.random() * 20).toFixed(2)}%`
        };
      case 'Capo Price Caps':
        return {
          old: `$${(Math.random() * 10000).toFixed(2)}`,
          new: `$${(Math.random() * 10000).toFixed(2)}`
        };
      default:
        return {
          old: `${(Math.random() * 100).toFixed(2)}`,
          new: `${(Math.random() * 100).toFixed(2)}`
        };
    }
  };

  const values = getParameterValues(parameter);
  
  // Generate timestamp within last 30 days
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const timestamp = new Date(now);
  timestamp.setDate(timestamp.getDate() - daysAgo);
  timestamp.setHours(timestamp.getHours() - hoursAgo);
  timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

  // Generate risk steward info now that timestamp is available
  const riskStewardInfo = generateRiskStewardInfo(parameter, timestamp);

  return {
    id: `update-${id}`,
    timestamp,
    network,
    asset,
    parameter,
    stewardType,
    oldValue: values.old,
    newValue: values.new,
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    status,
    initiator: stewardType === 'Manual' ? `0x${Math.random().toString(16).substring(2, 42)}` : undefined,
    blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
    gasUsed: `${Math.floor(Math.random() * 200000) + 50000}`,
    gasPrice: `${(Math.random() * 50 + 20).toFixed(2)} gwei`,
    reason: generateReason(parameter, stewardType),
    impact,
    marketContext,
    relatedUpdates,
    validationRules,
    riskStewardInfo,
  };
};

// Generate 75 sample updates
export const mockUpdates: ParameterUpdate[] = Array.from({ length: 75 }, (_, i) => 
  generateRandomUpdate(i + 1)
).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

// Helper function to get today's updates
export const getTodaysUpdates = (): ParameterUpdate[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return mockUpdates.filter(update => {
    const updateDate = new Date(update.timestamp);
    updateDate.setHours(0, 0, 0, 0);
    return updateDate.getTime() === today.getTime();
  });
};

// Helper functions for generating enhanced data
function generateImpact(parameter: ParameterType): Impact {
  const criticalParams = ['Supply Cap', 'Borrow Cap', 'LTV', 'LT'];
  const isCritical = criticalParams.includes(parameter);
  
  const riskLevels: Impact['riskLevel'][] = isCritical 
    ? ['Medium', 'High', 'Critical']
    : ['Low', 'Medium'];
  
  const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
  
  return {
    riskLevel,
    description: getImpactDescription(parameter, riskLevel),
    affectedUsers: Math.floor(Math.random() * 10000) + 100,
    protocolTvl: `$${(Math.random() * 500 + 50).toFixed(1)}M`,
    estimatedImpact: `${(Math.random() * 5 + 0.1).toFixed(2)}%`,
  };
}

function generateMarketContext(asset: Asset): MarketContext {
  return {
    priceChange24h: (Math.random() - 0.5) * 20, // -10% to +10%
    volume24h: `$${(Math.random() * 100 + 10).toFixed(1)}M`,
    marketCap: `$${(Math.random() * 1000 + 100).toFixed(1)}M`,
    totalSupply: `${(Math.random() * 1000000 + 100000).toFixed(0)} ${asset.symbol}`,
    utilizationRate: Math.random() * 100,
    averageApr: Math.random() * 15 + 2,
  };
}

function generateValidationRules(parameter: ParameterType, status: string): ValidationRule[] {
  const baseRules: ValidationRule[] = [
    { rule: 'Range Validation', status: 'Passed', description: 'Value within acceptable range' },
    { rule: 'Authorization Check', status: 'Passed', description: 'Caller has required permissions' },
    { rule: 'Time Lock Compliance', status: 'Passed', description: 'Time lock period respected' },
  ];
  
  if (status === 'Failed') {
    const randomIndex = Math.floor(Math.random() * baseRules.length);
    baseRules[randomIndex] = { ...baseRules[randomIndex], status: 'Failed' };
  }
  
  if (parameter.includes('Cap')) {
    baseRules.push({
      rule: 'Liquidity Impact',
      status: Math.random() > 0.8 ? 'Warning' : 'Passed',
      description: 'Change impact on protocol liquidity assessed'
    });
  }
  
  return baseRules;
}

function generateRelatedUpdates(currentId: number): string[] {
  const relatedCount = Math.floor(Math.random() * 3);
  const related: string[] = [];
  
  for (let i = 0; i < relatedCount; i++) {
    const relatedId = Math.floor(Math.random() * 75) + 1;
    if (relatedId !== currentId) {
      related.push(`update-${relatedId}`);
    }
  }
  
  return related;
}

function generateReason(_parameter: ParameterType, stewardType: string): string {
  const reasons = stewardType === 'Automated' ? [
    'Market volatility threshold exceeded',
    'Utilization rate optimization',
    'Risk model adjustment',
    'Automated rebalancing trigger',
    'Protocol safety mechanism',
  ] : [
    'Community governance proposal',
    'Risk committee recommendation',
    'Emergency protocol action',
    'Strategic parameter adjustment',
    'Market condition response',
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
}

function getImpactDescription(parameter: ParameterType, riskLevel: Impact['riskLevel']): string {
  const descriptions = {
    'Supply Cap': {
      Low: 'Minor adjustment to supply limit with minimal market impact',
      Medium: 'Moderate supply cap change affecting borrowing capacity',
      High: 'Significant supply restriction impacting protocol liquidity',
      Critical: 'Major supply cap reduction with severe market implications'
    },
    'LTV': {
      Low: 'Small collateral ratio adjustment',
      Medium: 'Moderate LTV change affecting borrowing power',
      High: 'Significant collateral requirement increase',
      Critical: 'Major LTV reduction triggering liquidation risk'
    },
    // Add more as needed
  };
  
  return descriptions[parameter as keyof typeof descriptions]?.[riskLevel] || 
    `${riskLevel} impact parameter adjustment for ${parameter}`;
}

function generateRiskStewardInfo(parameter: ParameterType, lastModificationTime: Date): RiskStewardInfo {
  // Determine allowed steward type based on parameter criticality
  const criticalParams = ['Supply Cap', 'Borrow Cap', 'LTV', 'LT', 'LB'];
  const allowedStewardType = criticalParams.includes(parameter) 
    ? (Math.random() > 0.7 ? 'Manual' : 'Both')
    : (Math.random() > 0.3 ? 'Automated' : 'Both');

  // Generate last modifier (address for manual, system for automated)
  const lastModifier = Math.random() > 0.6 
    ? `0x${Math.random().toString(16).substring(2, 42)}`
    : 'System Automated Steward';

  // Calculate if modification is allowed (72-hour rule)
  const now = new Date();
  const hoursSinceLastModification = (now.getTime() - lastModificationTime.getTime()) / (1000 * 60 * 60);
  const canBeModified = hoursSinceLastModification >= 72;
  const timeUntilModificationAllowed = canBeModified ? undefined : Math.ceil(72 - hoursSinceLastModification);

  // Generate allowed change range based on parameter type
  const allowedChangeRange = generateChangeRange(parameter);

  return {
    allowedStewardType,
    lastModifier,
    lastModificationTime,
    canBeModified,
    timeUntilModificationAllowed,
    allowedChangeRange,
  };
}

function generateChangeRange(parameter: ParameterType): ChangeRange {
  switch (parameter) {
    case 'Supply Cap':
    case 'Borrow Cap':
      return {
        percentage: { min: -50, max: 100 },
        absolute: { 
          min: '1000000', 
          max: '100000000', 
          unit: 'tokens' 
        }
      };
    case 'LTV':
    case 'LT':
    case 'LB':
    case 'E Mode LTV':
    case 'E Mode LT':
    case 'E Mode LB':
    case 'uOptimal':
      return {
        percentage: { min: -10, max: 10 },
        absolute: { 
          min: '0.1', 
          max: '95.0', 
          unit: '%' 
        }
      };
    case 'Base Rate':
    case 'Slope1':
    case 'Slope2':
    case 'Pendle Capo Discount Rate':
      return {
        percentage: { min: -25, max: 50 },
        absolute: { 
          min: '0.01', 
          max: '20.0', 
          unit: '%' 
        }
      };
    case 'Capo Price Caps':
      return {
        percentage: { min: -30, max: 30 },
        absolute: { 
          min: '100', 
          max: '50000', 
          unit: 'USD' 
        }
      };
    default:
      return {
        percentage: { min: -20, max: 20 },
        absolute: { 
          min: '1', 
          max: '1000', 
          unit: 'units' 
        }
      };
  }
}

// Helper function to calculate dashboard stats
export const getDashboardStats = () => {
  const todaysUpdates = getTodaysUpdates();
  const uniqueNetworks = new Set(mockUpdates.map(u => u.network.id)).size;
  
  return {
    totalUpdatesToday: todaysUpdates.length,
    activeNetworks: uniqueNetworks,
    manualUpdates: mockUpdates.filter(u => u.stewardType === 'Manual').length,
    automatedUpdates: mockUpdates.filter(u => u.stewardType === 'Automated').length,
    successfulUpdates: mockUpdates.filter(u => u.status === 'Success').length,
    failedUpdates: mockUpdates.filter(u => u.status === 'Failed').length,
  };
};

// Generate chart data for timeline visualization
export const generateChartData = (updates: ParameterUpdate[]): ChartDataPoint[] => {
  const chartData: { [key: string]: ChartDataPoint } = {};
  
  // Generate data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const dateKey = date.toISOString().split('T')[0];
    chartData[dateKey] = {
      date,
      count: 0,
      manual: 0,
      automated: 0,
    };
  }
  
  // Populate with actual update data
  updates.forEach(update => {
    const dateKey = update.timestamp.toISOString().split('T')[0];
    if (chartData[dateKey]) {
      chartData[dateKey].count++;
      if (update.stewardType === 'Manual') {
        chartData[dateKey].manual++;
      } else {
        chartData[dateKey].automated++;
      }
    }
  });
  
  return Object.values(chartData).sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Generate heatmap data
export const generateHeatmapData = (updates: ParameterUpdate[]): HeatmapDataPoint[] => {
  const heatmapData: { [key: string]: HeatmapDataPoint } = {};
  
  updates.forEach(update => {
    const key = `${update.asset.symbol}-${update.network.id}`;
    if (!heatmapData[key]) {
      heatmapData[key] = {
        asset: update.asset.symbol,
        network: update.network.name,
        count: 0,
        lastUpdate: update.timestamp,
      };
    }
    heatmapData[key].count++;
    if (update.timestamp > heatmapData[key].lastUpdate) {
      heatmapData[key].lastUpdate = update.timestamp;
    }
  });
  
  return Object.values(heatmapData);
};

// Calculate enhanced stats
export const calculateStats = (updates: ParameterUpdate[]): StatsData => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysUpdates = updates.filter(u => {
    const updateDate = new Date(u.timestamp);
    updateDate.setHours(0, 0, 0, 0);
    return updateDate.getTime() === today.getTime();
  });
  
  // Most active asset
  const assetCounts: { [key: string]: number } = {};
  updates.forEach(u => {
    assetCounts[u.asset.symbol] = (assetCounts[u.asset.symbol] || 0) + 1;
  });
  const mostActiveAsset = Object.entries(assetCounts).reduce((max, [symbol, count]) => 
    count > max.count ? { symbol, count } : max, { symbol: '', count: 0 });
  
  // Most active network
  const networkCounts: { [key: string]: number } = {};
  updates.forEach(u => {
    networkCounts[u.network.name] = (networkCounts[u.network.name] || 0) + 1;
  });
  const mostActiveNetwork = Object.entries(networkCounts).reduce((max, [name, count]) => 
    count > max.count ? { name, count } : max, { name: '', count: 0 });
  
  // Average time between updates (in hours)
  const sortedUpdates = [...updates].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  let totalTimeDiff = 0;
  for (let i = 1; i < sortedUpdates.length; i++) {
    totalTimeDiff += sortedUpdates[i].timestamp.getTime() - sortedUpdates[i-1].timestamp.getTime();
  }
  const averageTimeBetween = sortedUpdates.length > 1 ? 
    totalTimeDiff / (sortedUpdates.length - 1) / (1000 * 60 * 60) : 0;
  
  // Other calculations
  const successfulUpdates = updates.filter(u => u.status === 'Success').length;
  const automatedUpdates = updates.filter(u => u.stewardType === 'Automated').length;
  const criticalUpdates = updates.filter(u => u.impact?.riskLevel === 'Critical').length;
  
  return {
    totalUpdates: updates.length,
    totalToday: todaysUpdates.length,
    mostActiveAsset,
    mostActiveNetwork,
    averageTimeBetween,
    successRate: updates.length > 0 ? (successfulUpdates / updates.length) * 100 : 0,
    automationRate: updates.length > 0 ? (automatedUpdates / updates.length) * 100 : 0,
    criticalUpdates,
  };
};
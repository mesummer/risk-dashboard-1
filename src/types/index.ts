export interface ParameterUpdate {
  id: string;
  timestamp: Date;
  network: Network;
  asset: Asset;
  parameter: ParameterType;
  stewardType: 'Manual' | 'Automated';
  oldValue: string;
  newValue: string;
  transactionHash: string;
  status: 'Success' | 'Failed' | 'Pending';
  initiator?: string;
  // Enhanced data for detailed views
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  reason?: string;
  impact?: Impact;
  marketContext?: MarketContext;
  relatedUpdates?: string[];
  validationRules?: ValidationRule[];
  // Risk steward information
  riskStewardInfo?: RiskStewardInfo;
}

export interface Asset {
  symbol: string;
  name: string;
  icon?: string;
}

export interface Network {
  id: string;
  name: string;
  chainId: number;
  icon?: string;
}

export type ParameterType = 
  | 'Supply Cap' 
  | 'Borrow Cap' 
  | 'uOptimal' 
  | 'Base Rate' 
  | 'Slope1' 
  | 'Slope2' 
  | 'LTV' 
  | 'LT' 
  | 'LB' 
  | 'E Mode LTV' 
  | 'E Mode LT' 
  | 'E Mode LB' 
  | 'Pendle Capo Discount Rate' 
  | 'Capo Price Caps';

export interface DashboardStats {
  totalUpdatesToday: number;
  activeNetworks: number;
  manualUpdates: number;
  automatedUpdates: number;
  successfulUpdates: number;
  failedUpdates: number;
}

export interface FilterState {
  networks: string[];
  assets: string[];
  parameters: ParameterType[];
  stewardType: 'all' | 'Manual' | 'Automated';
  timeRange: TimeRange;
  status: ('Success' | 'Failed' | 'Pending')[];
  search: string;
}

export interface TimeRange {
  preset: '24h' | '7d' | '30d' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SearchSuggestion {
  type: 'asset' | 'parameter' | 'network' | 'hash';
  value: string;
  label: string;
}

export interface Impact {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  affectedUsers?: number;
  protocolTvl?: string;
  estimatedImpact?: string;
}

export interface MarketContext {
  priceChange24h?: number;
  volume24h?: string;
  marketCap?: string;
  totalSupply?: string;
  utilizationRate?: number;
  averageApr?: number;
}

export interface ValidationRule {
  rule: string;
  status: 'Passed' | 'Failed' | 'Warning';
  description: string;
}

export interface RiskStewardInfo {
  allowedStewardType: 'Manual' | 'Automated' | 'Both';
  lastModifier: string; // Address or identifier of last modifier
  lastModificationTime: Date;
  canBeModified: boolean;
  timeUntilModificationAllowed?: number; // Hours remaining if cannot be modified
  allowedChangeRange: ChangeRange;
}

export interface ChangeRange {
  percentage: {
    min: number;
    max: number;
  };
  absolute: {
    min: string;
    max: string;
    unit: string;
  };
}

export interface ChartDataPoint {
  date: Date;
  count: number;
  manual: number;
  automated: number;
}

export interface HeatmapDataPoint {
  asset: string;
  network: string;
  count: number;
  lastUpdate: Date;
}

export type ViewMode = 'timeline' | 'heatmap' | 'charts';

export interface StatsData {
  totalUpdates: number;
  totalToday: number;
  mostActiveAsset: { symbol: string; count: number };
  mostActiveNetwork: { name: string; count: number };
  averageTimeBetween: number; // in hours
  successRate: number;
  automationRate: number;
  criticalUpdates: number;
}
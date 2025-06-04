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
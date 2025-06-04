import type { ParameterUpdate, Asset, Network, ParameterType } from '../types';

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
import { format, formatDistanceToNow } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy HH:mm');
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function truncateHash(hash: string, startChars = 6, endChars = 4): string {
  if (hash.length <= startChars + endChars) return hash;
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}

export function getStatusColor(status: 'Success' | 'Failed' | 'Pending'): string {
  switch (status) {
    case 'Success':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Failed':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStewardTypeColor(stewardType: 'Manual' | 'Automated'): string {
  switch (stewardType) {
    case 'Manual':
      return 'text-manual-600 bg-manual-50 border-manual-200';
    case 'Automated':
      return 'text-automated-600 bg-automated-50 border-automated-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}
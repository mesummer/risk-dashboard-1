import type { RiskStewardInfo } from '../../types';
import { Badge } from '../ui/Badge';

interface RiskStewardInfoProps {
  riskStewardInfo: RiskStewardInfo;
}

export function RiskStewardInfoComponent({ riskStewardInfo }: RiskStewardInfoProps) {
  const formatAddress = (address: string) => {
    if (address.startsWith('0x')) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };

  const formatTimeRemaining = (hours: number) => {
    if (hours < 1) {
      return `${Math.ceil(hours * 60)} minutes`;
    }
    if (hours < 24) {
      return `${Math.ceil(hours)} hours`;
    }
    return `${Math.ceil(hours / 24)} days`;
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-semibold text-gray-900">Risk Steward Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Steward Type */}
        <div>
          <label className="text-sm font-medium text-gray-600">Allowed Steward Type</label>
          <div className="mt-1">
            <Badge 
              variant={
                riskStewardInfo.allowedStewardType === 'Manual' ? 'warning' :
                riskStewardInfo.allowedStewardType === 'Automated' ? 'success' : 'default'
              }
            >
              {riskStewardInfo.allowedStewardType}
            </Badge>
          </div>
        </div>

        {/* Last Modifier */}
        <div>
          <label className="text-sm font-medium text-gray-600">Last Modifier</label>
          <div className="mt-1 font-mono text-sm text-gray-900">
            {formatAddress(riskStewardInfo.lastModifier)}
          </div>
        </div>

        {/* Modification Availability */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Modification Availability</label>
          <div className="mt-1 flex items-center gap-2">
            <Badge 
              variant={riskStewardInfo.canBeModified ? 'success' : 'danger'}
            >
              {riskStewardInfo.canBeModified ? 'Can be modified' : 'Cannot be modified'}
            </Badge>
            {!riskStewardInfo.canBeModified && riskStewardInfo.timeUntilModificationAllowed && (
              <span className="text-sm text-gray-600">
                (Available in {formatTimeRemaining(riskStewardInfo.timeUntilModificationAllowed)})
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Last modified: {riskStewardInfo.lastModificationTime.toLocaleString()}
          </div>
        </div>

        {/* Allowed Change Range */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Allowed Change Range</label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Percentage Range */}
            <div className="bg-white p-3 rounded border">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Percentage</div>
              <div className="mt-1 text-sm text-gray-900">
                {riskStewardInfo.allowedChangeRange.percentage.min}% to {riskStewardInfo.allowedChangeRange.percentage.max}%
              </div>
            </div>

            {/* Absolute Range */}
            <div className="bg-white p-3 rounded border">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Absolute</div>
              <div className="mt-1 text-sm text-gray-900">
                {riskStewardInfo.allowedChangeRange.absolute.min} - {riskStewardInfo.allowedChangeRange.absolute.max} {riskStewardInfo.allowedChangeRange.absolute.unit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
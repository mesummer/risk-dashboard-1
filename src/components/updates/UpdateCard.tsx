import { ArrowRight, Clock, CheckCircle, XCircle, AlertCircle, ExternalLink, Lock, Unlock } from 'lucide-react';
import type { ParameterUpdate } from '../../types';
import { formatRelativeTime, truncateHash, getStatusColor, getStewardTypeColor, cn } from '../../utils';

interface UpdateCardProps {
  update: ParameterUpdate;
  onClick?: () => void;
}

export const UpdateCard = ({ update, onClick }: UpdateCardProps) => {
  const statusColor = getStatusColor(update.status);
  const stewardTypeColor = getStewardTypeColor(update.stewardType);

  const getStatusIcon = () => {
    switch (update.status) {
      case 'Success':
        return <CheckCircle className="w-4 h-4" />;
      case 'Failed':
        return <XCircle className="w-4 h-4" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer",
        onClick && "hover:border-gray-300"
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{update.network.icon}</span>
          <div>
            <div className="font-medium text-gray-900">{update.network.name}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(update.timestamp)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full border inline-flex items-center gap-1",
              statusColor
            )}
          >
            {getStatusIcon()}
            {update.status}
          </span>
        </div>
      </div>

      {/* Asset and Parameter */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{update.asset.icon}</span>
          <span className="font-medium text-gray-900">{update.asset.symbol}</span>
          <span className="text-gray-500">•</span>
          <span className="text-sm text-gray-600">{update.parameter}</span>
        </div>
      </div>

      {/* Value Change */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-1 bg-gray-100 rounded font-mono">{update.oldValue}</span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span className="px-2 py-1 bg-blue-50 border border-blue-200 rounded font-mono text-blue-700">
            {update.newValue}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full border inline-flex items-center gap-1",
              stewardTypeColor
            )}
          >
            {update.stewardType}
          </span>
          {update.riskStewardInfo && (
            <span 
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border",
                update.riskStewardInfo.canBeModified 
                  ? "text-green-600 bg-green-50 border-green-200"
                  : "text-orange-600 bg-orange-50 border-orange-200"
              )}
              title={update.riskStewardInfo.canBeModified 
                ? "Can be modified" 
                : `Locked for ${update.riskStewardInfo.timeUntilModificationAllowed}h`
              }
            >
              {update.riskStewardInfo.canBeModified ? (
                <Unlock className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              {update.riskStewardInfo.canBeModified ? 'Unlocked' : 'Locked'}
            </span>
          )}
          {update.initiator && (
            <span className="text-xs text-gray-500 font-mono">
              by {truncateHash(update.initiator)}
            </span>
          )}
        </div>
        
        <button
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            // Open transaction in explorer
            console.log('Open transaction:', update.transactionHash);
          }}
        >
          <ExternalLink className="w-3 h-3" />
          {truncateHash(update.transactionHash)}
        </button>
      </div>
    </div>
  );
};
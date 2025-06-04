import { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Shield,
  Info
} from 'lucide-react';
import type { ParameterUpdate } from '../../types';
import { formatDate, formatRelativeTime, truncateHash, cn } from '../../utils';

interface UpdateDetailModalProps {
  update: ParameterUpdate | null;
  onClose: () => void;
  relatedUpdates?: ParameterUpdate[];
}

export const UpdateDetailModal = ({ 
  update, 
  onClose, 
  relatedUpdates = [] 
}: UpdateDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'context' | 'technical'>('overview');

  if (!update) return null;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Info },
    { id: 'context' as const, label: 'Context', icon: Activity },
    { id: 'technical' as const, label: 'Technical', icon: Shield },
  ];

  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'Critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'High':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getValidationIcon = (status: string) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Failed':
        return <X className="w-4 h-4 text-red-600" />;
      case 'Warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{update.network.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {update.asset.symbol} {update.parameter}
              </h2>
              <p className="text-sm text-gray-600">
                {update.network.name} • {formatRelativeTime(update.timestamp)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <OverviewTab update={update} />
          )}
          {activeTab === 'context' && (
            <ContextTab update={update} relatedUpdates={relatedUpdates} />
          )}
          {activeTab === 'technical' && (
            <TechnicalTab update={update} />
          )}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ update }: { update: ParameterUpdate }) => {
  const getRiskLevelColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Transaction Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard
            label="Transaction Hash"
            value={
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{truncateHash(update.transactionHash, 8, 6)}</span>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>
            }
          />
          <DetailCard label="Block Number" value={update.blockNumber?.toLocaleString()} />
          <DetailCard label="Gas Used" value={update.gasUsed} />
          <DetailCard label="Gas Price" value={update.gasPrice} />
          <DetailCard label="Status" value={
            <span className={cn("px-2 py-1 text-xs font-medium rounded-full border", 
              update.status === 'Success' ? 'text-green-600 bg-green-50 border-green-200' :
              update.status === 'Failed' ? 'text-red-600 bg-red-50 border-red-200' :
              'text-yellow-600 bg-yellow-50 border-yellow-200'
            )}>
              {update.status}
            </span>
          } />
          <DetailCard label="Steward Type" value={
            <span className={cn("px-2 py-1 text-xs font-medium rounded-full border",
              update.stewardType === 'Manual' ? 'text-blue-600 bg-blue-50 border-blue-200' :
              'text-green-600 bg-green-50 border-green-200'
            )}>
              {update.stewardType}
            </span>
          } />
        </div>
      </div>

      {/* Parameter Change */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameter Change</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Previous Value</p>
              <p className="text-lg font-semibold text-gray-900 font-mono">{update.oldValue}</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                →
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">New Value</p>
              <p className="text-lg font-semibold text-blue-600 font-mono">{update.newValue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Assessment */}
      {update.impact && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Assessment</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <span className={cn("px-3 py-1 text-sm font-medium rounded-full border", 
                getRiskLevelColor(update.impact.riskLevel))}>
                {update.impact.riskLevel} Risk
              </span>
            </div>
            <p className="text-gray-700 mb-4">{update.impact.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {update.impact.affectedUsers && (
                <div className="text-center">
                  <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Affected Users</p>
                  <p className="font-semibold">{update.impact.affectedUsers.toLocaleString()}</p>
                </div>
              )}
              {update.impact.protocolTvl && (
                <div className="text-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Protocol TVL</p>
                  <p className="font-semibold">{update.impact.protocolTvl}</p>
                </div>
              )}
              {update.impact.estimatedImpact && (
                <div className="text-center">
                  <TrendingUp className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Est. Impact</p>
                  <p className="font-semibold">{update.impact.estimatedImpact}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reason */}
      {update.reason && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reason</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">{update.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Context Tab Component
const ContextTab = ({ update, relatedUpdates }: { update: ParameterUpdate; relatedUpdates: ParameterUpdate[] }) => {
  return (
    <div className="space-y-6">
      {/* Market Context */}
      {update.marketContext && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Context</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {update.marketContext.priceChange24h !== undefined && (
              <DetailCard
                label="24h Price Change"
                value={
                  <div className="flex items-center gap-1">
                    {update.marketContext.priceChange24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={update.marketContext.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {update.marketContext.priceChange24h >= 0 ? '+' : ''}{update.marketContext.priceChange24h.toFixed(2)}%
                    </span>
                  </div>
                }
              />
            )}
            {update.marketContext.volume24h && (
              <DetailCard label="24h Volume" value={update.marketContext.volume24h} />
            )}
            {update.marketContext.marketCap && (
              <DetailCard label="Market Cap" value={update.marketContext.marketCap} />
            )}
            {update.marketContext.utilizationRate && (
              <DetailCard 
                label="Utilization Rate" 
                value={`${update.marketContext.utilizationRate.toFixed(1)}%`} 
              />
            )}
            {update.marketContext.averageApr && (
              <DetailCard 
                label="Average APR" 
                value={`${update.marketContext.averageApr.toFixed(2)}%`} 
              />
            )}
          </div>
        </div>
      )}

      {/* Related Updates */}
      {relatedUpdates.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Updates</h3>
          <div className="space-y-3">
            {relatedUpdates.slice(0, 5).map(relatedUpdate => (
              <div key={relatedUpdate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span>{relatedUpdate.network.icon}</span>
                  <div>
                    <p className="font-medium text-sm">
                      {relatedUpdate.asset.symbol} {relatedUpdate.parameter}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatRelativeTime(relatedUpdate.timestamp)}
                    </p>
                  </div>
                </div>
                <span className={cn("px-2 py-1 text-xs font-medium rounded-full border",
                  relatedUpdate.status === 'Success' ? 'text-green-600 bg-green-50 border-green-200' :
                  relatedUpdate.status === 'Failed' ? 'text-red-600 bg-red-50 border-red-200' :
                  'text-yellow-600 bg-yellow-50 border-yellow-200'
                )}>
                  {relatedUpdate.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Technical Tab Component
const TechnicalTab = ({ update }: { update: ParameterUpdate }) => {
  const getValidationIcon = (status: string) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Failed':
        return <X className="w-4 h-4 text-red-600" />;
      case 'Warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Rules */}
      {update.validationRules && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Rules</h3>
          <div className="space-y-3">
            {update.validationRules.map((rule, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {getValidationIcon(rule.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{rule.rule}</p>
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-full",
                      rule.status === 'Passed' ? 'text-green-600 bg-green-100' :
                      rule.status === 'Failed' ? 'text-red-600 bg-red-100' :
                      'text-yellow-600 bg-yellow-100'
                    )}>
                      {rule.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailCard label="Network" value={`${update.network.name} (Chain ID: ${update.network.chainId})`} />
          <DetailCard label="Asset" value={`${update.asset.symbol} - ${update.asset.name}`} />
          <DetailCard label="Parameter Type" value={update.parameter} />
          <DetailCard label="Timestamp" value={formatDate(update.timestamp)} />
          {update.initiator && (
            <DetailCard 
              label="Initiator" 
              value={
                <span className="font-mono text-sm">{truncateHash(update.initiator)}</span>
              } 
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Detail Card Component
const DetailCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <div className="font-medium text-gray-900">{value}</div>
  </div>
);
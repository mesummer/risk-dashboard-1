import { 
  List, 
  BarChart3, 
  Grid, 
  Eye 
} from 'lucide-react';
import type { ViewMode } from '../../types';
import { cn } from '../../utils';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  className?: string;
}

export const ViewToggle = ({ currentView, onViewChange, className }: ViewToggleProps) => {
  const views = [
    {
      id: 'timeline' as ViewMode,
      label: 'Timeline',
      icon: List,
      description: 'Chronological list view'
    },
    {
      id: 'charts' as ViewMode,
      label: 'Charts',
      icon: BarChart3,
      description: 'Timeline visualization'
    },
    {
      id: 'heatmap' as ViewMode,
      label: 'Heatmap',
      icon: Grid,
      description: 'Activity heatmap view'
    }
  ];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-2 mr-4">
        <Eye className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">View:</span>
      </div>
      
      <div className="flex bg-gray-100 rounded-lg p-1">
        {views.map(view => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          
          return (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
              title={view.description}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Breadcrumb Navigation Component
interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-400">/</span>
          )}
          {item.href && !item.isActive ? (
            <button className="text-blue-600 hover:text-blue-800 hover:underline">
              {item.label}
            </button>
          ) : (
            <span className={cn(
              item.isActive 
                ? "text-gray-900 font-medium" 
                : "text-gray-600"
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

// View Header Component that combines toggle and breadcrumb
interface ViewHeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  breadcrumbItems?: BreadcrumbItem[];
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const ViewHeader = ({
  currentView,
  onViewChange,
  breadcrumbItems = [],
  title,
  subtitle,
  actions,
  className
}: ViewHeaderProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumb */}
      {breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}
      
      {/* Header Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          )}
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        {/* Actions and View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
          <ViewToggle 
            currentView={currentView} 
            onViewChange={onViewChange}
          />
        </div>
      </div>
    </div>
  );
};
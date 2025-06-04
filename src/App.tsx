import { useState } from 'react';
import { Header } from './components/layout/Header';
import { EnhancedUpdatesTimeline } from './components/updates/EnhancedUpdatesTimeline';
import { mockUpdates, getDashboardStats } from './data/mockData';
import type { ParameterUpdate } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const stats = getDashboardStats();

  const handleUpdateClick = (update: ParameterUpdate) => {
    // For now, just log the update. In a real app, this could open a modal or navigate to a detail page
    console.log('Selected update:', update);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header stats={stats} />
      
      <main className="flex-1 flex overflow-hidden">
        <EnhancedUpdatesTimeline 
          updates={mockUpdates} 
          onUpdateClick={handleUpdateClick}
          isLoading={isLoading}
        />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-600">
            <p>RiskSteward Parameter Updates Dashboard</p>
            <p className="mt-1">Real-time monitoring and analytics for DeFi risk management</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ViewMode } from '../types';

const VIEW_STORAGE_KEY = 'riskdashboard_view_state';

interface ViewState {
  currentView: ViewMode;
  previousView?: ViewMode;
}

export const useViewState = (defaultView: ViewMode = 'timeline') => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewState, setViewState] = useState<ViewState>(() => {
    // Try to get view from URL first
    const urlView = searchParams.get('view') as ViewMode;
    if (urlView && ['timeline', 'heatmap', 'charts'].includes(urlView)) {
      return { currentView: urlView };
    }
    
    // Fall back to localStorage
    try {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ViewState;
        if (['timeline', 'heatmap', 'charts'].includes(parsed.currentView)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load view state from localStorage:', error);
    }
    
    // Use default
    return { currentView: defaultView };
  });

  // Update URL and localStorage when view changes
  useEffect(() => {
    // Update URL
    const newSearchParams = new URLSearchParams(searchParams);
    if (viewState.currentView !== defaultView) {
      newSearchParams.set('view', viewState.currentView);
    } else {
      newSearchParams.delete('view');
    }
    setSearchParams(newSearchParams);

    // Update localStorage
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(viewState));
    } catch (error) {
      console.warn('Failed to save view state to localStorage:', error);
    }
  }, [viewState, searchParams, setSearchParams, defaultView]);

  const setCurrentView = (newView: ViewMode) => {
    setViewState(prev => ({
      currentView: newView,
      previousView: prev.currentView
    }));
  };

  const goToPreviousView = () => {
    if (viewState.previousView) {
      setCurrentView(viewState.previousView);
    }
  };

  const resetToDefault = () => {
    setCurrentView(defaultView);
  };

  return {
    currentView: viewState.currentView,
    previousView: viewState.previousView,
    setCurrentView,
    goToPreviousView,
    resetToDefault,
    canGoBack: !!viewState.previousView
  };
};
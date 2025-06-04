import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Hash, Coins, Network, Settings } from 'lucide-react';
import type { ParameterUpdate, SearchSuggestion } from '../../types';
import { cn } from '../../utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  updates: ParameterUpdate[];
  placeholder?: string;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  updates, 
  placeholder = "Search assets, parameters, networks, or transaction hashes..." 
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Generate search suggestions
  const suggestions = useMemo(() => {
    if (!value || value.length < 2) return [];

    const searchTerm = value.toLowerCase();
    const suggestionSet = new Set<string>();
    const results: SearchSuggestion[] = [];

    // Asset suggestions
    updates.forEach(update => {
      const assetSymbol = update.asset.symbol.toLowerCase();
      const assetName = update.asset.name.toLowerCase();
      
      if ((assetSymbol.includes(searchTerm) || assetName.includes(searchTerm)) 
          && !suggestionSet.has(update.asset.symbol)) {
        suggestionSet.add(update.asset.symbol);
        results.push({
          type: 'asset',
          value: update.asset.symbol,
          label: `${update.asset.symbol} - ${update.asset.name}`
        });
      }
    });

    // Parameter suggestions
    updates.forEach(update => {
      const paramLower = update.parameter.toLowerCase();
      if (paramLower.includes(searchTerm) && !suggestionSet.has(update.parameter)) {
        suggestionSet.add(update.parameter);
        results.push({
          type: 'parameter',
          value: update.parameter,
          label: update.parameter
        });
      }
    });

    // Network suggestions
    updates.forEach(update => {
      const networkName = update.network.name.toLowerCase();
      if (networkName.includes(searchTerm) && !suggestionSet.has(update.network.name)) {
        suggestionSet.add(update.network.name);
        results.push({
          type: 'network',
          value: update.network.name,
          label: update.network.name
        });
      }
    });

    // Transaction hash suggestions (if it looks like a hash)
    if (searchTerm.startsWith('0x') && searchTerm.length > 4) {
      updates.forEach(update => {
        if (update.transactionHash.toLowerCase().includes(searchTerm) 
            && !suggestionSet.has(update.transactionHash)) {
          suggestionSet.add(update.transactionHash);
          results.push({
            type: 'hash',
            value: update.transactionHash,
            label: `${update.transactionHash.slice(0, 10)}...${update.transactionHash.slice(-8)}`
          });
        }
      });
    }

    return results.slice(0, 8); // Limit to 8 suggestions
  }, [value, updates]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSuggestionSelect(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, suggestions, highlightedIndex]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      const highlightedItem = items[highlightedIndex] as HTMLElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    onChange(suggestion.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (value && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow for suggestion clicks
    setTimeout(() => setIsOpen(false), 150);
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'asset':
        return <Coins className="w-4 h-4 text-gray-400" />;
      case 'parameter':
        return <Settings className="w-4 h-4 text-gray-400" />;
      case 'network':
        return <Network className="w-4 h-4 text-gray-400" />;
      case 'hash':
        return <Hash className="w-4 h-4 text-gray-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSuggestionTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'asset':
        return 'Asset';
      case 'parameter':
        return 'Parameter';
      case 'network':
        return 'Network';
      case 'hash':
        return 'Hash';
      default:
        return '';
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <ul ref={listRef} className="py-1">
            {suggestions.map((suggestion, index) => (
              <li key={`${suggestion.type}-${suggestion.value}`}>
                <button
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className={cn(
                    "w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors",
                    index === highlightedIndex && "bg-blue-50"
                  )}
                >
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.label}
                      </span>
                      <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">
                        {getSuggestionTypeLabel(suggestion.type)}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No suggestions message */}
      {isOpen && value.length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            No suggestions found for "{value}"
          </div>
        </div>
      )}
    </div>
  );
};
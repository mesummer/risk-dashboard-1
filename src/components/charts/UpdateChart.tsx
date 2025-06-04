import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import type { ParameterUpdate, ChartDataPoint } from '../../types';
import { generateChartData } from '../../data/mockData';

interface UpdateChartProps {
  updates: ParameterUpdate[];
  chartType?: 'line' | 'area' | 'bar';
  height?: number;
  onTimeRangeClick?: (startDate: Date, endDate: Date) => void;
}

export const UpdateChart = ({ 
  updates, 
  chartType = 'area',
  height = 300,
  onTimeRangeClick 
}: UpdateChartProps) => {
  const chartData = useMemo(() => generateChartData(updates), [updates]);

  const formatTooltipDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {formatTooltipDate(label)}
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Manual: {data.manual}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Automated: {data.automated}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Total: {data.count}</span>
            </div>
          </div>
          {onTimeRangeClick && (
            <button 
              onClick={() => onTimeRangeClick(data.date, data.date)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Filter by this date
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  const formatXAxisDate = (date: string) => {
    return format(new Date(date), 'MMM dd');
  };

  const handleChartClick = (data: any) => {
    if (onTimeRangeClick && data?.activePayload?.[0]?.payload) {
      const clickedDate = new Date(data.activePayload[0].payload.date);
      onTimeRangeClick(clickedDate, clickedDate);
    }
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
      onClick: handleChartClick,
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisDate}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="manual"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Manual Updates"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="automated"
              stroke="#22c55e"
              strokeWidth={2}
              name="Automated Updates"
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="manualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="automatedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisDate}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="manual"
              stackId="1"
              stroke="#3b82f6"
              fill="url(#manualGradient)"
              name="Manual Updates"
            />
            <Area
              type="monotone"
              dataKey="automated"
              stackId="1"
              stroke="#22c55e"
              fill="url(#automatedGradient)"
              name="Automated Updates"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisDate}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="manual" stackId="a" fill="#3b82f6" name="Manual Updates" />
            <Bar dataKey="automated" stackId="a" fill="#22c55e" name="Automated Updates" />
          </BarChart>
        );

      default:
        return null;
    }
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">No updates found for the chart visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
      
      {/* Chart Summary */}
      <div className="mt-4 flex justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Manual: {chartData.reduce((sum, d) => sum + d.manual, 0)} updates</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Automated: {chartData.reduce((sum, d) => sum + d.automated, 0)} updates</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span>Total: {chartData.reduce((sum, d) => sum + d.count, 0)} updates</span>
        </div>
      </div>
    </div>
  );
};
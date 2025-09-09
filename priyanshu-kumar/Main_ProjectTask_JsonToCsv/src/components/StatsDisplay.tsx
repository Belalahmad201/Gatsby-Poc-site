// StatsDisplay.tsx
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { StatsDisplayProps } from '../types';

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="mb-8 bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-5 w-5 text-black" />
                <h3 className="font-medium text-black">Conversion Details</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-semibold text-black">{stats.totalRows.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Rows</div>
                </div>
                <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-semibold text-black">{stats.totalColumns}</div>
                    <div className="text-sm text-gray-600">Columns</div>
                </div>
                <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-semibold text-black">{(stats.fileSize / 1024).toFixed(1)}KB</div>
                    <div className="text-sm text-gray-600">Size</div>
                </div>
                <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-2xl font-semibold text-black">{stats.processingTime}ms</div>
                    <div className="text-sm text-gray-600">Time</div>
                </div>
            </div>
        </div>
    );
};

export default StatsDisplay;
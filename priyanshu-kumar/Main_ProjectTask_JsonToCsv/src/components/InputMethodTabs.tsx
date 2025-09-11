// InputMethodTabs.tsx
import React from 'react';
import { Upload, Edit3 } from 'lucide-react';
import { InputMethodTabsProps } from '../types';

const InputMethodTabs: React.FC<InputMethodTabsProps> = ({ activeTab, onTabChange }) => (
    <div className="mb-6">
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
                onClick={() => onTabChange('file')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${activeTab === 'file'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-50'
                    }`}
            >
                <Upload className="h-4 w-4" />
                <span>Upload File</span>
            </button>
            <button
                onClick={() => onTabChange('text')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 border-l border-gray-300 ${activeTab === 'text'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-50'
                    }`}
            >
                <Edit3 className="h-4 w-4" />
                <span>Paste JSON</span>
            </button>
        </div>
    </div>
);

export default InputMethodTabs;
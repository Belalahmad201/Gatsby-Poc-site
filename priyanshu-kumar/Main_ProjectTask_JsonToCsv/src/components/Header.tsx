// Header.tsx
import React from 'react';
import { FileJson, Trash2 } from 'lucide-react';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ jsonData, onClear }) => (
    <header className="bg-white border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <FileJson className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-black">
                            JSON to CSV Converter
                        </h1>
                        <p className="text-sm text-gray-600">Simple data transformation tool</p>
                    </div>
                </div>
                {jsonData && (
                    <button
                        onClick={onClear}
                        className="px-3 py-2 text-black hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2 border border-gray-300"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Clear</span>
                    </button>
                )}
            </div>
        </div>
    </header>
);

export default Header;
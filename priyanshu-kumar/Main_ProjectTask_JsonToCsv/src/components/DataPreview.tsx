// DataPreview.tsx
import React from 'react';
import { FileJson, FileSpreadsheet, Check, Copy, Download } from 'lucide-react';
import { DataPreviewProps } from '../types';

const DataPreview: React.FC<DataPreviewProps> = ({
    jsonData,
    csvData,
    isConverting,
    showPreview,
    onCopy,
    onDownload,
    copySuccess
}) => {
    if (!jsonData) return null;

    return (
        <div className="space-y-6">
            {showPreview && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* JSON Preview */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
                            <div className="flex items-center space-x-2">
                                <FileJson className="h-4 w-4 text-gray-600" />
                                <span className="font-medium text-black">JSON Input</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-80 overflow-auto">
                                <pre className="text-xs text-black font-mono">
                                    {typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* CSV Preview */}
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <FileSpreadsheet className="h-4 w-4 text-gray-600" />
                                    <span className="font-medium text-black">CSV Output</span>
                                </div>
                                {!isConverting && csvData && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={onCopy}
                                            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center space-x-1"
                                        >
                                            {copySuccess ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                            <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                                        </button>
                                        <button
                                            onClick={onDownload}
                                            className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center space-x-1"
                                        >
                                            <Download className="h-3 w-3" />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4">
                            {isConverting ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="w-8 h-8 border-3 border-gray-300 border-t-black rounded-full animate-spin"></div>
                                        <p className="text-sm text-gray-600">Converting...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-80 overflow-auto">
                                    <pre className="text-xs text-black font-mono whitespace-pre-wrap">
                                        {csvData || 'No data'}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {!isConverting && csvData && (
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={onCopy}
                        className="px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2 border border-gray-300"
                    >
                        {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copySuccess ? 'Copied!' : 'Copy CSV'}</span>
                    </button>
                    <button
                        onClick={onDownload}
                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                        <Download className="h-4 w-4" />
                        <span>Download File</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataPreview;
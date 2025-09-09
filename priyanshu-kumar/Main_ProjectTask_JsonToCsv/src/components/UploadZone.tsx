// UploadZone.tsx
import React from 'react';
import { Upload, Check } from 'lucide-react';
import { UploadZoneProps } from '../types';

const UploadZone: React.FC<UploadZoneProps> = ({
    isDragOver,
    jsonData,
    fileName,
    onDrop,
    onDragOver,
    onDragLeave,
    onFileSelect,
    onLoadSample,
    fileInputRef
}) => (
    <div className="mb-6">
        <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                ? 'border-black bg-gray-50'
                : jsonData
                    ? 'border-black bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={onFileSelect}
                className="hidden"
            />

            {!jsonData ? (
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-black mb-2">
                            Upload JSON File
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Drop your JSON file here or click to browse
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Choose File
                            </button>
                            <span className="text-gray-400 flex items-center">or</span>
                            <button
                                onClick={onLoadSample}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Try Sample
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-black" />
                    </div>
                    <div>
                        <p className="font-medium text-black">{fileName}</p>
                        <p className="text-sm text-gray-600">Ready to convert</p>
                    </div>
                </div>
            )}
        </div>
    </div>
);

export default UploadZone;
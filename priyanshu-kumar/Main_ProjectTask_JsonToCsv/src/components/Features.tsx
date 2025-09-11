// Features.tsx
import React from 'react';
import { Upload, Edit3, FileSpreadsheet } from 'lucide-react';

const Features: React.FC = () => (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-white border border-gray-300 rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="h-6 w-6 text-black" />
            </div>
            <h3 className="font-medium text-black mb-2">File Upload</h3>
            <p className="text-sm text-gray-600">Drag and drop or browse to upload JSON files</p>
        </div>
        <div className="text-center p-6 bg-white border border-gray-300 rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Edit3 className="h-6 w-6 text-black" />
            </div>
            <h3 className="font-medium text-black mb-2">Text Editor</h3>
            <p className="text-sm text-gray-600">Paste JSON directly or type in the built-in editor</p>
        </div>
        <div className="text-center p-6 bg-white border border-gray-300 rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileSpreadsheet className="h-6 w-6 text-black" />
            </div>
            <h3 className="font-medium text-black mb-2">Quick Export</h3>
            <p className="text-sm text-gray-600">Copy to clipboard or download CSV instantly</p>
        </div>
    </div>
);

export default Features;
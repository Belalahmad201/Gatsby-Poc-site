// JsonTextEditor.tsx
import React from 'react';
import { Edit3 } from 'lucide-react';
import { JsonTextEditorProps } from '../types';

const JsonTextEditor: React.FC<JsonTextEditorProps> = ({
    value,
    onChange,
    onConvert,
    isConverting
}) => {
    const handlePaste = async (): Promise<void> => {
        try {
            const text = await navigator.clipboard.readText();
            onChange(text);
        } catch (err) {
            console.error('Failed to paste:', err);
        }
    };

    return (
        <div className="mb-6">
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-300 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Edit3 className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-black">JSON Editor</span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePaste}
                            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center space-x-1"
                        >

                            <span>Paste</span>
                        </button>
                        <button
                            onClick={onConvert}
                            disabled={!value.trim() || isConverting}
                            className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isConverting ? 'Converting...' : 'Convert'}
                        </button>
                    </div>
                </div>
                <div className="p-4">
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Paste your JSON data here or type it directly..."
                        className="w-full h-64 p-3 font-mono text-sm bg-gray-50 border border-gray-200 rounded resize-none focus:outline-none focus:border-black"
                        spellCheck={false}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                        Tip: You can paste JSON data directly from your clipboard
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JsonTextEditor;
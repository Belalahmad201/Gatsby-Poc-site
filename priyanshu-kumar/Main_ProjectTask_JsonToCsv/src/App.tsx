// App.tsx
import React, { useState, useCallback, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Components
import Header from './components/Header';
import InputMethodTabs from './components/InputMethodTabs';
import JsonTextEditor from './components/JsonTextEditor';
import UploadZone from './components/UploadZone';
import ErrorAlert from './components/ErrorAlert';
import StatsDisplay from './components/StatsDisplay';
import DataPreview from './components/DataPreview';
import Features from './components/Features';

// Types and Utils
import { ConversionStats } from './types';
import { jsonToCsv, downloadCsv, copyToClipboard } from './lib/utils';

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [stats, setStats] = useState<ConversionStats | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [jsonText, setJsonText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleJsonData = {
    users: [
      {
        id: 1,
        name: "priyanshu kumar",
        email: "priyanshu@example.com",
        department: "Engineering",
        skills: ["JavaScript", "React", "Node.js"],
        active: true
      },
      {
        id: 2,
        name: "aniketkumar",
        email: "aniket@example.com",
        department: "Design",
        skills: ["Figma", "Sketch", "CSS"],
        active: true
      }
    ]
  };

  const handleTextConvert = useCallback(() => {
    if (!jsonText.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setError('');
    setIsConverting(true);
    setFileName('pasted-data.json');

    try {
      const parsed = JSON.parse(jsonText);
      setJsonData(parsed);

      setTimeout(() => {
        const csv = jsonToCsv(parsed, setStats);
        setCsvData(csv);
        setIsConverting(false);
      }, 500);
    } catch (err) {
      setError('Invalid JSON format. Please check your data.');
      setIsConverting(false);
    }
  }, [jsonText]);

  const handleFileUpload = useCallback((file: File) => {
    setError('');
    setIsConverting(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        setJsonData(parsed);
        setJsonText(JSON.stringify(parsed, null, 2));

        setTimeout(() => {
          const csv = jsonToCsv(parsed, setStats);
          setCsvData(csv);
          setIsConverting(false);
        }, 500);
      } catch (err) {
        setError('Invalid JSON file. Please check the format.');
        setIsConverting(false);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file =>
      file.type === 'application/json' || file.name.endsWith('.json')
    );

    if (jsonFile) {
      handleFileUpload(jsonFile);
    } else {
      setError('Please upload a valid JSON file.');
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDownload = useCallback(() => {
    downloadCsv(csvData, fileName);
  }, [csvData, fileName]);

  const handleCopy = useCallback(async () => {
    if (!csvData) return;

    const success = await copyToClipboard(csvData);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } else {
      setError('Failed to copy to clipboard');
    }
  }, [csvData]);

  const loadSampleData = useCallback(() => {
    setJsonData(sampleJsonData);
    setJsonText(JSON.stringify(sampleJsonData, null, 2));
    setFileName('sample.json');
    setError('');
    setIsConverting(true);

    setTimeout(() => {
      const csv = jsonToCsv(sampleJsonData, setStats);
      setCsvData(csv);
      setIsConverting(false);
    }, 500);
  }, []);

  const clearData = useCallback(() => {
    setJsonData(null);
    setCsvData('');
    setJsonText('');
    setFileName('');
    setError('');
    setStats(null);
    setCopySuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header jsonData={jsonData} onClear={clearData} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <InputMethodTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'file' ? (
          <UploadZone
            isDragOver={isDragOver}
            jsonData={jsonData}
            fileName={fileName}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileSelect={handleFileSelect}
            onLoadSample={loadSampleData}
            fileInputRef={fileInputRef}
          />
        ) : (
          <JsonTextEditor
            value={jsonText}
            onChange={setJsonText}
            onConvert={handleTextConvert}
            isConverting={isConverting}
          />
        )}

        <ErrorAlert error={error} />
        <StatsDisplay stats={stats} />

        {jsonData && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
            </button>
          </div>
        )}

        <DataPreview
          jsonData={jsonData}
          csvData={csvData}
          isConverting={isConverting}
          showPreview={showPreview}
          onCopy={handleCopy}
          onDownload={handleDownload}
          copySuccess={copySuccess}
        />

        {!jsonData && <Features />}
      </main>
    </div>
  );
};

export default App;
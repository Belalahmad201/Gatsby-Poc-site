import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Copy, 
  FileJson, 
  FileSpreadsheet, 
  Check, 
  AlertCircle, 
  Trash2, 
  Settings, 
  BarChart3,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface ConversionStats {
  totalRows: number;
  totalColumns: number;
  fileSize: number;
  processingTime: number;
}

function App() {
  const [jsonData, setJsonData] = useState<any>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [stats, setStats] = useState<ConversionStats | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleJsonData = {
    employees: [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@company.com",
        department: "Engineering",
        salary: 95000,
        address: {
          street: "123 Tech Street",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105"
        },
        skills: ["JavaScript", "React", "Node.js"],
        isActive: true,
        joinDate: "2022-01-15"
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@company.com",
        department: "Marketing",
        salary: 75000,
        address: {
          street: "456 Market Ave",
          city: "New York",
          state: "NY",
          zipCode: "10001"
        },
        skills: ["SEO", "Content Marketing", "Analytics"],
        isActive: true,
        joinDate: "2021-08-20"
      },
      {
        id: 3,
        name: "Carol Davis",
        email: "carol@company.com",
        department: "Design",
        salary: 85000,
        address: {
          street: "789 Creative Blvd",
          city: "Austin",
          state: "TX",
          zipCode: "73301"
        },
        skills: ["Figma", "Photoshop", "UI/UX"],
        isActive: false,
        joinDate: "2020-03-10"
      }
    ]
  };

  const flattenObject = (obj: any, prefix = '') => {
    const flattened: { [key: string]: any } = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else if (Array.isArray(obj[key])) {
          flattened[newKey] = obj[key].join('; ');
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  };

  const jsonToCsv = useCallback((jsonData: any) => {
    const startTime = Date.now();
    
    if (!jsonData) return '';
    
    let dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
    
    // Handle nested structures - look for array properties
    if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
      const arrayKeys = Object.keys(jsonData).filter(key => Array.isArray(jsonData[key]));
      if (arrayKeys.length > 0) {
        dataArray = jsonData[arrayKeys[0]];
      }
    }

    if (dataArray.length === 0) return '';

    // Flatten all objects
    const flattenedData = dataArray.map(item => flattenObject(item));
    
    // Get all unique headers
    const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
    
    // Create CSV content
    const csvRows = [
      headers.join(','),
      ...flattenedData.map(row => 
        headers.map(header => {
          const value = row[header] ?? '';
          const stringValue = typeof value === 'string' ? value : String(value);
          return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ];

    const processingTime = Date.now() - startTime;
    const csvContent = csvRows.join('\n');
    
    setStats({
      totalRows: flattenedData.length,
      totalColumns: headers.length,
      fileSize: new Blob([csvContent]).size,
      processingTime
    });

    return csvContent;
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    setError('');
    setIsConverting(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        setJsonData(parsed);
        
        setTimeout(() => {
          const csv = jsonToCsv(parsed);
          setCsvData(csv);
          setIsConverting(false);
        }, 800);
      } catch (err) {
        setError('Invalid JSON file. Please check your file format and try again.');
        setIsConverting(false);
      }
    };
    reader.readAsText(file);
  }, [jsonToCsv]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.type === 'application/json' || file.name.endsWith('.json'));
    
    if (jsonFile) {
      handleFileUpload(jsonFile);
    } else {
      setError('Please upload a valid JSON file.');
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const downloadCsv = useCallback(() => {
    if (!csvData) return;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? fileName.replace('.json', '.csv') : 'converted.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [csvData, fileName]);

  const copyToClipboard = useCallback(async () => {
    if (!csvData) return;
    
    try {
      await navigator.clipboard.writeText(csvData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  }, [csvData]);

  const loadSampleData = useCallback(() => {
    setJsonData(sampleJsonData);
    setFileName('sample-employees.json');
    setError('');
    setIsConverting(true);
    
    setTimeout(() => {
      const csv = jsonToCsv(sampleJsonData);
      setCsvData(csv);
      setIsConverting(false);
    }, 800);
  }, [jsonToCsv]);

  const clearData = useCallback(() => {
    setJsonData(null);
    setCsvData('');
    setFileName('');
    setError('');
    setStats(null);
    setCopySuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileJson className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  JSON to CSV Converter
                </h1>
                <p className="text-sm text-gray-600">Transform your data with style</p>
              </div>
            </div>
            {jsonData && (
              <button
                onClick={clearData}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center space-x-2 font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-indigo-400 bg-indigo-50/50 scale-[1.02] shadow-xl'
                : jsonData
                ? 'border-green-300 bg-green-50/30 shadow-lg'
                : 'border-gray-300 bg-white/60 hover:border-indigo-300 hover:bg-white/80 hover:shadow-lg'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!jsonData ? (
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  {isDragOver && (
                    <div className="absolute inset-0 w-20 h-20 bg-white/20 rounded-3xl mx-auto animate-ping"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {isDragOver ? 'Drop it like it\'s hot! 🔥' : 'Upload Your JSON File'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Drag and drop your JSON file here, or click to browse. We'll handle the rest with magic! ✨
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Upload className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                      <span>Choose File</span>
                    </button>
                    <div className="flex items-center space-x-3 text-gray-400">
                      <div className="w-8 h-px bg-gray-300"></div>
                      <span className="text-sm font-medium">OR</span>
                      <div className="w-8 h-px bg-gray-300"></div>
                    </div>
                    <button
                      onClick={loadSampleData}
                      className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                      <span>Try Sample Data</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-gray-900">{fileName}</p>
                  <p className="text-gray-600">File uploaded successfully! 🎉</p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 animate-pulse" />
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-4 shadow-sm">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-red-800 mb-1">Oops! Something went wrong</h4>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Display */}
        {stats && (
          <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Conversion Statistics</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200/50">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalRows.toLocaleString()}</div>
                <div className="text-sm font-medium text-blue-700">Rows</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200/50">
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.totalColumns}</div>
                <div className="text-sm font-medium text-green-700">Columns</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200/50">
                <div className="text-3xl font-bold text-purple-600 mb-1">{(stats.fileSize / 1024).toFixed(1)}KB</div>
                <div className="text-sm font-medium text-purple-700">File Size</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200/50">
                <div className="text-3xl font-bold text-orange-600 mb-1">{stats.processingTime}ms</div>
                <div className="text-sm font-medium text-orange-700">Processing Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Conversion Results */}
        {jsonData && (
          <div className="space-y-8">
            {/* Preview Toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white transition-all duration-200 flex items-center space-x-3 font-medium shadow-sm"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showPreview ? 'Hide' : 'Show'} Data Preview</span>
              </button>
            </div>

            {showPreview && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* JSON Preview */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <FileJson className="h-5 w-5 text-white" />
                      <h3 className="font-bold text-white">JSON Input</h3>
                      <div className="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium text-white">
                        Original
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-auto">
                      <pre className="text-sm text-gray-800 font-mono leading-relaxed">
                        {JSON.stringify(jsonData, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* CSV Preview */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileSpreadsheet className="h-5 w-5 text-white" />
                        <h3 className="font-bold text-white">CSV Output</h3>
                        <div className="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium text-white">
                          Converted
                        </div>
                      </div>
                      {!isConverting && csvData && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={copyToClipboard}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
                          >
                            {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={downloadCsv}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    {isConverting ? (
                      <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-emerald-400 rounded-full animate-spin animate-reverse"></div>
                        </div>
                        <p className="text-gray-600 font-medium">Converting your data...</p>
                        <p className="text-sm text-gray-500">This won't take long! ⚡</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-auto">
                        <pre className="text-sm text-gray-800 font-mono leading-relaxed whitespace-pre-wrap">
                          {csvData || 'No CSV data generated'}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isConverting && csvData && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={copyToClipboard}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {copySuccess ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5 group-hover:rotate-12 transition-transform" />}
                  <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy CSV Data'}</span>
                </button>
                <button
                  onClick={downloadCsv}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Download className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                  <span>Download CSV File</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Feature Highlights */}
        {!jsonData && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 text-center hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Upload</h3>
              <p className="text-gray-600 leading-relaxed">Drag and drop or click to upload your JSON files. We support all valid JSON formats!</p>
            </div>
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 text-center hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Processing</h3>
              <p className="text-gray-600 leading-relaxed">Automatically handles nested objects, arrays, and complex data structures with intelligence.</p>
            </div>
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 text-center hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Results</h3>
              <p className="text-gray-600 leading-relaxed">Get your CSV files instantly with one-click download and copy-to-clipboard functionality.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Built with ❤️ using React, TypeScript, and Tailwind CSS
            </p>
            <p className="text-sm text-gray-500">
              Advanced JSON to CSV Converter • Perfect for your data transformation needs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
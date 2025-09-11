// types.ts
export interface ConversionStats {
  totalRows: number;
  totalColumns: number;
  fileSize: number;
  processingTime: number;
}

export interface HeaderProps {
  jsonData: any;
  onClear: () => void;
}

export interface InputMethodTabsProps {
  activeTab: "file" | "text";
  onTabChange: (tab: "file" | "text") => void;
}

export interface JsonTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onConvert: () => void;
  isConverting: boolean;
}

export interface UploadZoneProps {
  isDragOver: boolean;
  jsonData: any;
  fileName: string;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSample: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export interface ErrorAlertProps {
  error: string;
}

export interface StatsDisplayProps {
  stats: ConversionStats | null;
}

export interface DataPreviewProps {
  jsonData: any;
  csvData: string;
  isConverting: boolean;
  showPreview: boolean;
  onCopy: () => void;
  onDownload: () => void;
  copySuccess: boolean;
}

// utils.ts
import { ConversionStats } from '../types';

export const flattenObject = (obj: any, prefix: string = ''): Record<string, any> => {
    const flattened: Record<string, any> = {};

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

export const jsonToCsv = (
    jsonData: any,
    setStats: (stats: ConversionStats) => void
): string => {
    const startTime = Date.now();

    if (!jsonData) return '';

    let dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

    if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
        const arrayKeys = Object.keys(jsonData).filter(key => Array.isArray(jsonData[key]));
        if (arrayKeys.length > 0) {
            dataArray = jsonData[arrayKeys[0]];
        }
    }

    if (dataArray.length === 0) return '';

    const flattenedData = dataArray.map((item: any) => flattenObject(item));
    const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));

    const csvRows = [
        headers.join(','),
        ...flattenedData.map((row: Record<string, any>) =>
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
};

export const downloadCsv = (csvData: string, fileName: string): void => {
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
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
};
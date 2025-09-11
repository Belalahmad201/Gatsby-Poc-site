// ErrorAlert.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ErrorAlertProps } from '../types';

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
    if (!error) return null;

    return (
        <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="font-medium text-black">Error</h4>
                <p className="text-gray-700 text-sm">{error}</p>
            </div>
        </div>
    );
};

export default ErrorAlert;
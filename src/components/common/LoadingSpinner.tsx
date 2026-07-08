// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text = 'جاري التحميل...'
}) => {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className={`${sizes[size]} animate-spin text-red-600`} />
            {text && <span className="mt-3 text-gray-600 dark:text-gray-400">{text}</span>}
        </div>
    );
};
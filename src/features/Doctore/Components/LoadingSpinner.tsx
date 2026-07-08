// components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
    // تحديد حجم الـ spinner
    return (
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
    );
};

// ✅ تصدير افتراضي
export default LoadingSpinner;
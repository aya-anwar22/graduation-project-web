import { useState } from "react";

export default function Loading() {
    const [loadingMessage, setLoadingMessage] = useState<string>('جاري تحميل البيانات...');

    return <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{loadingMessage}</p>
    </div>
}
// utils/fileUtils.ts

/**
 * أضف هذه الدالة لتصحيح ترميز النصوص العربية
 */
export const decodeArabicFileName = (fileName: string): string => {
    if (!fileName) return 'ملف';
    
    // إذا كان الاسم يبدو عاديًا، ارجعه كما هو
    if (!/[^\x00-\x7F]/.test(fileName)) {
        return fileName;
    }
    
    // محاولة فك ترميز UTF-8 المزدوج (المشكلة الشائعة)
    try {
        // حالة الترميز المزدوج UTF-8
        const decoded = decodeURIComponent(escape(fileName));
        if (decoded !== fileName) {
            return decoded;
        }
    } catch {
        // تجاهل الخطأ وجرب طرق أخرى
    }
    
    // محاولة ترميزات مختلفة للعربية
    const tryDecode = (str: string, from: string): string => {
        try {
            const decoder = new TextDecoder(from);
            const encoder = new TextEncoder();
            return decoder.decode(encoder.encode(str));
        } catch {
            return str;
        }
    };
    
    // ترميزات عربية شائعة
    const encodings = ['windows-1256', 'ISO-8859-6', 'cp1256', 'UTF-8'];
    
    for (const encoding of encodings) {
        const decoded = tryDecode(fileName, encoding);
        // إذا أصبح يحتوي على حروف عربية بعد فك الترميز
        if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(decoded)) {
            return decoded;
        }
    }
    
    // إذا فشل كل شيء، ارجع الاسم كما هو
    return fileName;
};

/**
 * استخراج اسم الملف من المسار مع تصحيح الترميز
 */
export const extractFileName = (filePath: string): string => {
    try {
        const url = new URL(filePath);
        const pathname = url.pathname;
        const fileName = pathname.split('/').pop() || 'ملف';
        
        // استخدام الدالة الجديدة لفك الترميز
        const decodedName = decodeArabicFileName(fileName);
        return decodedName;
    } catch {
        return 'ملف';
    }
};

/**
 * استخراج امتداد الملف من الاسم بعد تصحيح الترميز
 */
export const getFileExtension = (fileName: string): string => {
    const decodedFileName = decodeArabicFileName(fileName);
    const parts = decodedFileName.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
};

/**
 * الحصول على معلومات نوع الملف - تحديث لاستخدام الاسم المصحح
 */
export const getFileTypeInfo = (fileType: string): { 
    icon: string; 
    color: string; 
    bgColor: string;
    typeName: string;
} => {
    const type = fileType.toLowerCase();
    
    // أنواع PDF
    if (type === 'pdf') {
        return {
            icon: 'picture_as_pdf',
            color: 'text-red-500',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            typeName: 'PDF'
        };
    }
    
    // أنواع Word
    if (['doc', 'docx', 'rtf', 'txt'].includes(type)) {
        return {
            icon: 'description',
            color: 'text-blue-500',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            typeName: 'مستند'
        };
    }
    
    // أنواع Excel
    if (['xls', 'xlsx', 'csv'].includes(type)) {
        return {
            icon: 'table_chart',
            color: 'text-green-500',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            typeName: 'جدول'
        };
    }
    
    // أنواع PowerPoint
    if (['ppt', 'pptx', 'pps', 'ppsx'].includes(type)) {
        return {
            icon: 'slideshow',
            color: 'text-orange-500',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            typeName: 'عرض تقديمي'
        };
    }
    
    // أنواع الصور
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(type)) {
        return {
            icon: 'image',
            color: 'text-purple-500',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
            typeName: 'صورة'
        };
    }
    
    // أنواع الفيديو
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(type)) {
        return {
            icon: 'movie',
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
            typeName: 'فيديو'
        };
    }
    
    // أنواع الأرشيف
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(type)) {
        return {
            icon: 'folder_zip',
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
            typeName: 'أرشيف'
        };
    }
    
    // أنواع الكود
    if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'xml'].includes(type)) {
        return {
            icon: 'code',
            color: 'text-gray-500',
            bgColor: 'bg-gray-100 dark:bg-gray-900/30',
            typeName: 'كود'
        };
    }
    
    // الافتراضي
    return {
        icon: 'insert_drive_file',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-900/30',
        typeName: 'ملف'
    };
};

/**
 * استخراج معلومات الحجم من رابط الملف
 */
export const getFileSizeInfo = (filePath: string): string => {
    try {
        const url = new URL(filePath);
        const pathname = url.pathname;
        
        if (filePath.includes('cloudinary.com')) {
            return 'حجم متغير';
        }
        
        return 'غير معروف';
    } catch {
        return 'غير معروف';
    }
};

/**
 * تنسيق تاريخ الملف
 */
export const formatFileDate = (filePath: string): string => {
    try {
        const timestampMatch = filePath.match(/(\d{10,13})/);
        if (timestampMatch) {
            const timestamp = parseInt(timestampMatch[1]);
            const date = timestamp > 9999999999 ? 
                new Date(timestamp) : 
                new Date(timestamp * 1000);
            
            return date.toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        return 'غير محدد';
    } catch {
        return 'غير محدد';
    }
};

/**
 * دالة مساعدة للحصول على اسم الملف المصحح - يمكن استخدامها مباشرة
 */
export const getCorrectedFileName = (file: { fileName?: string; filePath: string }): string => {
    if (file.fileName) {
        return decodeArabicFileName(file.fileName);
    }
    return extractFileName(file.filePath);
};

/**
 * اختصار: دالة واحدة تجمع كل شيء لملف معين
 */
export const getFileDisplayInfo = (file: { fileName?: string; filePath: string }) => {
    const correctedName = getCorrectedFileName(file);
    const extension = getFileExtension(correctedName);
    const typeInfo = getFileTypeInfo(extension);
    const sizeInfo = getFileSizeInfo(file.filePath);
    const dateInfo = formatFileDate(file.filePath);
    
    return {
        name: correctedName,
        extension,
        typeInfo,
        sizeInfo,
        dateInfo
    };
};
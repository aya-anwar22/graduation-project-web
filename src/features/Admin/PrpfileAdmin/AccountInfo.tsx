// src/components/admin/AccountInfo.tsx
import React from 'react';
import { User, Mail, Phone, Shield, Calendar, CheckCircle } from 'lucide-react';
// import { AdminProfile } from '../../AdminTypes/Profile.interface';

interface Props {
    profile: any | null;
}

export const AccountInfo: React.FC<Props> = ({ profile }) => {
    const infoItems = [
        { icon: User, label: 'الاسم الكامل', value: profile?.fullName, color: 'text-red-600' },
        { icon: Mail, label: 'البريد الإلكتروني', value: profile?.email, color: 'text-blue-600' },
        { icon: Phone, label: 'رقم الهاتف', value: profile?.phoneNumber || '+20 123 456 7890', color: 'text-green-600' },
        { icon: Shield, label: 'الدور', value: profile?.role === 'admin' ? 'مدير النظام' : 'مدير عام', color: 'text-purple-600' },
        { icon: Calendar, label: 'تاريخ الانضمام', value: profile?.joinDate || '15 يناير 2024', color: 'text-orange-600' },
        { icon: CheckCircle, label: 'حالة الحساب', value: profile?.status === 'active' ? 'نشط' : 'غير نشط', color: 'text-green-600' },
    ];

    return (
        <div className="animate-slide-in bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                معلومات الحساب
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {infoItems.map((item, index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {item.label}
                        </label>
                        <div className="flex items-center gap-2">
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                            <p className="text-gray-900 dark:text-white font-semibold">
                                {item.value || 'غير محدد'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
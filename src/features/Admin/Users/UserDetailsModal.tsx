// src/components/admin/UserDetailsModal.tsx
import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, Calendar, Building, Briefcase, Shield, CheckCircle, XCircle } from 'lucide-react';
import type { User } from '../AdminTypes/User.interface';
import UserService from '../AdminService/User.service';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';

interface Props {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const UserDetailsModal: React.FC<Props> = ({ userId, isOpen, onClose }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const data = await UserService.getUserDetails(userId);
                    setUser(data);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [isOpen, userId]);

    if (!isOpen) return null;

    const getRoleName = (role: string) => {
        switch (role) {
            case 'admin': return 'مسؤول';
            case 'doctor': return 'دكتور';
            case 'student': return 'طالب';
            default: return role;
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Shield className="w-5 h-5 text-purple-600" />;
            case 'doctor': return <Briefcase className="w-5 h-5 text-pink-600" />;
            case 'student': return <Building className="w-5 h-5 text-blue-600" />;
            default: return <Building className="w-5 h-5 text-gray-600" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 flex justify-between items-center p-6 border-b dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        تفاصيل المستخدم
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                    >
                        <X className="w-5 h-5 text-gray-100" />
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <LoadingSpinner  />
                    </div>
                ) : user ? (
                    <div className="p-6 space-y-4">
                        {/* الصورة والأسم */}
                        <div className="text-center">
                            {user.profileImage ? (
                                <img 
                                    src={user.profileImage} 
                                    alt={user.fullName}
                                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-red-500"
                                />
                            ) : (
                                <div className={` w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white ${user.role === 'admin' ? 'gradient-admin' : user.role === 'doctor' ? 'gradient-doctor' : 'gradient-student'}`}>
                                    {user.fullName.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <h3 className="text-xl font-bold mt-3 text-gray-300">{user.fullName}</h3>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : user.role === 'doctor' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {getRoleName(user.role)}
                                </span>
                                {user.isVerified ? (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        مفعل
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600 flex items-center gap-1">
                                        <XCircle className="w-3 h-3" />
                                        غير مفعل
                                    </span>
                                )}
                                {user.isDeleted && (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                        محذوف
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* معلومات الاتصال */}
                        <div className="space-y-3 pt-4 border-t dark:border-gray-800">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Mail className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-xs text-gray-100">البريد الإلكتروني</p>
                                    <p className="font-semibold text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            {user.phoneNumber && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Phone className="w-5 h-5 text-red-600" />
                                    <div>
                                        <p className="text-xs text-gray-100">رقم الهاتف</p>
                                        <p className="font-semibold text-gray-400">{user.phoneNumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* معلومات الجامعة والقسم */}
                        {(user.universityName || user.departmentName) && (
                            <div className="space-y-3 pt-2">
                                {user.universityName && user.universityName !== 'N/A' && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <Building className="w-5 h-5 text-red-600" />
                                        <div>
                                            <p className="text-xs text-gray-100">الجامعة</p>
                                            <p className="font-semibold text-gray-400">{user.universityName}</p>
                                        </div>
                                    </div>
                                )}
                                {user.departmentName && user.departmentName !== 'N/A' && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <Briefcase className="w-5 h-5 text-red-600" />
                                        <div>
                                            <p className="text-xs text-gray-100">القسم</p>
                                            <p className="font-semibold text-gray-400">{user.departmentName}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* معلومات إضافية */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Calendar className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-xs text-gray-100">تاريخ الانضمام</p>
                                    <p className="font-semibold text-gray-400">{formatDate(user.createdAt)}</p>
                                </div>
                            </div>
                            {user.lastLogin && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Calendar className="w-5 h-5 text-red-600" />
                                    <div>
                                        <p className="text-xs text-gray-100">آخر تسجيل دخول</p>
                                        <p className="font-semibold text-gray-400">{formatDate(user.lastLogin)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-100">
                        لا توجد تفاصيل لعرضها
                    </div>
                )}
            </div>
        </div>
    );
};
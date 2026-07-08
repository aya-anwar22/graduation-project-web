// components/StudentDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import { getStudentDetails, addStudentNote } from '../DoctorServices/studentsService';
import type { Student } from '../TypesDoctor/students.interface';
import { useNavigate } from 'react-router-dom';

interface StudentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string | null;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ isOpen, onClose, studentId }) => {
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newNote, setNewNote] = useState('');
    const [notes, setNotes] = useState<Array<{ text: string; date: string }>>([]);
    const [showAddNote, setShowAddNote] = useState(false);
    const navigate = useNavigate();

    // ألوان للصورة الرمزية
    const avatarColors = [
        'from-red-500 to-orange-600',
        'from-purple-500 to-pink-600',
        'from-green-500 to-blue-600',
        'from-orange-500 to-red-600',
        'from-indigo-500 to-purple-600',
        'from-blue-500 to-cyan-600',
        'from-teal-500 to-green-600',
    ];

    useEffect(() => {
        if (isOpen && studentId) {
            fetchStudentDetails();
        }
    }, [isOpen, studentId]);

    const fetchStudentDetails = async () => {
        if (!studentId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getStudentDetails(studentId);
            if (response.success) {
                setStudent(response.data);
            } else {
                setError('فشل في تحميل بيانات الطالب');
            }
        } catch (error) {
            setError('حدث خطأ في تحميل البيانات');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim() || !studentId) return;

        try {
            await addStudentNote(studentId, newNote);
            setNotes(prev => [
                { text: newNote, date: new Date().toLocaleDateString('ar-EG') },
                ...prev
            ]);
            setNewNote('');
            setShowAddNote(false);
        } catch (error) {
            console.error('Error adding note:', error);
            alert('حدث خطأ في إضافة الملاحظة');
        }
    };

    const handleSendEmail = () => {
        if (student?.email) {
            window.location.href = `mailto:${student.email}`;
        }
    };

    const handleCall = () => {
        if (student?.phoneNumber) {
            window.location.href = `tel:${student.phoneNumber}`;
        }
    };

    const handleViewProject = () => {
        if (student?.projectId) {
            navigate(`/doctor/projectDoctor/${student.projectId}`);
        }
    };

    // الحصول على الحروف الأولى من الاسم
    const getInitials = (name: string) => {
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return words[0][0].toUpperCase();
    };

    // الحصول على لون عشوائي للصورة الرمزية
    const getAvatarColor = (id: string) => {
        const index = id.charCodeAt(id.length - 1) % avatarColors.length;
        return avatarColors[index];
    };

    // الحصول على حالة الطالب
    const getStudentStatus = () => {
        // يمكن تعديل هذا حسب منطق تحديد النشاط
        return 'active';
    };

    const getStatusColor = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400';
    };

    const getStatusLabel = (status: string) => {
        return status === 'active' ? 'نشط' : 'غير نشط';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">جاري تحميل بيانات الطالب...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error</span>
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                إغلاق
                            </button>
                        </div>
                    ) : student && (
                        <>
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    {student.fullName}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - Student Info */}
                                <div className="lg:col-span-2">
                                    {/* Student Overview */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
                                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                                            <div className="flex-shrink-0">
                                                {student.profileImage ? (
                                                    <img
                                                        src={student.profileImage}
                                                        alt={student.fullName}
                                                        className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-100 dark:ring-orange-900/50"
                                                    />
                                                ) : (
                                                    <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${getAvatarColor(student._id)} flex items-center justify-center text-white text-2xl font-bold`}>
                                                        {getInitials(student.fullName)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                                                            {student.fullName}
                                                        </h4>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                                <span className="material-symbols-outlined text-sm">badge</span>
                                                                <span className="text-sm">{student.universityCode}</span>
                                                            </span>
                                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                                <span className="material-symbols-outlined text-sm">mail</span>
                                                                <span className="text-sm">{student.email}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getStudentStatus())}`}>
                                                            {getStatusLabel(getStudentStatus())}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">الجامعة</p>
                                                        <p className="text-gray-800 dark:text-white font-medium">
                                                            {student.universityName}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">القسم</p>
                                                        <p className="text-gray-800 dark:text-white font-medium">
                                                            {student.departmentName}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Bio */}
                                                {student.bio && (
                                                    <div className="mt-4">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">نبذة شخصية</p>
                                                        <p className="text-gray-800 dark:text-white">
                                                            {student.bio}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Student Project */}
                                    {student.projectName && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">المشروع الحالي</h4>
                                            <div
                                                onClick={handleViewProject}
                                                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="text-gray-800 dark:text-white font-medium">
                                                        {student.projectName}
                                                    </h5>
                                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                                                        سنة {student.projectYear}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                                    <span>اضغط لعرض تفاصيل المشروع</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Actions */}
                                    <div className="flex gap-3 mb-6">
                                        <button
                                            onClick={handleSendEmail}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">mail</span>
                                            إرسال بريد
                                        </button>
                                        <button
                                            onClick={handleCall}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">call</span>
                                            اتصال
                                        </button>
                                    </div>
                                </div>

                                {/* Right Column - Additional Info */}
                                <div className="space-y-6">
                                    {/* Contact Info */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">معلومات الاتصال</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <span className="material-symbols-outlined text-blue-500">mail</span>
                                                <span className="text-gray-800 dark:text-white text-sm">{student.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <span className="material-symbols-outlined text-green-500">phone</span>
                                                <span className="text-gray-800 dark:text-white text-sm">{student.phoneNumber}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Academic Info */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">معلومات أكاديمية</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">الجامعة</span>
                                                <span className="text-gray-800 dark:text-white font-medium">{student.universityName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">القسم</span>
                                                <span className="text-gray-800 dark:text-white font-medium">{student.departmentName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">الرقم الجامعي</span>
                                                <span className="text-gray-800 dark:text-white font-medium">{student.universityCode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes Section */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border dark:border-gray-700">
                                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">الملاحظات</h4>

                                        <div className="space-y-3 mb-4">
                                            {notes.map((note, index) => (
                                                <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                    <p className="text-sm text-gray-800 dark:text-white">{note.text}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{note.date}</p>
                                                </div>
                                            ))}
                                            {notes.length === 0 && (
                                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                                    لا توجد ملاحظات
                                                </p>
                                            )}
                                        </div>

                                        {showAddNote ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="اكتب ملاحظتك هنا..."
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleAddNote}
                                                        className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                                                    >
                                                        حفظ
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowAddNote(false);
                                                            setNewNote('');
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        إلغاء
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowAddNote(true)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined">add</span>
                                                إضافة ملاحظة جديدة
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex gap-3 mt-8 pt-6 border-t dark:border-gray-700">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;
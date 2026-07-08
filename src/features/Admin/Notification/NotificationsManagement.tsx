// src/components/admin/NotificationsManagement.tsx
import React, { useState, useMemo } from 'react';
import { NotificationStats } from './NotificationStats';
import { NotificationFilters } from './NotificationFilters';
import { NotificationCard } from './NotificationCard';
import { useNotifications } from '../../../hooks/useNotifications';
import { Alert } from '../../../components/common/Alert';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';
// import { NotificationFilters as FiltersType } from '../../AdminTypes/Notification.interface';

export const NotificationsManagement: React.FC = () => {
    const {
        notifications,
        loading,
        error,
        success,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
        getStats,
        filterNotifications,
    } = useNotifications();

    const [currentFilter, setCurrentFilter] = useState<any['type']>('all');

    const stats = useMemo(() => getStats(), [getStats]);
    const filteredNotifications = useMemo(() => 
        filterNotifications({ type: currentFilter }), 
        [filterNotifications, currentFilter]
    );

    // const { DialogComponent: MarkAllDialog, openDialog: openMarkAllDialog } = useConfirmationDialog({
    //     onConfirm: async () => {
    //         await markAllAsRead();
    //     },
    //     title: 'تعليم الكل كمقروء',
    //     message: 'هل أنت متأكد من تعليم جميع الإشعارات كمقروءة؟',
    //     confirmText: 'تأكيد',
    //     cancelText: 'إلغاء',
    //     type: 'info',
    // });

    // const { DialogComponent: DeleteAllDialog, openDialog: openDeleteAllDialog } = useConfirmationDialog({
    //     onConfirm: async () => {
    //         await deleteAllRead();
    //     },
    //     title: 'حذف الإشعارات المقروءة',
    //     message: 'هل أنت متأكد من حذف جميع الإشعارات المقروءة؟ هذا الإجراء لا يمكن التراجع عنه.',
    //     confirmText: 'حذف',
    //     cancelText: 'إلغاء',
    //     type: 'danger',
    // });

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
    };

    const handleDelete = async (id: string) => {
        await deleteNotification(id);
    };

    const handleMarkAllClick = () => {
        if (stats.unread > 0) {
            // openMarkAllDialog();
        }
    };

    const handleDeleteAllReadClick = () => {
        if (stats.total - stats.unread > 0) {
            // openDeleteAllDialog();
        }
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                {success && <Alert type="success" message={success} onClose={() => {}} />}
                {error && <Alert type="error" message={error} onClose={() => {}} />}

                {/* Header */}
                <div className="animate-slide-in">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-600 text-4xl">notifications</span>
                                الإشعارات
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة ومتابعة جميع الإشعارات</p>
                        </div>
                        <button
                            onClick={handleMarkAllClick}
                            disabled={loading || stats.unread === 0}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined">done_all</span>
                            تعليم الكل كمقروء
                        </button>
                    </div>

                    <NotificationStats stats={stats} />
                </div>

                {/* Filters */}
                <NotificationFilters
                    currentFilter={currentFilter}
                    onFilterChange={setCurrentFilter}
                    onDeleteAllRead={handleDeleteAllReadClick}
                    loading={loading}
                />

                {/* Loading */}
                {loading && <LoadingSpinner  />}

                {/* Notifications List */}
                {!loading && (
                    <div className="animate-slide-in">
                        {filteredNotifications.length === 0 ? (
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">notifications_off</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لا توجد إشعارات</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {currentFilter === 'all' 
                                        ? 'لا توجد إشعارات لعرضها' 
                                        : currentFilter === 'unread' 
                                            ? 'لا توجد إشعارات غير مقروءة'
                                            : currentFilter === 'system'
                                                ? 'لا توجد إشعارات نظام'
                                                : 'لا توجد إشعارات من المستخدمين'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredNotifications.map((notification) => (
                                    <NotificationCard
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                        onDelete={handleDelete}
                                        loading={loading}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            {/* <MarkAllDialog /> */}
            {/* <DeleteAllDialog /> */}
        </main>
    );
};
// src/components/admin/TeamDetailsModal.tsx
import React, { useEffect, useState } from 'react';
import { X, Users, User, Mail, Phone, Calendar, Code, UserCheck } from 'lucide-react';
import type { Team } from '../AdminTypes/Team.interface';
import TeamService from '../AdminService/Team.service';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';

interface Props {
    teamId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const TeamDetailsModal: React.FC<Props> = ({ teamId, isOpen, onClose }) => {
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && teamId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const data = await TeamService.getTeamDetails(teamId);
                    setTeam(data);
                } catch (error) {
                    console.error('Error fetching team details:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [isOpen, teamId]);

    if (!isOpen) return null;

    const getProjectStatusText = (status: string) => {
        switch (status) {
            case 'start': return 'بداية';
            case 'in_progress': return 'قيد التنفيذ';
            case 'completed': return 'مكتمل';
            case 'paused': return 'متوقف';
            default: return status;
        }
    };

    const getProjectStatusColor = (status: string) => {
        switch (status) {
            case 'start': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
            case 'in_progress': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
            case 'paused': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 flex justify-between items-center p-6 border-b dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-red-600" />
                        تفاصيل الفريق
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
                        <LoadingSpinner   />
                    </div>
                ) : team ? (
                    <div className="p-6 space-y-6">
                        {/* اسم الفريق وكوده */}
                        <div className="text-center border-b dark:border-gray-800 pb-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                                {team.teamName.substring(0, 2).toUpperCase()}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-100 dark:text-white">{team.teamName}</h3>
                            <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1">{team.teamCode}</p>
                        </div>

                        {/* المعلومات الأساسية */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Code className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-xs text-gray-100">اسم المشروع</p>
                                    <p className="font-semibold text-white">{team.projectName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Calendar className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="text-xs text-gray-100">سنة المشروع</p>
                                    <p className="font-semibold text-white">{team.projectYear}</p>
                                </div>
                            </div>
                        </div>

                        {/* حالة المشروع */}
                        {team.projectStatus && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="material-symbols-outlined text-red-600">info</span>
                                <div>
                                    <p className="text-xs text-gray-100">حالة المشروع</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getProjectStatusColor(team.projectStatus)}`}>
                                        {getProjectStatusText(team.projectStatus)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* المشرف */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <UserCheck className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="text-xs text-gray-100">المشرف</p>
                                <p className="font-semibold text-white">{team.doctorName}</p>
                            </div>
                        </div>

                        {/* قائد الفريق */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <User className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="text-xs text-gray-100">قائد الفريق</p>
                                <p className="font-semibold text-white">{team.leaderName}</p>
                            </div>
                        </div>

                        {/* أعضاء الفريق */}
                        {team.membersDetails && team.membersDetails.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-200">
                                    <Users className="w-4 h-4 text-red-600" />
                                    أعضاء الفريق
                                </h4>
                                <div className="space-y-2">
                                    {team.membersDetails.map((member, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-100" />
                                                <span className="font-medium text-white">{member.fullName}</span>
                                                {member._id === team.leaderId && (
                                                    <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                                                        قائد
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-sm text-gray-100">
                                                <a href={`mailto:${member.email}`} className="flex items-center gap-1 hover:text-red-600 transition">
                                                    <Mail className="w-3 h-3" />
                                                    {member.email}
                                                </a>
                                                {member.phoneNumber && (
                                                    <a href={`tel:${member.phoneNumber}`} className="flex items-center gap-1 hover:text-red-600 transition">
                                                        <Phone className="w-3 h-3" />
                                                        {member.phoneNumber}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
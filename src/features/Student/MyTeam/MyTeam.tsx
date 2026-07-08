import React, { useState, useEffect } from 'react';
import TeamService, { formatMemberRole, getMemberImageUrl } from '../services/myTeamService';
import type { TeamData } from '../types/myTeam.interface';

interface TeamSectionProps {
    showMemberDetails?: (memberId: string) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ showMemberDetails }) => {
    const [teamData, setTeamData] = useState<TeamData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState(false);
    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await TeamService.getMyTeam();

            if (result.success) {
                setTeamData(result.data);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('حدث خطأ أثناء جلب بيانات الفريق');
            console.error('Error fetching team data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMemberClick = (memberId: string) => {
        if (showMemberDetails) {
            showMemberDetails(memberId);
        }
    };

    const handleSupervisorClick = () => {
        if (teamData && showMemberDetails) {
            showMemberDetails('supervisor');
        }
    };

    if (loading) {
        return (
            <div className="lg:col-span-1 flex flex-col gap-8 p-6  pt-20">
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="flex items-center gap-3">
                                <div className="size-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="lg:col-span-1 flex flex-col gap-8 p-6  pt-20">
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="text-center py-8">
                        <span className="material-symbols-outlined text-red-500 text-4xl mb-4">
                            error
                        </span>
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={fetchTeamData}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!teamData) {
        return null;
    }

    // فصل القائد عن بقية الأعضاء
    const teamLeader = teamData.teamMembers.find(member => member.memberIsLeader);
    const regularMembers = teamData.teamMembers.filter(member => !member.memberIsLeader);

    return (
        <div className="lg:col-span-1 flex flex-col gap-8 ">
            <div
                className="rounded-2xl bg-white dark:bg-gray-800 p-4 lg:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 animate-slide-up"
                style={{ animationDelay: '0.4s' }}
            >
                <h2 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">groups</span>
                    الفريق والمشرف
                </h2>

                <div className="space-y-6">
                    {/* المشرف الأكاديمي */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-white uppercase tracking-wider mb-3">
                            المشرف الأكاديمي
                        </h3>
                        <button
                            onClick={handleSupervisorClick}
                            className="flex items-center gap-3 group p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer w-full text-left"
                        >
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-blue-400"
                                style={{
                                    backgroundImage: teamData.doctorImage
                                        ? `url("${teamData.doctorImage}")`
                                        : 'url(`https://api.dicebear.com/7.x/avataaars/svg?seed=Doctor&backgroundColor=3b82f6&hair=shortHair&facialHair=beardMedium`)'
                                }}
                            ></div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {teamData.doctorFullName}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-white">
                                    {teamData.doctorBio || 'مشرف أكاديمي'}
                                </p>
                                {teamData.doctorEmail && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        {teamData.doctorEmail}
                                    </p>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* قائد الفريق */}
                    {teamLeader && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-white uppercase tracking-wider mb-3">
                                قائد الفريق
                            </h3>
                            <button
                                onClick={() => handleMemberClick(teamLeader.memberId)}
                                className="flex items-center justify-between gap-3 group p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer w-full text-left"
                            >
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-yellow-400"
                                    style={{
                                        backgroundImage: `url("${getMemberImageUrl(teamLeader.memberProfileImage)}")`
                                    }}
                                ></div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {teamLeader.memberFullName}
                                        </p>
                                        <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            قائد
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-white">
                                        {formatMemberRole(teamLeader.memberRole)}
                                    </p>
                                    {teamLeader.memberBio && (
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            {teamLeader.memberBio}
                                        </p>
                                    )}
                                </div>
                            </button>
                        </div>
                    )}

                    {/* أعضاء الفريق */}
                    {regularMembers.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-white uppercase tracking-wider mb-3">
                                أعضاء الفريق
                            </h3>
                            <div className="space-y-3">
                                {regularMembers.map((member) => (
                                    <button
                                        key={member.memberId}
                                        onClick={() => handleMemberClick(member.memberId)}
                                        className="flex items-center gap-3 group p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer w-full text-left"
                                    >
                                        <div
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-300 dark:border-gray-600"
                                            style={{
                                                backgroundImage: avatarError
                                                    ? 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=user&backgroundColor=6366f1")'
                                                    : `url("${getMemberImageUrl(member.memberProfileImage)}")`
                                            }}
                                            onError={() => setAvatarError(false)}
                                        ></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                                {member.memberFullName}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-white truncate">
                                                {formatMemberRole(member.memberRole)}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-white dark:text-gray-500 text-sm">
                                            chevron_left
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* معلومات إضافية عن الفريق */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-white">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">
                                    groups
                                </span>
                                <span>{teamData.teamMembers.length} عضو</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm">
                                    code
                                </span>
                                <span>كود: {teamData.teamCode}</span>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-2">
                            {teamData.teamName}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamSection;
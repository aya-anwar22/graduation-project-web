// TeamMembersForm.tsx
import React, { useState } from 'react';
import type { TeamMemberUI } from '../types/Supervisor.interface';
import TeamMemberCard from './TeamMemberCard';

interface TeamMembersFormProps {
    teamMembers: TeamMemberUI[];
    setTeamMembers: React.Dispatch<React.SetStateAction<TeamMemberUI[]>>;
}

const TeamMembersForm: React.FC<TeamMembersFormProps> = ({ teamMembers, setTeamMembers }) => {
    const addTeamMember = () => {
        setTeamMembers([...teamMembers, { id: Date.now(), name: '', studentId: '', role: '', email: '', isLeader: false }]);
    };

    const updateTeamMember = (id: number, field: keyof TeamMemberUI, value: string | boolean) => {
        setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const removeTeamMember = (id: number) => {
        if (teamMembers.length > 1) setTeamMembers(teamMembers.filter(m => m.id !== id));
    };

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    أعضاء الفريق *
                </h3>
                <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-sm transition-colors"
                    onClick={addTeamMember}
                >
                    إضافة عضو
                </button>
            </div>

            <div className="space-y-4">
                {teamMembers.map((member, index) => (
                    <TeamMemberCard
                        key={member.id}
                        member={member}
                        index={index}
                        updateTeamMember={updateTeamMember}
                        removeTeamMember={removeTeamMember}
                    />
                ))}
            </div>
        </div>
    );
};

export default TeamMembersForm;

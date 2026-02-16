import React from 'react';
import { Card, ProgressBar } from '../../common';
import { StudentProfile } from '../../../types/api';

interface ProfileCardProps {
    profile: StudentProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Student Info */}
                <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {profile.fullName}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Grade Level</p>
                    <p className="text-lg font-semibold text-gray-900">
                        Grade {profile.gradeLevel}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">GPA</p>
                    <p className="text-lg font-semibold text-blue-600">
                        {profile.gpa.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Credits Earned</p>
                    <p className="text-lg font-semibold text-green-600">
                        {profile.creditsEarned} / {profile.creditsToGraduate}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar
                value={profile.progressPercentage}
                label="Graduation Progress"
                className="mt-6"
            />
            <p className="text-sm text-gray-600 mt-2">
                {profile.remainingCredits} credits remaining
            </p>
        </Card>
    );
};

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, User as UserIcon, Calendar, Shield, ArrowLeft } from 'lucide-react';

const Profile = ({ onNavigate }) => {
    const { user } = useAuth();

    if (!user) return null;

    const profileData = [
        { icon: UserIcon, label: 'Display Name', value: user.displayName || 'Not set' },
        { icon: Mail, label: 'Email', value: user.email || 'Not set' },
        { icon: Calendar, label: 'Created', value: user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A' },
        { icon: Shield, label: 'Account Type', value: user.isAnonymous ? 'Anonymous' : 'Authenticated' }
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => onNavigate?.('home')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            </div>

            <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Avatar Section */}
                <div className="bg-brand-gradient p-8 text-center">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white shadow-lg mx-auto flex items-center justify-center text-white text-3xl font-bold">
                            {user.displayName?.[0] || user.email?.[0] || 'U'}
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-white mt-4">{user.displayName || 'User'}</h2>
                </div>

                {/* Profile Details */}
                <div className="p-6 space-y-4">
                    {profileData.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-brand-primary">
                                <item.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;

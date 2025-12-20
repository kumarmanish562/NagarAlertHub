import React, { useState } from 'react';
import { User, Bell, Shield, Lock, Globe, Moon, Save, Camera } from 'lucide-react';

const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-700/50 pb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-600'}`}
        >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

const InputField = ({ label, type = "text", defaultValue, placeholder }) => (
    <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
        />
    </div>
);

const Settings = () => {
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [publicProfile, setPublicProfile] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = React.useRef(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
                    <p className="text-gray-400">Manage your command center preferences and account configuration.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            <div className="grid gap-6">
                {/* Profile Settings */}
                <SettingsSection title="Profile & App Setup" icon={User}>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Picture Column */}
                        <div className="flex flex-col items-center gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div
                                onClick={handleImageClick}
                                className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-[#0f172a] shadow-xl relative group cursor-pointer overflow-hidden bg-cover bg-center"
                                style={profileImage ? { backgroundImage: `url(${profileImage})` } : {}}
                            >
                                {!profileImage && <span>K</span>}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </div>
                            <button
                                onClick={handleImageClick}
                                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                            >
                                Change Photo
                            </button>
                        </div>

                        {/* Inputs Column */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                            <InputField label="Full Name" defaultValue="Officer K." />
                            <InputField label="Email Address" type="email" defaultValue="k.officer@nagaralert.gov.in" />
                            <InputField label="Department" defaultValue="Traffic Control Division" />
                            <InputField label="Designation" defaultValue="Senior Administrator" />
                        </div>
                    </div>
                </SettingsSection>

                {/* Notifications */}
                <SettingsSection title="Notifications & Alerts" icon={Bell}>
                    <Toggle
                        label="Push Notifications"
                        description="Receive real-time alerts for critical incidents over the browser."
                        checked={notifications}
                        onChange={setNotifications}
                    />
                    <Toggle
                        label="Email Digests"
                        description="Daily summary of solved cases and division performance."
                        checked={emailAlerts}
                        onChange={setEmailAlerts}
                    />
                </SettingsSection>

                {/* Security */}
                <SettingsSection title="Security & Access" icon={Lock}>
                    <div className="grid gap-4">
                        <button className="text-left w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800 transition-colors flex justify-between items-center group">
                            <span>Change Password</span>
                            <span className="text-xs text-gray-500 group-hover:text-white">Last changed 30 days ago</span>
                        </button>
                        <button className="text-left w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800 transition-colors flex justify-between items-center">
                            <span>Two-Factor Authentication</span>
                            <span className="text-xs text-green-500 font-medium">Enabled</span>
                        </button>
                    </div>
                </SettingsSection>

                {/* Appearance */}
                <SettingsSection title="Appearance" icon={Moon}>
                    <Toggle
                        label="Dark Mode"
                        description="Use dark theme for the command center interface."
                        checked={darkMode}
                        onChange={setDarkMode}
                    />
                    <Toggle
                        label="Compact Mode"
                        description="Reduce padding and font size for higher data density."
                        checked={false}
                        onChange={() => { }}
                    />
                </SettingsSection>
            </div>
        </div>
    );
};

export default Settings;

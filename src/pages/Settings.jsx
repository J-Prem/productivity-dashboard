import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import {
    User, Bell, Shield, Palette, Globe, Download,
    Key, Trash2, ChevronRight, Check, Sun, Moon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Section = ({ title, description, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white">{title}</h3>
            {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const Toggle = ({ checked, onChange }) => (
    <button onClick={() => onChange(!checked)}
        className={clsx('relative inline-flex w-11 h-6 rounded-full transition-colors duration-200', checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700')}
    >
        <span className={clsx('inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 absolute top-0.5', checked ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
);

export default function Settings() {
    const { darkMode, toggleDarkMode } = useStore();
    const [notifs, setNotifs] = useState({ tasks: true, meetings: true, weekly: false, email: true });
    const [profile, setProfile] = useState({ name: 'Prem', email: 'prem@gmail.com', role: 'Product Manager', timezone: 'Asia/Kolkata' });

    const handleSave = () => toast.success('Settings saved!');

    const timezones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'];
    const themes = [{ id: 'light', label: 'Light', icon: Sun }, { id: 'dark', label: 'Dark', icon: Moon }, { id: 'system', label: 'System', icon: Globe }];
    const [themeChoice, setThemeChoice] = useState('system');

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            {/* Profile */}
            <Section title="Profile" description="Manage your account information">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">P</div>
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{profile.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{profile.email}</p>
                        <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-1">Change avatar</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Full Name', key: 'name', type: 'text' },
                        { label: 'Email Address', key: 'email', type: 'email' },
                        { label: 'Job Title', key: 'role', type: 'text' },
                    ].map(field => (
                        <div key={field.key} className={field.key === 'email' ? '' : ''}>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{field.label}</label>
                            <input
                                type={field.type}
                                value={profile[field.key]}
                                onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Timezone</label>
                        <select
                            value={profile.timezone}
                            onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}
                            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                        >
                            {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                        </select>
                    </div>
                </div>
                <button onClick={handleSave} className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors">Save Changes</button>
            </Section>

            {/* Appearance */}
            <Section title="Appearance" description="Customize the look and feel">
                <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</p>
                    <div className="flex gap-3">
                        {themes.map(({ id, label, icon: Icon }) => (
                            <button key={id}
                                onClick={() => { setThemeChoice(id); if (id === 'dark' && !darkMode) toggleDarkMode(); if (id === 'light' && darkMode) toggleDarkMode(); }}
                                className={clsx('flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                                    themeChoice === id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600')}
                            >
                                <Icon className={clsx('w-5 h-5', themeChoice === id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400')} />
                                <span className={clsx('text-sm font-medium', themeChoice === id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400')}>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Notifications */}
            <Section title="Notifications" description="Control what you get notified about">
                <div className="space-y-4">
                    {[
                        { key: 'tasks', label: 'Task Reminders', desc: 'Get notified before task deadlines' },
                        { key: 'meetings', label: 'Meeting Summaries', desc: 'AI summary ready notifications' },
                        { key: 'weekly', label: 'Weekly Reports', desc: 'Productivity digest every Monday' },
                        { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-slate-800 dark:text-white">{item.label}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                            </div>
                            <Toggle checked={notifs[item.key]} onChange={v => setNotifs(n => ({ ...n, [item.key]: v }))} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* Data */}
            <Section title="Data & Privacy" description="Manage your data">
                <div className="space-y-2">
                    {[
                        { icon: Download, label: 'Export all data', desc: 'Download your tasks and meetings as JSON', color: 'text-slate-600 dark:text-slate-300', action: () => toast('Export ready!', { icon: 'ðŸ“¦' }) },
                        { icon: Key, label: 'Change password', desc: 'Update your account password', color: 'text-slate-600 dark:text-slate-300', action: handleSave },
                        { icon: Trash2, label: 'Delete account', desc: 'Permanently delete all data', color: 'text-red-500', action: () => toast.error('Please contact support to delete your account') },
                    ].map(item => (
                        <button key={item.label} onClick={item.action}
                            className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <item.icon className={clsx('w-4 h-4', item.color)} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className={clsx('text-sm font-medium', item.color)}>{item.label}</p>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
                        </button>
                    ))}
                </div>
            </Section>

            {/* App Info */}
            <div className="text-center">
                <p className="text-xs text-slate-400 dark:text-slate-600">NoteFlow AI Â· v1.0.0 Â· Built with React + Tailwind CSS</p>
            </div>
        </div>
    );
}


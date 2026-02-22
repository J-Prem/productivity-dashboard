import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
    Search, Bell, Sun, Moon, ChevronDown, User,
    LogOut, Settings, HelpCircle, X,
} from 'lucide-react';
import clsx from 'clsx';

const notifications = [
    { id: 1, type: 'task', message: 'Budget report deadline in 1 hour', time: '5m ago', unread: true },
    { id: 2, type: 'meeting', message: 'Q1 Strategy meeting summary generated', time: '1h ago', unread: true },
    { id: 3, type: 'task', message: 'Fix payment bug marked as in-progress', time: '2h ago', unread: false },
    { id: 4, type: 'info', message: 'Weekly report ready to view', time: '5h ago', unread: false },
];

export default function TopBar() {
    const { darkMode, toggleDarkMode, activePage } = useStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifList, setNotifList] = useState(notifications);

    const unreadCount = notifList.filter(n => n.unread).length;

    const pageTitle = {
        dashboard: 'Dashboard',
        meetings: 'Meeting Notes',
        tasks: 'Tasks',
        calendar: 'Smart Planner',
        analytics: 'Analytics',
        settings: 'Settings',
    }[activePage] || 'Dashboard';

    const markAllRead = () => setNotifList(n => n.map(item => ({ ...item, unread: false })));

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
            {/* Page Title */}
            <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">{pageTitle}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-48 focus:w-64 transition-all duration-300"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3">
                            <X className="w-3 h-3 text-slate-400" />
                        </button>
                    )}
                </div>

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                    <motion.div key={darkMode ? 'dark' : 'light'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                        {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                    </motion.div>
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                        className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Notifications</h3>
                                    <button onClick={markAllRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Mark all read</button>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {notifList.map(n => (
                                        <div key={n.id} className={clsx('flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors', n.unread && 'bg-indigo-50/50 dark:bg-indigo-900/10')}>
                                            <div className={clsx('w-2 h-2 rounded-full mt-1.5 shrink-0', n.unread ? 'bg-indigo-500' : 'bg-transparent')} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-slate-700 dark:text-slate-300">{n.message}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            P
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">Prem</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                            >
                                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm">Prem</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">prem@gmail.com</p>
                                </div>
                                {[
                                    { icon: User, label: 'Profile' },
                                    { icon: Settings, label: 'Settings' },
                                    { icon: HelpCircle, label: 'Help & Support' },
                                ].map(({ icon: Icon, label }) => (
                                    <button key={label} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                                <div className="border-t border-slate-200 dark:border-slate-700">
                                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Backdrop for dropdowns */}
            {(showNotifications || showProfile) && (
                <div className="fixed inset-0 z-40" onClick={() => { setShowNotifications(false); setShowProfile(false); }} />
            )}
        </header>
    );
}

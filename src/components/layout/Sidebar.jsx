import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
    LayoutDashboard, FileText, CheckSquare, Calendar,
    BarChart2, Settings, ChevronLeft, ChevronRight, Zap,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meetings', label: 'Meeting Notes', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    const { sidebarCollapsed, setSidebarCollapsed, activePage, setActivePage } = useStore();

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarCollapsed ? 72 : 240 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative flex flex-col h-screen bg-slate-900 dark:bg-[#0d1117] shadow-2xl z-30 overflow-hidden shrink-0"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <AnimatePresence>
                    {!sidebarCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="font-bold text-white text-lg whitespace-nowrap"
                        >
                            NoteFlow AI
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ id, label, icon: Icon }) => {
                    const isActive = activePage === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setActivePage(id)}
                            className={clsx(
                                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            )}
                        >
                            <Icon className={clsx('w-5 h-5 shrink-0 transition-transform duration-200', !isActive && 'group-hover:scale-110')} />
                            <AnimatePresence>
                                {!sidebarCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-sm font-medium whitespace-nowrap"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {/* Tooltip when collapsed */}
                            {sidebarCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    {label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="p-3 border-t border-slate-700/50">
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="flex items-center justify-center w-full py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                >
                    {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : (
                        <div className="flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs font-medium">Collapse</span>
                        </div>
                    )}
                </button>
            </div>
        </motion.aside>
    );
}

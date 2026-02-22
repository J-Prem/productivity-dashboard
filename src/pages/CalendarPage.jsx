import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, Flag } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay, isToday } from 'date-fns';
import clsx from 'clsx';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
    const { calendarEvents, tasks } = useStore();
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026
    const [view, setView] = useState('month');

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startPadding = getDay(monthStart);

    const getEventsForDay = (day) => calendarEvents.filter(e => isSameDay(new Date(e.date + 'T12:00:00'), day));
    const getTasksForDay = (day) => tasks.filter(t => t.deadline && isSameDay(new Date(t.deadline + 'T12:00:00'), day));

    const upcomingDeadlines = [...tasks]
        .filter(t => t.deadline && t.status !== 'completed')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 6);

    const PRIORITY_DOT = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-emerald-500' };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Main Calendar */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white min-w-36 text-center">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentDate(new Date(2026, 1, 22))}
                            className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Today
                        </button>
                        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            {['month', 'week'].map(v => (
                                <button key={v} onClick={() => setView(v)}
                                    className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', view === v ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400')}>
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Day Labels */}
                <div className="grid grid-cols-7 mb-2">
                    {DAY_LABELS.map(d => (
                        <div key={d} className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-2">{d}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 flex-1 gap-1 overflow-hidden">
                    {/* Padding cells */}
                    {Array.from({ length: startPadding }).map((_, i) => (
                        <div key={`pad-${i}`} className="min-h-20 p-1 rounded-xl" />
                    ))}

                    {days.map((day) => {
                        const dayEvents = getEventsForDay(day);
                        const dayTasks = getTasksForDay(day);
                        const today = isToday(day);
                        const sameMo = isSameMonth(day, currentDate);
                        const hasItems = dayEvents.length > 0 || dayTasks.length > 0;

                        return (
                            <motion.div
                                key={day.toString()}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.1 }}
                                className={clsx(
                                    'min-h-20 p-1.5 rounded-xl border cursor-pointer transition-colors overflow-hidden',
                                    today
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600'
                                        : hasItems
                                            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                            : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50',
                                    !sameMo && 'opacity-30'
                                )}
                            >
                                <div className={clsx('text-sm font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full', today ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300')}>
                                    {format(day, 'd')}
                                </div>
                                <div className="space-y-0.5">
                                    {dayEvents.slice(0, 2).map(e => (
                                        <div key={e.id} className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded-md text-white truncate', e.color)}>
                                            {e.title}
                                        </div>
                                    ))}
                                    {dayTasks.slice(0, 1).map(t => (
                                        <div key={t.id} className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                            <div className={clsx('w-1.5 h-1.5 rounded-full shrink-0', PRIORITY_DOT[t.priority])} />
                                            {t.title}
                                        </div>
                                    ))}
                                    {(dayEvents.length + dayTasks.length) > 3 && (
                                        <div className="text-[10px] text-slate-400 text-center">+{dayEvents.length + dayTasks.length - 3} more</div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-indigo-500" /> Meeting</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500" /> Deadline</div>
                    <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Task Due</div>
                </div>
            </div>

            {/* Sidebar: Upcoming Deadlines */}
            <div className="w-72 shrink-0 border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                    <Flag className="w-4 h-4 text-red-500" />
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Upcoming Deadlines</h3>
                </div>

                <div className="space-y-2">
                    {upcomingDeadlines.map(task => {
                        const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                        const isUrgent = daysLeft <= 2;
                        return (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                            >
                                <p className="text-sm font-medium text-slate-800 dark:text-white line-clamp-2 mb-2">{task.title}</p>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', isUrgent ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400')}>
                                        {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Events this month */}
                <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                        <CalIcon className="w-4 h-4 text-indigo-500" />
                        <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Events</h3>
                    </div>
                    <div className="space-y-2">
                        {calendarEvents.map(e => (
                            <div key={e.id} className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                <div className={clsx('w-2.5 h-2.5 rounded-full shrink-0', e.color)} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-800 dark:text-white truncate">{e.title}</p>
                                    <p className="text-xs text-slate-400">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


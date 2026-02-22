import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useStore } from '../store/useStore';
import {
    CheckCircle2, Circle, AlertCircle, Clock, TrendingUp,
    Target, Calendar, ArrowRight, Flame,
} from 'lucide-react';
import clsx from 'clsx';

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

function SummaryCard({ title, value, subtitle, icon: Icon, gradient, index }) {
    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200"
        >
            <div className={clsx('absolute inset-0 opacity-5', gradient)} />
            <div className="flex items-start justify-between relative">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
                </div>
                <div className={clsx('p-3 rounded-xl', gradient)}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
        </motion.div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-3 text-sm">
                <p className="font-semibold text-slate-800 dark:text-white mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
                ))}
            </div>
        );
    }
    return null;
};

const heatmapData = [
    { label: 'Mon', hours: [2, 3, 0, 1, 4, 2, 3] },
    { label: 'Tue', hours: [4, 2, 3, 4, 3, 1, 2] },
    { label: 'Wed', hours: [1, 0, 2, 3, 2, 4, 1] },
    { label: 'Thu', hours: [3, 4, 4, 2, 3, 3, 2] },
    { label: 'Fri', hours: [2, 3, 1, 4, 2, 0, 3] },
];
const timeSlots = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'];

function HeatCell({ value }) {
    const colors = ['bg-slate-100 dark:bg-slate-700', 'bg-indigo-100 dark:bg-indigo-900/40', 'bg-indigo-300 dark:bg-indigo-700', 'bg-indigo-500', 'bg-indigo-700'];
    return <div className={clsx('w-8 h-8 rounded-md transition-transform hover:scale-110 cursor-pointer', colors[value])} title={`${value}h focus`} />;
}

export default function Dashboard() {
    const { tasks, weeklyData, calendarEvents } = useStore();

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

    const pieData = [
        { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
        { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
    ];

    const upcoming = [...calendarEvents].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);

    const summaryCards = [
        { title: 'Total Tasks', value: total, subtitle: 'Across all projects', icon: Target, gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600', index: 0 },
        { title: 'Completed', value: completed, subtitle: `${Math.round((completed / total) * 100)}% completion rate`, icon: CheckCircle2, gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600', index: 1 },
        { title: 'Pending', value: pending, subtitle: 'Awaiting action', icon: Circle, gradient: 'bg-gradient-to-br from-amber-500 to-orange-500', index: 2 },
        { title: 'High Priority', value: highPriority, subtitle: 'Require immediate attention', icon: Flame, gradient: 'bg-gradient-to-br from-red-500 to-rose-600', index: 3 },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} {...card} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Weekly Productivity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-semibold text-slate-800 dark:text-white">Weekly Productivity</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Tasks completed vs total this week</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            +12% vs last week
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={weeklyData}>
                            <defs>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e0e7ff" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#e0e7ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="total" name="Total" stroke="#e0e7ff" strokeWidth={2} fill="url(#colorTotal)" />
                            <Area type="monotone" dataKey="completed" name="Completed" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorCompleted)" dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Priority Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700"
                >
                    <h2 className="font-semibold text-slate-800 dark:text-white mb-1">Priority Split</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Task distribution by priority</p>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                                {pieData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2">
                        {pieData.map(item => (
                            <div key={item.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                                {item.name} ({item.value})
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Heatmap + Upcoming */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Priority Heatmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700"
                >
                    <h2 className="font-semibold text-slate-800 dark:text-white mb-1">Focus Heatmap</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Deep work hours by day & time slot</p>
                    <div className="overflow-x-auto">
                        <div className="flex gap-2 min-w-[320px]">
                            <div className="flex flex-col gap-2 pt-6">
                                {heatmapData.map(row => (
                                    <div key={row.label} className="text-xs text-slate-400 dark:text-slate-500 font-medium h-8 flex items-center w-8">{row.label}</div>
                                ))}
                            </div>
                            <div className="flex-1">
                                <div className="flex gap-2 mb-2">
                                    {timeSlots.map(t => <div key={t} className="text-xs text-slate-400 dark:text-slate-500 font-medium w-8 text-center">{t}</div>)}
                                </div>
                                <div className="space-y-2">
                                    {heatmapData.map(row => (
                                        <div key={row.label} className="flex gap-2">
                                            {row.hours.map((h, i) => <HeatCell key={i} value={h} />)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                            <span>Less</span>
                            {[0, 1, 2, 3, 4].map(v => <HeatCell key={v} value={v} />)}
                            <span>More</span>
                        </div>
                    </div>
                </motion.div>

                {/* Upcoming Deadlines */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-slate-800 dark:text-white">Upcoming</h2>
                        <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="space-y-3">
                        {upcoming.map(event => (
                            <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                                <div className={clsx('w-2.5 h-2.5 rounded-full shrink-0', event.color)} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{event.title}</p>
                                    <p className="text-xs text-slate-400">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                </div>
                                <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', event.type === 'deadline' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400')}>
                                    {event.type}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="flex items-center gap-1 mt-4 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                        View all on calendar <ArrowRight className="w-3 h-3" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}


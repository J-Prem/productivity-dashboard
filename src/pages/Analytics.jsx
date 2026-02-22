import { motion } from 'framer-motion';
import {
    BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useStore } from '../store/useStore';
import { TrendingUp, CheckCircle2, Clock, Zap } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-3 text-sm">
                {label && <p className="font-semibold text-slate-800 dark:text-white mb-1">{label}</p>}
                {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>)}
            </div>
        );
    }
    return null;
};

const trendData = [
    { week: 'W1', completed: 18, meetings: 4, focus: 32 },
    { week: 'W2', completed: 24, meetings: 6, focus: 38 },
    { week: 'W3', completed: 20, meetings: 3, focus: 28 },
    { week: 'W4', completed: 31, meetings: 8, focus: 45 },
    { week: 'W5', completed: 28, meetings: 5, focus: 42 },
    { week: 'W6', completed: 35, meetings: 7, focus: 50 },
    { week: 'W7', completed: 33, meetings: 6, focus: 48 },
    { week: 'W8', completed: 40, meetings: 9, focus: 56 },
];

const categoryData = [
    { name: 'Engineering', completed: 12, pending: 4 },
    { name: 'Design', completed: 5, pending: 3 },
    { name: 'Marketing', completed: 8, pending: 5 },
    { name: 'Finance', completed: 3, pending: 2 },
    { name: 'HR', completed: 4, pending: 3 },
];

const STATS = [
    { label: 'Avg Tasks/Week', value: '28.6', icon: CheckCircle2, trend: '+18%', positive: true, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Avg Focus Hours', value: '42h', icon: Zap, trend: '+12%', positive: true, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Meetings/Week', value: '6.1', icon: Clock, trend: '+2%', positive: true, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Completion Rate', value: '78%', icon: TrendingUp, trend: '+5%', positive: true, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
];

export default function Analytics() {
    const { tasks, weeklyData } = useStore();

    const pieData = [
        { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
        { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#6366f1' },
        { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#f59e0b' },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                        <div className={`inline-flex p-2.5 rounded-xl ${stat.bg} mb-3`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
                        <p className={`text-xs font-semibold mt-1.5 ${stat.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{stat.trend} vs prev period</p>
                    </motion.div>
                ))}
            </div>

            {/* Trend + Pie */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                    <h2 className="font-semibold text-slate-800 dark:text-white mb-1">Productivity Trends</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">8-week overview of tasks, meetings & focus hours</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                            <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                            <Area type="monotone" dataKey="completed" name="Tasks Completed" stroke="#10b981" strokeWidth={2.5} fill="url(#gc)" />
                            <Area type="monotone" dataKey="focus" name="Focus Hours" stroke="#6366f1" strokeWidth={2} fill="url(#gf)" strokeDasharray="5 3" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                    <h2 className="font-semibold text-slate-800 dark:text-white mb-1">Task Status</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Current distribution</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {pieData.map(item => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                                    {item.name}
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Category Breakdown */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
                <h2 className="font-semibold text-slate-800 dark:text-white mb-1">Tasks by Category</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Completed vs pending across departments</p>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={categoryData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
}


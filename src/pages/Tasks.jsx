import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors,
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store/useStore';
import {
    Plus, GripVertical, CheckCircle2, Circle, Trash2,
    Flag, Calendar, Filter, X, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const PRIORITY_CONFIG = {
    high: { label: 'High', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
    medium: { label: 'Medium', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    low: { label: 'Low', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
};

const STATUS_CONFIG = {
    pending: { label: 'Pending', bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400' },
    'in-progress': { label: 'In Progress', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
    completed: { label: 'Done', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
};

function SortableTask({ task, onToggle, onDelete, onUpdate }) {
    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const pri = PRIORITY_CONFIG[task.priority];
    const sta = STATUS_CONFIG[task.status];
    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className={clsx(
                'flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border rounded-xl shadow-sm transition-all duration-200',
                isDragging ? 'shadow-xl scale-105 z-50 border-indigo-400' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md',
                task.status === 'completed' && 'opacity-60'
            )}
        >
            {/* Drag Handle */}
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-400 shrink-0">
                <GripVertical className="w-4 h-4" />
            </button>

            {/* Complete Toggle */}
            <button onClick={() => onToggle(task.id)} className="shrink-0 text-slate-300 dark:text-slate-600 hover:text-emerald-500 transition-colors">
                {task.status === 'completed'
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    : <Circle className="w-5 h-5" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={clsx('text-sm font-medium text-slate-800 dark:text-white truncate', task.status === 'completed' && 'line-through text-slate-400 dark:text-slate-500')}>
                    {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{task.category}</span>
                    {task.deadline && (
                        <span className={clsx('flex items-center gap-1 text-xs', isOverdue ? 'text-red-500 font-medium' : 'text-slate-400 dark:text-slate-500')}>
                            <Calendar className="w-3 h-3" />
                            {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {isOverdue && ' Â· Overdue'}
                        </span>
                    )}
                </div>
            </div>

            {/* Priority Badge */}
            <span className={clsx('flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0', pri.bg, pri.text)}>
                <div className={clsx('w-1.5 h-1.5 rounded-full', pri.dot)} />
                {pri.label}
            </span>

            {/* Status Badge */}
            <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full shrink-0 hidden sm:block', sta.bg, sta.text)}>
                {sta.label}
            </span>

            {/* Delete */}
            <button onClick={() => onDelete(task.id)} className="shrink-0 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export default function Tasks() {
    const { tasks, addTask, deleteTask, toggleTaskComplete, reorderTasks } = useStore();
    const [filter, setFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', priority: 'medium', deadline: '', category: '' });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex(t => t.id === active.id);
            const newIndex = tasks.findIndex(t => t.id === over?.id);
            reorderTasks(arrayMove(tasks, oldIndex, newIndex));
        }
    };

    const handleDelete = (id) => {
        deleteTask(id);
        toast('Task deleted', { icon: 'ðŸ—‘ï¸' });
    };

    const handleAdd = () => {
        if (!newTask.title.trim()) { toast.error('Task title is required'); return; }
        addTask({ ...newTask, status: 'pending' });
        setNewTask({ title: '', priority: 'medium', deadline: '', category: '' });
        setShowAddForm(false);
        toast.success('Task added!');
    };

    const filtered = tasks.filter(t => {
        const statusMatch = filter === 'all' || t.status === filter;
        const priorityMatch = priorityFilter === 'all' || t.priority === priorityFilter;
        return statusMatch && priorityMatch;
    });

    const statusCounts = {
        all: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        'in-progress': tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Task Manager</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Drag to reorder Â· Click to mark done</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-md shadow-indigo-500/25"
                >
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-4 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                placeholder="Task title *"
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                className="col-span-1 sm:col-span-2 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                            />
                            <input
                                placeholder="Category (e.g. Engineering)"
                                value={newTask.category}
                                onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                            />
                            <input
                                type="date"
                                value={newTask.deadline}
                                onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                            />
                            <div className="flex gap-2">
                                {['high', 'medium', 'low'].map(p => (
                                    <button key={p} onClick={() => setNewTask({ ...newTask, priority: p })}
                                        className={clsx('flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-colors', newTask.priority === p ? `${PRIORITY_CONFIG[p].bg} ${PRIORITY_CONFIG[p].text}` : 'bg-slate-100 dark:bg-slate-700 text-slate-500')}
                                    >{p}</button>
                                ))}
                            </div>
                            <div className="flex gap-2 sm:col-span-1 justify-end">
                                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium">Cancel</button>
                                <button onClick={handleAdd} className="px-4 py-2 text-xs bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium">Add Task</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {Object.entries(statusCounts).map(([key, count]) => (
                        <button key={key} onClick={() => setFilter(key)}
                            className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', filter === key ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300')}
                        >
                            {key === 'all' ? 'All' : key === 'in-progress' ? 'In Progress' : key.charAt(0).toUpperCase() + key.slice(1)} ({count})
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {['all', 'high', 'medium', 'low'].map(p => (
                        <button key={p} onClick={() => setPriorityFilter(p)}
                            className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', priorityFilter === p ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400')}
                        >{p}</button>
                    ))}
                </div>
                <div className="ml-auto text-xs text-slate-400 dark:text-slate-500">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</div>
            </div>

            {/* Task List */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filtered.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence>
                        <div className="space-y-2">
                            {filtered.length === 0 ? (
                                <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No tasks match your filters</p>
                                </div>
                            ) : (
                                filtered.map(task => (
                                    <SortableTask
                                        key={task.id}
                                        task={task}
                                        onToggle={toggleTaskComplete}
                                        onDelete={handleDelete}
                                        onUpdate={() => { }}
                                    />
                                ))
                            )}
                        </div>
                    </AnimatePresence>
                </SortableContext>
            </DndContext>
        </div>
    );
}


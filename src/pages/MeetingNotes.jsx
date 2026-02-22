import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import {
    FileText, Sparkles, Upload, Plus, ChevronDown, ChevronUp,
    Clock, Tag, CheckCircle2, Mic, Download, ArrowRight, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const TAGS = ['strategy', 'engineering', 'design', 'planning', 'finance', 'hr', 'marketing'];

function MeetingCard({ meeting, isSelected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                'w-full text-left p-4 rounded-xl border transition-all duration-200',
                isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm truncate">{meeting.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                {meeting.summary && (
                    <div className="flex items-center gap-1 shrink-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        <Sparkles className="w-3 h-3" /> AI
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
                {meeting.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">{tag}</span>
                ))}
            </div>
        </button>
    );
}

export default function MeetingNotes() {
    const { meetings, addMeeting, updateMeeting } = useStore();
    const [selectedId, setSelectedId] = useState(meetings[0]?.id || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [showSummary, setShowSummary] = useState(true);

    const selected = meetings.find(m => m.id === selectedId);

    const generateSummary = async () => {
        if (!selected) return;
        setIsGenerating(true);
        await new Promise(r => setTimeout(r, 2200));

        const mockSummary = `The ${selected.title} meeting covered key strategic topics with actionable next steps identified. Participants reached consensus on primary objectives, timelines were discussed and agreed upon, and responsibilities were distributed across team members. The session highlighted several important priorities requiring immediate attention, and a clear execution path was established for the coming weeks.`;

        const mockActions = [
            'Schedule follow-up review meeting within one week',
            'Distribute meeting notes to all stakeholders by EOD',
            'Update project tracking board with new milestones',
            'Prepare detailed timeline proposal by Friday',
        ];

        updateMeeting(selectedId, {
            summary: mockSummary,
            actionItems: mockActions,
        });
        setIsGenerating(false);
        toast.success('AI summary generated successfully!', { icon: 'âœ¨' });
    };

    const handleAddMeeting = () => {
        if (!newTitle.trim()) { toast.error('Please enter a meeting title'); return; }
        addMeeting({
            title: newTitle,
            date: new Date().toISOString().split('T')[0],
            rawNotes: '',
            summary: '',
            actionItems: [],
            tags: selectedTags,
        });
        setNewTitle('');
        setSelectedTags([]);
        setShowNewForm(false);
        toast.success('Meeting created!');
    };

    const handleUpdateNotes = (e) => {
        updateMeeting(selectedId, { rawNotes: e.target.value });
    };

    const handleUpload = () => {
        toast('Transcript upload feature coming soon!', { icon: 'ðŸ“„' });
    };

    const handleExport = () => {
        if (!selected) return;
        const content = `# ${selected.title}\nDate: ${selected.date}\n\n## Raw Notes\n${selected.rawNotes}\n\n## AI Summary\n${selected.summary}\n\n## Action Items\n${selected.actionItems.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${selected.title.replace(/\s+/g, '-')}.md`; a.click();
        toast.success('Notes exported!');
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Meetings List */}
            <div className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-slate-800 dark:text-white text-sm">All Meetings</h2>
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">{meetings.length}</span>
                    </div>
                    <button
                        onClick={() => setShowNewForm(!showNewForm)}
                        className="flex items-center gap-2 w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> New Meeting
                    </button>
                    <AnimatePresence>
                        {showNewForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 space-y-2 overflow-hidden"
                            >
                                <input
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    placeholder="Meeting title..."
                                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                                />
                                <div className="flex flex-wrap gap-1">
                                    {TAGS.slice(0, 4).map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                                            className={clsx('text-xs px-2 py-0.5 rounded-full transition-colors', selectedTags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400')}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleAddMeeting} className="flex-1 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors">Create</button>
                                    <button onClick={() => setShowNewForm(false)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {meetings.map(meeting => (
                        <MeetingCard key={meeting.id} meeting={meeting} isSelected={meeting.id === selectedId} onClick={() => setSelectedId(meeting.id)} />
                    ))}
                </div>
            </div>

            {/* Main Editor */}
            {selected ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-white">{selected.title}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(selected.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsRecording(!isRecording)} className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all', isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')}>
                                <Mic className="w-4 h-4" />
                                {isRecording ? 'Recording...' : 'Voice'}
                            </button>
                            <button onClick={handleUpload} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                <Upload className="w-4 h-4" /> Upload
                            </button>
                            <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                <Download className="w-4 h-4" /> Export
                            </button>
                            <button
                                onClick={generateSummary}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-indigo-500/25 disabled:opacity-60"
                            >
                                <Sparkles className={clsx('w-4 h-4', isGenerating && 'animate-spin')} />
                                {isGenerating ? 'Generating...' : 'Generate AI Summary'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 h-full divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-700">
                            {/* Notes Editor */}
                            <div className="flex flex-col p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Meeting Notes</span>
                                </div>
                                <textarea
                                    value={selected.rawNotes}
                                    onChange={handleUpdateNotes}
                                    placeholder="Start typing your meeting notes here, or upload a transcript..."
                                    className="flex-1 w-full text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono leading-relaxed min-h-[400px]"
                                />
                            </div>

                            {/* AI Output */}
                            <div className="flex flex-col p-6 bg-slate-50 dark:bg-slate-900/30">
                                {isGenerating ? (
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                                    </div>
                                ) : selected.summary ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                        {/* Summary */}
                                        <div>
                                            <button
                                                onClick={() => setShowSummary(!showSummary)}
                                                className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                                            >
                                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                                AI Summary
                                                {showSummary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>
                                            <AnimatePresence>
                                                {showSummary && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                    >
                                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/60 dark:border-indigo-700/40 rounded-xl p-4">
                                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selected.summary}</p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Action Items */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Extracted Action Items</span>
                                                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">{selected.actionItems.length}</span>
                                            </div>
                                            <div className="space-y-2">
                                                {selected.actionItems.map((item, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl group hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors"
                                                    >
                                                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-600 group-hover:border-emerald-500 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                                            <ArrowRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                                        </div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
                                            <Sparkles className="w-8 h-8 text-indigo-500" />
                                        </div>
                                        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">No AI summary yet</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Add your meeting notes on the left, then click "Generate AI Summary" to extract key insights and action items.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">Select or create a meeting to get started</p>
                    </div>
                </div>
            )}
        </div>
    );
}


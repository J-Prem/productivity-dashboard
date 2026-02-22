import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const sampleTasks = [
    { id: '1', title: 'Review Q1 marketing strategy', priority: 'high', status: 'pending', deadline: '2026-02-25', category: 'Marketing' },
    { id: '2', title: 'Schedule follow-up with design team', priority: 'medium', status: 'pending', deadline: '2026-02-24', category: 'Design' },
    { id: '3', title: 'Prepare budget report for stakeholders', priority: 'high', status: 'in-progress', deadline: '2026-02-23', category: 'Finance' },
    { id: '4', title: 'Update project roadmap document', priority: 'low', status: 'pending', deadline: '2026-02-28', category: 'Planning' },
    { id: '5', title: 'Send weekly progress update email', priority: 'medium', status: 'completed', deadline: '2026-02-22', category: 'Communication' },
    { id: '6', title: 'Code review for authentication module', priority: 'high', status: 'completed', deadline: '2026-02-21', category: 'Engineering' },
    { id: '7', title: 'Onboarding materials for new hire', priority: 'medium', status: 'pending', deadline: '2026-03-01', category: 'HR' },
    { id: '8', title: 'Fix critical bug in payment flow', priority: 'high', status: 'in-progress', deadline: '2026-02-22', category: 'Engineering' },
];

const sampleMeetings = [
    {
        id: '1',
        title: 'Q1 Strategy Kickoff',
        date: '2026-02-22',
        rawNotes: `Meeting: Q1 Strategy Kickoff
Date: Feb 22, 2026
Attendees: Sarah Chen, Marcus Johnson, Priya Patel, Tom Williams

Discussion Points:
- Review of Q4 performance metrics - 15% growth YoY
- New product launch timeline pushed to April
- Marketing budget increased by 20%
- Need to hire 3 more engineers by March
- Customer feedback loop needs improvement

Decisions Made:
- Launch date confirmed: April 15, 2026
- GitHub integration to be deprecated
- New onboarding wizard to be prioritized

Next Steps:
- Sarah to finalize the product roadmap by next Friday
- Marcus to prepare budget proposal before end of month
- Priya to interview candidates this week
- Tom to create customer feedback survey`,
        summary: `The Q1 Strategy Kickoff established key priorities for the quarter including a confirmed product launch on April 15th, a 20% marketing budget increase, and a need to hire 3 engineers by March. The team agreed to prioritize the new onboarding wizard and improve the customer feedback loop. Q4 showed strong 15% YoY growth, providing a positive foundation.`,
        actionItems: [
            'Sarah to finalize product roadmap by Feb 28',
            'Marcus to prepare budget proposal by Feb 28',
            'Priya to complete engineer interviews this week',
            'Tom to create customer feedback survey by Feb 25',
        ],
        tags: ['strategy', 'q1', 'planning'],
    },
    {
        id: '2',
        title: 'Engineering Sprint Planning',
        date: '2026-02-20',
        rawNotes: `Sprint Planning Meeting - Feb 20
Team: Tom Williams, Alex Rivera, Nat Kim

Sprint 14 Goals:
- Payment flow bug fix (P0)
- Auth module code review
- Performance audit for dashboard
- Mobile responsiveness fixes

Blockers:
- Waiting on design specs for new onboarding
- Need access to production logs

Velocity: 42 story points last sprint, targeting 45 this sprint`,
        summary: `Sprint 14 planning session set targets of 45 story points, up from 42 in the previous sprint. Key priorities include fixing the P0 payment flow bug, completing the auth module review, and conducting a performance audit. Two blockers were identified: missing design specs for onboarding and lack of access to production logs.`,
        actionItems: [
            'Fix critical P0 payment flow bug',
            'Complete auth module code review',
            'Request production log access from DevOps',
            'Follow up with design team on onboarding specs',
        ],
        tags: ['engineering', 'sprint', 'technical'],
    },
];

const weeklyData = [
    { day: 'Mon', completed: 5, total: 8, focus: 6.5 },
    { day: 'Tue', completed: 7, total: 9, focus: 7.2 },
    { day: 'Wed', completed: 4, total: 7, focus: 5.0 },
    { day: 'Thu', completed: 8, total: 10, focus: 8.1 },
    { day: 'Fri', completed: 6, total: 8, focus: 6.8 },
    { day: 'Sat', completed: 2, total: 3, focus: 2.5 },
    { day: 'Sun', completed: 1, total: 2, focus: 1.0 },
];

const calendarEvents = [
    { id: 'e1', title: 'Product Review', date: '2026-02-23', type: 'meeting', color: 'bg-indigo-500' },
    { id: 'e2', title: 'Budget Deadline', date: '2026-02-23', type: 'deadline', color: 'bg-red-500' },
    { id: 'e3', title: 'Design Sync', date: '2026-02-25', type: 'meeting', color: 'bg-blue-500' },
    { id: 'e4', title: 'Project Launch', date: '2026-02-28', type: 'deadline', color: 'bg-orange-500' },
    { id: 'e5', title: 'Leadership All-Hands', date: '2026-03-01', type: 'meeting', color: 'bg-purple-500' },
    { id: 'e6', title: 'Q1 Report Due', date: '2026-03-05', type: 'deadline', color: 'bg-red-500' },
];

export const useStore = create(
    persist(
        (set, get) => ({
            // Theme
            darkMode: false,
            toggleDarkMode: () => {
                const newMode = !get().darkMode;
                set({ darkMode: newMode });
                if (newMode) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            },

            // Navigation
            sidebarCollapsed: false,
            activePage: 'dashboard',
            setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
            setActivePage: (page) => set({ activePage: page }),

            // Tasks
            tasks: sampleTasks,
            addTask: (task) => set((state) => ({ tasks: [...state.tasks, { ...task, id: Date.now().toString() }] })),
            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t),
            })),
            deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
            reorderTasks: (tasks) => set({ tasks }),
            toggleTaskComplete: (id) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
                ),
            })),

            // Meetings
            meetings: sampleMeetings,
            addMeeting: (meeting) => set((state) => ({
                meetings: [...state.meetings, { ...meeting, id: Date.now().toString() }],
            })),
            updateMeeting: (id, updates) => set((state) => ({
                meetings: state.meetings.map((m) => m.id === id ? { ...m, ...updates } : m),
            })),

            // Analytics
            weeklyData,
            calendarEvents,

            // Toasts (managed externally via react-hot-toast)
        }),
        {
            name: 'productivity-dashboard',
            partialize: (state) => ({
                darkMode: state.darkMode,
                tasks: state.tasks,
                meetings: state.meetings,
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
);

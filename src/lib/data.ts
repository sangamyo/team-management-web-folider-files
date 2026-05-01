import {
  Activity,
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  Code2,
  Globe2,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

/* ── Navigation ───────────────────────────────────────────────── */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/board", label: "Board" },
  { href: "/analytics", label: "Analytics" },
  { href: "/team", label: "Team" },
  { href: "/demo", label: "Demo" },
];

export const sidebarLinks = [
  { href: "/dashboard", label: "Command", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Rocket },
  { href: "/board", label: "Task Board", icon: CheckCircle2 },
  { href: "/team", label: "Team", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

/* ── Stats ────────────────────────────────────────────────────── */
export const stats = [
  { label: "Velocity Lift", value: 42, suffix: "%", icon: TrendingUp, color: "cyan" },
  { label: "Tasks Closed", value: 1284, suffix: "", icon: CheckCircle2, color: "emerald" },
  { label: "Active Pods", value: 18, suffix: "", icon: Users, color: "violet" },
  { label: "SLA Health", value: 99.3, suffix: "%", icon: ShieldCheck, color: "sky" },
];

export const dashboardMetrics = [
  { label: "Overdue Tasks", value: 7, suffix: "", icon: CalendarClock, trend: "down", trendVal: "−3 this week", color: "rose" },
  { label: "Completion Rate", value: 87, suffix: "%", icon: Target, trend: "up", trendVal: "+12% vs last sprint", color: "emerald" },
  { label: "Active Sprints", value: 4, suffix: "", icon: Zap, trend: "up", trendVal: "2 finishing this week", color: "cyan" },
  { label: "Comments Today", value: 34, suffix: "", icon: MessageSquare, trend: "up", trendVal: "+8 since morning", color: "violet" },
];

/* ── Projects ─────────────────────────────────────────────────── */
export const projects = [
  {
    name: "VisionOS Hiring Demo",
    description: "Recruiter-ready full-stack sprint with immersive 3D UI, JWT auth, and deployment configs.",
    owner: "Hariom",
    progress: 82,
    due: "May 18",
    health: "On Track",
    accent: "from-cyan-400 to-blue-500",
    members: ["HK", "AR", "MS"],
    tasks: 24,
    completed: 19,
  },
  {
    name: "AI Sprint Room",
    description: "Automated triage engine with intelligent task routing and deadline prediction.",
    owner: "Product",
    progress: 64,
    due: "May 24",
    health: "Needs Focus",
    accent: "from-violet-400 to-fuchsia-500",
    members: ["AR", "NP"],
    tasks: 18,
    completed: 11,
  },
  {
    name: "Recruiter Showcase",
    description: "Premium demo layer with cinematic page transitions and interactive feature walkthrough.",
    owner: "Design",
    progress: 91,
    due: "May 09",
    health: "Elite",
    accent: "from-emerald-300 to-cyan-400",
    members: ["HK", "MS", "LT"],
    tasks: 12,
    completed: 11,
  },
  {
    name: "API Gateway v2",
    description: "Scalable Express middleware with rate limiting, Zod validation, and MongoDB indexing.",
    owner: "Backend",
    progress: 45,
    due: "Jun 02",
    health: "At Risk",
    accent: "from-rose-400 to-orange-400",
    members: ["AR", "NP", "HK"],
    tasks: 30,
    completed: 13,
  },
];

/* ── Tasks ────────────────────────────────────────────────────── */
export const tasks = [
  {
    id: "t1",
    title: "Ship holographic landing page",
    status: "Completed",
    priority: "High",
    assignee: "HK",
    due: "Today",
    progress: 100,
    comments: 6,
    tags: ["Frontend", "3D"],
  },
  {
    id: "t2",
    title: "Connect JWT auth to protected routes",
    status: "In Progress",
    priority: "Critical",
    assignee: "AR",
    due: "Tomorrow",
    progress: 68,
    comments: 4,
    tags: ["Backend", "Auth"],
  },
  {
    id: "t3",
    title: "Add comments and activity timeline",
    status: "Pending",
    priority: "Medium",
    assignee: "MS",
    due: "May 06",
    progress: 0,
    comments: 2,
    tags: ["Frontend"],
  },
  {
    id: "t4",
    title: "Finalize Railway deployment variables",
    status: "Pending",
    priority: "High",
    assignee: "NP",
    due: "May 08",
    progress: 15,
    comments: 1,
    tags: ["DevOps"],
  },
  {
    id: "t5",
    title: "Build 3D analytics scene",
    status: "In Progress",
    priority: "High",
    assignee: "HK",
    due: "May 03",
    progress: 55,
    comments: 3,
    tags: ["3D", "R3F"],
  },
  {
    id: "t6",
    title: "Prepare GitHub submission page",
    status: "Completed",
    priority: "Medium",
    assignee: "LT",
    due: "Yesterday",
    progress: 100,
    comments: 2,
    tags: ["Frontend"],
  },
  {
    id: "t7",
    title: "Implement drag-and-drop kanban",
    status: "Completed",
    priority: "Critical",
    assignee: "HK",
    due: "Apr 28",
    progress: 100,
    comments: 8,
    tags: ["Frontend", "DnD"],
  },
  {
    id: "t8",
    title: "Design team avatar hologram orbs",
    status: "In Progress",
    priority: "Medium",
    assignee: "MS",
    due: "May 05",
    progress: 40,
    comments: 3,
    tags: ["Design", "3D"],
  },
  {
    id: "t9",
    title: "MongoDB index optimization",
    status: "Pending",
    priority: "Low",
    assignee: "AR",
    due: "May 12",
    progress: 0,
    comments: 0,
    tags: ["Backend", "DB"],
  },
];

/* ── Members ──────────────────────────────────────────────────── */
export const members = [
  { name: "Hariom", initials: "HK", role: "Admin", score: 98, color: "cyan", tasks: 14, completed: 12, status: "Online" },
  { name: "Aarav", initials: "AR", role: "Member", score: 87, color: "violet", tasks: 10, completed: 7, status: "Online" },
  { name: "Mira", initials: "MS", role: "Member", score: 92, color: "emerald", tasks: 8, completed: 6, status: "Away" },
  { name: "Nia", initials: "NP", role: "Member", score: 78, color: "sky", tasks: 6, completed: 3, status: "Offline" },
  { name: "Leo", initials: "LT", role: "Member", score: 85, color: "fuchsia", tasks: 5, completed: 4, status: "Online" },
];

/* ── Activity ─────────────────────────────────────────────────── */
export const activity = [
  { icon: Sparkles, title: "AI triaged 14 overdue risks", time: "2m ago", user: "System" },
  { icon: Bell, title: "Admin invited 3 reviewers", time: "18m ago", user: "Hariom" },
  { icon: CalendarClock, title: "Sprint deadline auto-adjusted", time: "1h ago", user: "System" },
  { icon: CheckCircle2, title: "Design QA checklist completed", time: "3h ago", user: "Mira" },
  { icon: Zap, title: "JWT auth flow merged to main", time: "5h ago", user: "Aarav" },
  { icon: Code2, title: "Railway config pushed", time: "8h ago", user: "Nia" },
  { icon: MessageSquare, title: "14 new comments on Sprint Board", time: "12h ago", user: "Leo" },
];

/* ── Analytics ────────────────────────────────────────────────── */
export const analyticsBars = [78, 92, 56, 88, 69, 97, 84];

export const weeklyData = [
  { day: "Mon", tasks: 12, completed: 9 },
  { day: "Tue", tasks: 15, completed: 14 },
  { day: "Wed", tasks: 8, completed: 5 },
  { day: "Thu", tasks: 18, completed: 16 },
  { day: "Fri", tasks: 11, completed: 8 },
  { day: "Sat", tasks: 6, completed: 6 },
  { day: "Sun", tasks: 4, completed: 3 },
];

export const completionByProject = [
  { name: "VisionOS Demo", percent: 82, color: "from-cyan-400 to-blue-500" },
  { name: "AI Sprint Room", percent: 64, color: "from-violet-400 to-fuchsia-500" },
  { name: "Showcase", percent: 91, color: "from-emerald-300 to-cyan-400" },
  { name: "API Gateway", percent: 45, color: "from-rose-400 to-orange-400" },
];

/* ── Testimonials ─────────────────────────────────────────────── */
export const testimonials = [
  {
    quote: "The 3D interface alone would land you interviews at any top-tier startup. This is production-caliber work.",
    name: "Sarah Chen",
    role: "Engineering Director, Stripe",
  },
  {
    quote: "Clean architecture, beautiful UI, working auth — exactly what separates senior candidates from juniors.",
    name: "Marcus Rivera",
    role: "CTO, Scale AI",
  },
  {
    quote: "When I review hiring assignments, this is the kind of polish and depth that makes me schedule an interview immediately.",
    name: "Emily Zhang",
    role: "VP Engineering, Linear",
  },
];

/* ── Footer ───────────────────────────────────────────────────── */
export const footerLinks = {
  Product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/projects" },
    { label: "Task Board", href: "/board" },
    { label: "Analytics", href: "/analytics" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Demo", href: "/demo" },
  ],
  Stack: [
    { label: "Next.js 16", href: "#" },
    { label: "React Three Fiber", href: "#" },
    { label: "Express + MongoDB", href: "#" },
    { label: "Railway Deploy", href: "#" },
  ],
};

/* ── Tech Stack ───────────────────────────────────────────────── */
export const techStack = [
  { name: "Next.js 16", category: "Frontend" },
  { name: "React 19", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS 4", category: "Styling" },
  { name: "Three.js", category: "3D" },
  { name: "React Three Fiber", category: "3D" },
  { name: "Framer Motion", category: "Animation" },
  { name: "Express 5", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "JWT Auth", category: "Security" },
  { name: "Zod", category: "Validation" },
  { name: "Railway", category: "Deploy" },
];

/* ── Feature List for About/Demo ──────────────────────────────── */
export const featureList = [
  { icon: Globe2, title: "12 Premium Pages", desc: "Landing, Auth, Dashboard, Projects, Board, Analytics, Team, About, Contact, Demo, and custom 404." },
  { icon: Activity, title: "Real-Time Kanban", desc: "Drag-and-drop task board with priorities, assignees, due dates, comments, and progress tracking." },
  { icon: ShieldCheck, title: "JWT Auth System", desc: "Signup, login, forgot password, protected routes, and Admin/Member role-based access control." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Completion charts, overdue metrics, productivity scores, team leaderboards, and weekly trends." },
  { icon: Users, title: "Team Management", desc: "Invite members, holographic avatar orbs, focus scores, permission sync, and activity tracking." },
  { icon: Rocket, title: "Deployment Ready", desc: "Railway configs, .env examples, seed data, README guide, and clean monorepo architecture." },
];

import React from "react";
import {
    FiArrowUpRight,
    FiCode,
    FiFolder,
    FiGitBranch,
    FiClock,
    FiStar,
    FiPlus,
    FiActivity,
    FiTrendingUp,
    FiZap,
    FiCheckCircle,
    FiTarget,
} from "react-icons/fi";

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function Dashboard() {
    const stats = [
        {
            title: "Projects",
            value: "12",
            meta: "2 added recently",
            icon: FiFolder,
        },
        {
            title: "Snippets",
            value: "48",
            meta: "8 added recently",
            icon: FiCode,
        },
        {
            title: "Resources",
            value: "36",
            meta: "5 added recently",
            icon: FiGitBranch,
        },
        {
            title: "Ideas",
            value: "24",
            meta: "6 added recently",
            icon: FiStar,
        },
    ];

    const activityData = [
        { day: "Mon", activity: 8 },
        { day: "Tue", activity: 12 },
        { day: "Wed", activity: 7 },
        { day: "Thu", activity: 15 },
        { day: "Fri", activity: 18 },
        { day: "Sat", activity: 11 },
        { day: "Sun", activity: 14 },
    ];

    const distributionData = [
        { name: "Projects", value: 12 },
        { name: "Snippets", value: 48 },
        { name: "Resources", value: 36 },
        { name: "Ideas", value: 24 },
    ];

    const projects = [
        {
            name: "DevVault",
            description: "Personal developer workspace",
            tech: "React",
            updated: "Today",
        },
        {
            name: "FlowBoard",
            description: "Collaborative visual workspace",
            tech: "React + Vite",
            updated: "Yesterday",
        },
        {
            name: "Hand Physics",
            description: "Hand tracking with physics",
            tech: "MediaPipe",
            updated: "3 days ago",
        },
    ];

    const snippets = [
        {
            title: "useDebounce Hook",
            language: "React",
            time: "2 hours ago",
        },
        {
            title: "JWT Authentication",
            language: "Node.js",
            time: "Yesterday",
        },
        {
            title: "API Error Handler",
            language: "TypeScript",
            time: "3 days ago",
        },
    ];

    return (
        <div className="mx-auto max-w-[1600px] space-y-8">

            {/* Header */}
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-2 text-sm font-medium text-[#14B8A6]">
                        Welcome back, Hassan
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Your workspace
                    </h1>

                    <p className="mt-2 text-sm text-[#71717A]">
                        Everything you need to keep your development organized.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-[#18181B] transition-all hover:bg-[#2DD4BF] active:scale-95"
                    >
                        <FiPlus />
                        New Project
                    </button>

                    <button
                        type="button"
                        className="hidden cursor-pointer items-center gap-2 rounded-lg border border-[#3f3f468c] px-4 py-2.5 text-sm text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-white sm:flex"
                    >
                        <FiCode />
                        Snippet
                    </button>
                </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#3f3f468c] bg-[#18181B] md:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className={`
                                group flex items-center gap-4 p-5
                                transition-colors hover:bg-[#202023]
                                ${index !== 0 ? "border-l border-[#3f3f468c]" : ""}
                            `}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#27272A] text-[#A1A1AA] transition-colors group-hover:text-[#14B8A6]">
                                <Icon />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-[#71717A]">
                                    {stat.title}
                                </p>

                                <div className="mt-1 flex items-baseline gap-2">
                                    <p className="text-xl font-semibold">
                                        {stat.value}
                                    </p>

                                    <span className="truncate text-[10px] text-[#14B8A6]">
                                        {stat.meta}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">

                {/* Activity Chart */}
                <div className="rounded-xl border border-[#3f3f468c] bg-[#18181B] p-5">

                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27272A] text-[#14B8A6]">
                                    <FiActivity />
                                </div>

                                <h2 className="text-sm font-semibold">
                                    Activity Overview
                                </h2>
                            </div>

                            <p className="mt-2 text-xs text-[#71717A]">
                                Your development activity this week
                            </p>
                        </div>

                        <div className="rounded-md bg-[#27272A] px-2.5 py-1.5 text-[11px] text-[#A1A1AA]">
                            This week
                        </div>
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={activityData}
                                margin={{
                                    top: 10,
                                    right: 5,
                                    left: -25,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="activityGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#14B8A6"
                                            stopOpacity={0.35}
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor="#14B8A6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    stroke="#27272A"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#71717A",
                                        fontSize: 11,
                                    }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#52525B",
                                        fontSize: 11,
                                    }}
                                />

                                <Tooltip
                                    cursor={{
                                        stroke: "#3F3F46",
                                    }}
                                    contentStyle={{
                                        backgroundColor: "#18181B",
                                        border: "1px solid #3F3F46",
                                        borderRadius: "10px",
                                        color: "#fff",
                                        fontSize: "12px",
                                    }}
                                    labelStyle={{
                                        color: "#A1A1AA",
                                        marginBottom: "4px",
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="activity"
                                    stroke="#14B8A6"
                                    strokeWidth={2.5}
                                    fill="url(#activityGradient)"
                                    dot={{
                                        r: 3,
                                        fill: "#14B8A6",
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{
                                        r: 5,
                                        stroke: "#18181B",
                                        strokeWidth: 3,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution */}
                <div className="rounded-xl border border-[#3f3f468c] bg-[#18181B] p-5">

                    <div className="mb-6">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27272A] text-[#14B8A6]">
                                <FiTrendingUp />
                            </div>

                            <h2 className="text-sm font-semibold">
                                Workspace Overview
                            </h2>
                        </div>

                        <p className="mt-2 text-xs text-[#71717A]">
                            Your content distribution
                        </p>
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={distributionData}
                                margin={{
                                    top: 10,
                                    right: 5,
                                    left: -25,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    stroke="#27272A"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#71717A",
                                        fontSize: 10,
                                    }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#52525B",
                                        fontSize: 11,
                                    }}
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "#27272A",
                                    }}
                                    contentStyle={{
                                        backgroundColor: "#18181B",
                                        border: "1px solid #3F3F46",
                                        borderRadius: "10px",
                                        color: "#fff",
                                        fontSize: "12px",
                                    }}
                                />

                                <Bar
                                    dataKey="value"
                                    fill="#14B8A6"
                                    radius={[6, 6, 2, 2]}
                                    maxBarSize={45}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* Recent Content */}
            <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.5fr_1fr]">

                {/* Projects */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold">
                                Recent Projects
                            </h2>

                            <p className="mt-1 text-xs text-[#71717A]">
                                Your latest work
                            </p>
                        </div>

                        <button
                            type="button"
                            className="flex cursor-pointer items-center gap-1 text-xs text-[#71717A] transition-colors hover:text-[#14B8A6]"
                        >
                            View all
                            <FiArrowUpRight />
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#3f3f468c]">
                        {projects.map((project, index) => (
                            <button
                                key={project.name}
                                type="button"
                                className={`
                                    group flex w-full cursor-pointer items-center gap-4
                                    px-5 py-4 text-left transition-colors hover:bg-[#202023]
                                    ${index !== 0 ? "border-t border-[#3f3f468c]" : ""}
                                `}
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#27272A] text-[#A1A1AA] transition-colors group-hover:text-[#14B8A6]">
                                    <FiFolder />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="truncate text-sm font-medium">
                                            {project.name}
                                        </h3>

                                        <span className="rounded-md bg-[#27272A] px-2 py-0.5 text-[10px] text-[#71717A]">
                                            {project.tech}
                                        </span>
                                    </div>

                                    <p className="mt-1 truncate text-xs text-[#71717A]">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="hidden items-center gap-1.5 text-xs text-[#52525B] sm:flex">
                                    <FiClock />
                                    {project.updated}
                                </div>

                                <FiArrowUpRight className="text-[#52525B] transition-all group-hover:translate-x-0.5 group-hover:text-[#A1A1AA]" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Snippets */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold">
                                Recent Snippets
                            </h2>

                            <p className="mt-1 text-xs text-[#71717A]">
                                Your saved code
                            </p>
                        </div>

                        <button
                            type="button"
                            className="flex cursor-pointer items-center gap-1 text-xs text-[#71717A] transition-colors hover:text-[#14B8A6]"
                        >
                            View all
                            <FiArrowUpRight />
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#3f3f468c]">
                        {snippets.map((snippet, index) => (
                            <button
                                key={snippet.title}
                                type="button"
                                className={`
                                    group flex w-full cursor-pointer items-center gap-3
                                    px-5 py-4 text-left transition-colors hover:bg-[#202023]
                                    ${index !== 0 ? "border-t border-[#3f3f468c]" : ""}
                                `}
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#27272A] text-[#14B8A6]">
                                    <FiCode />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-sm font-medium">
                                        {snippet.title}
                                    </h3>

                                    <p className="mt-1 text-xs text-[#71717A]">
                                        {snippet.language}
                                    </p>
                                </div>

                                <span className="hidden text-[11px] text-[#52525B] sm:block">
                                    {snippet.time}
                                </span>

                                <FiArrowUpRight className="text-[#52525B] transition-all group-hover:translate-x-0.5 group-hover:text-[#A1A1AA]" />
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workspace Pulse */}
            <section>
                <div className="mb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27272A] text-[#14B8A6]">
                            <FiZap />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold">
                                Workspace Pulse
                            </h2>

                            <p className="mt-1 text-xs text-[#71717A]">
                                A quick snapshot of where things stand
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                    {/* Last Updated */}
                    <div className="group rounded-xl border border-[#3f3f468c] bg-[#18181B] p-5 transition-colors hover:bg-[#202023]">
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27272A] text-[#A1A1AA] transition-colors group-hover:text-[#14B8A6]">
                                <FiClock />
                            </div>

                            <span className="rounded-full bg-[#14B8A6]/10 px-2 py-1 text-[10px] font-medium text-[#14B8A6]">
                                Updated
                            </span>
                        </div>

                        <p className="mt-5 text-xs text-[#71717A]">
                            Recently updated project
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-3">
                            <h3 className="truncate text-sm font-semibold">
                                DevVault
                            </h3>

                            <FiArrowUpRight className="shrink-0 text-[#52525B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>

                        <p className="mt-1 text-xs text-[#52525B]">
                            Today at 12:42 PM
                        </p>
                    </div>

                    {/* Latest Snippet */}
                    <div className="group rounded-xl border border-[#3f3f468c] bg-[#18181B] p-5 transition-colors hover:bg-[#202023]">
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27272A] text-[#14B8A6]">
                                <FiCode />
                            </div>

                            <span className="rounded-full bg-[#27272A] px-2 py-1 text-[10px] font-medium text-[#A1A1AA]">
                                New
                            </span>
                        </div>

                        <p className="mt-5 text-xs text-[#71717A]">
                            Recently added snippet
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-3">
                            <h3 className="truncate text-sm font-semibold">
                                useDebounce Hook
                            </h3>

                            <FiArrowUpRight className="shrink-0 text-[#52525B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>

                        <p className="mt-1 text-xs text-[#52525B]">
                            Added 2 hours ago
                        </p>
                    </div>

                    {/* Current Focus */}
                    <div className="group rounded-xl border border-[#3f3f468c] bg-[#18181B] p-5 transition-colors hover:bg-[#202023]">
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#27272A] text-[#14B8A6]">
                                <FiTarget />
                            </div>

                            <span className="flex items-center gap-1 rounded-full bg-[#14B8A6]/10 px-2 py-1 text-[10px] font-medium text-[#14B8A6]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
                                In progress
                            </span>
                        </div>

                        <p className="mt-5 text-xs text-[#71717A]">
                            Current focus
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-3">
                            <h3 className="truncate text-sm font-semibold">
                                Build DevVault
                            </h3>

                            <FiArrowUpRight className="shrink-0 text-[#52525B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#27272A]">
                            <div className="h-full w-[68%] rounded-full bg-[#14B8A6]" />
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="text-[#52525B]">
                                Project progress
                            </span>

                            <span className="text-[#14B8A6]">
                                68%
                            </span>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}

export default Dashboard;
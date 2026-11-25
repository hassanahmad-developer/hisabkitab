import React, { useRef } from "react";
import { NavLink } from "react-router-dom";

import {
    FiGrid,
    FiFolder,
    FiCode,
    FiLink,
    FiTarget,
    FiSettings,
    FiX
} from "react-icons/fi";

import { BsFillLightbulbFill } from "react-icons/bs";
import { useSidebar } from "../context/SidebarContext";

function Sidebar() {
    const {
        isCollapsed,
        sidebarWidth,
        isResizing,
        isMobile,
        setIsResizing,
        closeSidebar,
        updateSidebarWidth,
    } = useSidebar();

    const sidebarRef = useRef(null);

    const navItems = [
        {
            name: "Dashboard",
            path: "/",
            icon: FiGrid,
        },
        {
            name: "Projects",
            path: "/projects",
            icon: FiFolder,
        },
        {
            name: "Snippets",
            path: "/snippets",
            icon: FiCode,
        },
        {
            name: "Resources",
            path: "/resources",
            icon: FiLink,
        },
        {
            name: "Ideas",
            path: "/ideas",
            icon: BsFillLightbulbFill,
        },
        {
            name: "Goals",
            path: "/goals",
            icon: FiTarget,
        },
    ];

    const startResize = (e) => {
        if (isCollapsed) return;

        e.preventDefault();

        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const layoutContent = document.querySelector(
            "[data-layout-content]"
        );

        setIsResizing(true);

        const handleMouseMove = (event) => {
            const minWidth = 220;
            const maxWidth = 380;

            const newWidth = Math.min(
                Math.max(
                    startWidth + (event.clientX - startX),
                    minWidth
                ),
                maxWidth
            );

            if (sidebarRef.current) {
                sidebarRef.current.style.width =
                    `${newWidth}px`;
            }

            if (layoutContent) {
                layoutContent.style.marginLeft =
                    `${newWidth + 8}px`;
            }
        };

        const handleMouseUp = () => {
            const finalWidth = parseFloat(
                sidebarRef.current?.style.width
            );

            if (finalWidth) {
                updateSidebarWidth(finalWidth);
            }

            setIsResizing(false);

            document.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            document.removeEventListener(
                "mouseup",
                handleMouseUp
            );

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        document.addEventListener(
            "mousemove",
            handleMouseMove
        );

        document.addEventListener(
            "mouseup",
            handleMouseUp
        );
    };

    return (
        <aside
            ref={sidebarRef}
            className={`
        fixed
        left-1
        top-1
        z-50
        h-[calc(100vh-0.5rem)]
        overflow-hidden
        rounded-xl
        border
        border-[#3f3f468c]
        bg-[#18181B]

        ${isMobile
                    ? "w-[280px] shadow-2xl"
                    : ""
                }

       ${isMobile
                    ? "transition-transform duration-300 ease-out"
                    : !isResizing
                        ? "transition-[width] duration-300 ease-in-out"
                        : ""
                }

        ${isMobile && isCollapsed
                    ? "-translate-x-[calc(100%+8px)]"
                    : "translate-x-0"
                }
    `}
            style={{
                width: isMobile
                    ? "280px"
                    : isCollapsed
                        ? "64px"
                        : `${sidebarWidth}px`,
            }}
        >
            {/* Logo */}
            <div className="relative flex h-16 items-center border-b border-[#3f3f468c] px-6">
                <h1
                    className={`whitespace-nowrap text-xl font-bold transition-opacity duration-150 ${isCollapsed
                        ? "pointer-events-none opacity-0"
                        : "opacity-100"
                        }`}
                >
                    Dev
                    <span className="text-[#14B8A6]">
                        Vault
                    </span>
                </h1>

                <span
                    className={`absolute left-0 flex w-16 justify-center text-xl font-bold text-[#14B8A6] transition-opacity duration-150 ${isCollapsed
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                        }`}
                >
                    D
                </span>

                {isMobile && !isCollapsed && (
                    <button
                        type="button"
                        onClick={closeSidebar}
                        aria-label="Close sidebar"
                        className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-lg text-[#A1A1AA] transition-colors hover:bg-[#27272A] hover:text-white"
                    >
                        <FiX className="text-lg" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="p-3">
                <p
                    className={`mb-3 overflow-hidden px-3 text-xs font-medium uppercase tracking-wider text-[#71717A] transition-all duration-150 ${isCollapsed
                        ? "h-0 opacity-0"
                        : "h-4 opacity-100"
                        }`}
                >
                    Workspace
                </p>

                <div className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                title={
                                    isCollapsed
                                        ? item.name
                                        : undefined
                                }
                                className={({ isActive }) =>
                                    `flex h-10 items-center gap-3 rounded-lg px-[11px] text-sm transition-colors ${isActive
                                        ? "bg-[#27272A] text-white"
                                        : "text-[#A1A1AA] hover:bg-[#27272A] hover:text-white"
                                    }`
                                }
                            >
                                <Icon className="shrink-0 text-lg" />

                                <span
                                    className={`whitespace-nowrap transition-opacity duration-150 ${isCollapsed
                                        ? "pointer-events-none opacity-0"
                                        : "opacity-100"
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Settings */}
            <div className="absolute bottom-0 left-0 w-full border-t border-[#3f3f468c] p-3">
                <NavLink
                    to="/settings"
                    title={
                        isCollapsed
                            ? "Settings"
                            : undefined
                    }
                    className={({ isActive }) =>
                        `flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${isActive
                            ? "bg-[#27272A] text-white"
                            : "text-[#A1A1AA] hover:bg-[#27272A] hover:text-white"
                        }`
                    }
                >
                    <FiSettings className="shrink-0 text-lg" />

                    <span
                        className={`whitespace-nowrap transition-opacity duration-150 ${isCollapsed
                            ? "pointer-events-none opacity-0"
                            : "opacity-100"
                            }`}
                    >
                        Settings
                    </span>
                </NavLink>
            </div>

            {/* Resize Handle */}
            {!isCollapsed && !isMobile && (
                <div
                    onMouseDown={startResize}
                    className="group absolute right-0 top-1/2 z-20 flex h-12 w-3 -translate-y-1/2 translate-x-1/2 cursor-col-resize items-center justify-center"
                >
                    <div className="flex flex-col gap-1 rounded-full border border-[#3f3f468c] bg-[#18181B] px-1.5 py-2 transition-colors duration-150 group-hover:border-[#14B8A6]">
                        <span className="h-1 w-1 rounded-full bg-[#71717A] transition-colors group-hover:bg-[#14B8A6]" />
                        <span className="h-1 w-1 rounded-full bg-[#71717A] transition-colors group-hover:bg-[#14B8A6]" />
                        <span className="h-1 w-1 rounded-full bg-[#71717A] transition-colors group-hover:bg-[#14B8A6]" />
                    </div>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
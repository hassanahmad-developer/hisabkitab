import React, { useEffect, useState } from "react";
import {
    FiMenu,
    FiSearch,
    FiBell,
    FiGithub,
    FiUser,
} from "react-icons/fi";

import { useSidebar } from "../context/SidebarContext";
import SearchDialog from "../components/SearchDialog"

function Topbar() {
    const {
        isCollapsed,
        toggleSidebar,
    } = useSidebar();

    const [isSearchOpen, setIsSearchOpen] =
        useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                e.key.toLowerCase() === "k"
            ) {
                e.preventDefault();

                setIsSearchOpen(true);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center justify-between rounded-xl border border-[#3f3f468c] bg-[#18181B] px-4">

                {/* Left Side */}
                <div className="flex min-w-0 items-center gap-3">

                    <button
                        type="button"
                        onClick={toggleSidebar}
                        title={
                            isCollapsed
                                ? "Open Sidebar"
                                : "Close Sidebar"
                        }
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#A1A1AA] transition-all duration-150 hover:bg-[#27272A] hover:text-white active:scale-95"
                    >
                        <FiMenu className="text-xl" />
                    </button>

                    <h2 className="truncate text-lg font-semibold">
                        Dashboard
                    </h2>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2">

                    {/* Search */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsSearchOpen(true)
                        }
                        title="Search"
                        className="hidden h-9 cursor-pointer items-center gap-2 rounded-lg border border-[#3f3f468c] px-3 text-sm text-[#A1A1AA] transition-all duration-150 hover:bg-[#27272A] hover:text-white active:scale-[0.98] sm:flex"
                    >
                        <FiSearch className="text-base" />

                        <span>Search</span>

                        <kbd className="ml-1 rounded border border-[#3f3f468c] bg-[#27272A] px-1.5 py-0.5 text-[10px] text-[#71717A]">
                            Ctrl K
                        </kbd>
                    </button>

                    {/* Mobile Search */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsSearchOpen(true)
                        }
                        title="Search"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#A1A1AA] transition-all duration-150 hover:bg-[#27272A] hover:text-white active:scale-95 sm:hidden"
                    >
                        <FiSearch className="text-lg" />
                    </button>

                    {/* Notifications */}
                    <button
                        type="button"
                        title="Notifications"
                        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#A1A1AA] transition-all duration-150 hover:bg-[#27272A] hover:text-white active:scale-95"
                    >
                        <FiBell className="text-lg" />

                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
                    </button>

                    {/* GitHub */}
                    <button
                        type="button"
                        title="GitHub"
                        className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#A1A1AA] transition-all duration-150 hover:bg-[#27272A] hover:text-white active:scale-95 md:flex"
                    >
                        <FiGithub className="text-lg" />
                    </button>

                    {/* Divider */}
                    <div className="mx-1 hidden h-6 w-px bg-[#3f3f468c] sm:block" />

                    {/* Profile */}
                    <button
                        type="button"
                        title="Profile"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#27272A] text-sm font-medium text-white ring-1 ring-transparent transition-all duration-150 hover:bg-[#3F3F46] hover:ring-[#14B8A6]/40 active:scale-95"
                    >
                        HA
                    </button>
                </div>
            </header>

            {/* Global Search Dialog */}
            <SearchDialog
                isOpen={isSearchOpen}
                onClose={() =>
                    setIsSearchOpen(false)
                }
            />
        </>
    );
}

export default Topbar;
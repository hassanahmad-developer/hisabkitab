import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
    SidebarProvider,
    useSidebar,
} from "../context/SidebarContext";

function LayoutContent() {
    const {
        sidebarWidth,
        isCollapsed,
        isMobile,
        isResizing,
        closeSidebar,
    } = useSidebar();

    const contentMargin = isMobile
        ? 0
        : isCollapsed
            ? 68
            : sidebarWidth + 4;

    return (
        <div className="h-screen overflow-hidden bg-[#18181B] p-1 text-white">

            <Sidebar />

            {/* Mobile Overlay */}
            {isMobile && !isCollapsed && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                    onClick={closeSidebar}
                />
            )}

            <div
                data-layout-content
                className={`
                    flex
                    h-[calc(100vh-0.5rem)]
                    flex-col
                    gap-1
                    ${
                        !isResizing && !isMobile
                            ? "transition-[margin-left] duration-300 ease-in-out"
                            : ""
                    }
                `}
                style={{
                    marginLeft: `${contentMargin}px`,
                }}
            >
                {/* Topbar */}
                <Topbar />

                {/* Scrollable Outlet */}
                <main className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-[#3f3f468c] bg-[#18181B] p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function Layout() {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
}

export default Layout;
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(280);
    const [isResizing, setIsResizing] = useState(false);
    const [isMobile, setIsMobile] = useState(
        window.innerWidth < 768
    );

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;

            setIsMobile(mobile);

            if (mobile) {
                setIsCollapsed(true);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    const closeSidebar = () => {
        setIsCollapsed(true);
    };

    const updateSidebarWidth = (width) => {
        const minWidth = 220;
        const maxWidth = 380;

        const newWidth = Math.min(
            Math.max(width, minWidth),
            maxWidth
        );

        setSidebarWidth(newWidth);
    };

    return (
        <SidebarContext.Provider
            value={{
                isCollapsed,
                sidebarWidth,
                isResizing,
                isMobile,
                setIsResizing,
                toggleSidebar,
                closeSidebar,
                updateSidebarWidth,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
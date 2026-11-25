import React, { useEffect, useRef, useState } from "react";
import {
    FiSearch,
    FiFolder,
    FiCode,
    FiLink,
    FiTarget,
    FiX,
    FiArrowRight,
} from "react-icons/fi";
import { BsFillLightbulbFill } from "react-icons/bs";

function SearchDialog({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);

    const suggestions = [
        {
            name: "Projects",
            description: "Search your projects",
            icon: FiFolder,
        },
        {
            name: "Snippets",
            description: "Search saved code snippets",
            icon: FiCode,
        },
        {
            name: "Resources",
            description: "Search useful resources",
            icon: FiLink,
        },
        {
            name: "Ideas",
            description: "Search your ideas",
            icon: BsFillLightbulbFill,
        },
        {
            name: "Goals",
            description: "Search your development goals",
            icon: FiTarget,
        },
    ];

    const filteredSuggestions = suggestions.filter(
        (item) =>
            item.name
                .toLowerCase()
                .includes(query.toLowerCase()) ||
            item.description
                .toLowerCase()
                .includes(query.toLowerCase())
    );

    useEffect(() => {
        if (!isOpen) return;

        setQuery("");

        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        // Prevent background scrolling
        document.body.style.overflow = "hidden";

        return () => {
            clearTimeout(timer);

            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh]">

            {/* Backdrop */}
            <div
                className="absolute inset-0 animate-[fadeIn_200ms_ease-out] bg-black/50 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                className="
                    relative
                    z-10
                    flex
                    w-full
                    max-w-2xl
                    flex-col
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#3f3f468c]
                    bg-[#18181B]
                    shadow-2xl
                    animate-[dialogIn_220ms_ease-out]
                "
                style={{
                    maxHeight: "80vh",
                }}
            >

                {/* Search Input */}
                <div className="flex h-14 shrink-0 items-center border-b border-[#3f3f468c] px-4">

                    <FiSearch className="mr-3 shrink-0 text-lg text-[#71717A]" />

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) =>
                            setQuery(e.target.value)
                        }
                        placeholder="Search DevVault..."
                        className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#71717A]"
                    />

                    <button
                        type="button"
                        onClick={onClose}
                        title="Close"
                        className="ml-3 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#71717A] transition-colors hover:bg-[#27272A] hover:text-white"
                    >
                        <FiX />
                    </button>
                </div>

                {/* Scrollable Results */}
                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        overscroll-contain
                        p-2
                    "
                    style={{
                        maxHeight: "calc(80vh - 104px)",
                    }}
                >
                    {!query && (
                        <p className="mb-2 px-3 pt-1 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                            Quick Search
                        </p>
                    )}

                    {query && (
                        <p className="mb-2 px-3 pt-1 text-xs font-medium uppercase tracking-wider text-[#71717A]">
                            Suggestions
                        </p>
                    )}

                    {filteredSuggestions.length > 0 ? (
                        <div className="space-y-1">
                            {filteredSuggestions.map(
                                (item) => {
                                    const Icon = item.icon;

                                    return (
                                        <button
                                            key={item.name}
                                            type="button"
                                            className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[#27272A]"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#27272A] text-[#A1A1AA] transition-colors group-hover:bg-[#3F3F46] group-hover:text-[#14B8A6]">
                                                <Icon className="text-lg" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-white">
                                                    {item.name}
                                                </p>

                                                <p className="mt-0.5 truncate text-xs text-[#71717A]">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <FiArrowRight className="text-sm text-[#52525B] transition-all group-hover:translate-x-0.5 group-hover:text-[#A1A1AA]" />
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FiSearch className="mb-3 text-2xl text-[#52525B]" />

                            <p className="text-sm text-[#A1A1AA]">
                                No results found
                            </p>

                            <p className="mt-1 text-xs text-[#52525B]">
                                Try a different search term
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-between border-t border-[#3f3f468c] px-4 py-2.5 text-xs text-[#52525B]">
                    <span>
                        Search across DevVault
                    </span>

                    <div className="flex items-center gap-2">
                        <span className="rounded border border-[#3f3f468c] bg-[#27272A] px-1.5 py-0.5">
                            ESC
                        </span>

                        <span>to close</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchDialog;
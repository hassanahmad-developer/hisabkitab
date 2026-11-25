import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FiSearch,
    FiUsers,
    FiClock,
    FiUserCheck,
    FiUserX,
    FiRefreshCw,
    FiCheck,
    FiSlash,
    FiRotateCcw,
    FiLogOut,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    fetchUsers,
    loginAdmin,
    logoutAdmin,
    setUserStatus,
} from "../services/usersService";

const STATUS_STYLE = {
    pending: { label: "Pending", cls: "bg-[#EEF0FF] text-[#3730A3]" },
    approved: { label: "Approved", cls: "bg-[#E0F4F8] text-[#0E7490]" },
    blocked: { label: "Blocked", cls: "bg-[#FDECEC] text-[#E5484D]" },
};

const formatDate = (ts) =>
    new Date(ts).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

const initials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("") || "U";

function StatCard({ title, value, icon: Icon, iconCls }) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg ${iconCls}`}>
                <Icon />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{title}</p>
                <p className="text-2xl font-semibold leading-tight">{value}</p>
            </div>
        </div>
    );
}

function AdminPanel() {
    const [authenticated, setAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [filter, setFilter] = useState("pending");
    const [search, setSearch] = useState("");
    const [busyId, setBusyId] = useState(null);
    const [confirmUser, setConfirmUser] = useState(null);

    const expireSession = useCallback((showMessage = true) => {
        setAuthenticated(false);
        setUsers([]);
        setLoginError(showMessage ? "Session expire ho gaya. Dobara login karein." : "");
    }, []);

    const load = useCallback(async () => {
        try {
            setUsers(await fetchUsers());
            setError("");
            setLoginError("");
            setAuthenticated(true);
            return true;
        } catch (e) {
            if (e.status === 401) {
                expireSession();
            } else {
                setError(e.message || "Users load nahi ho sake.");
            }
            return false;
        } finally {
            setLoading(false);
        }
    }, [expireSession]);

    useEffect(() => {
        let isCurrent = true;
        fetchUsers()
            .then((loadedUsers) => {
                if (!isCurrent) return;
                setUsers(loadedUsers);
                setError("");
                setLoginError("");
                setAuthenticated(true);
            })
            .catch((e) => {
                if (!isCurrent) return;
                if (e.status === 401) {
                    expireSession(false);
                } else {
                    setError(e.message || "Users load nahi ho sake.");
                }
            })
            .finally(() => {
                if (isCurrent) setLoading(false);
            });
        return () => {
            isCurrent = false;
        };
    }, [expireSession]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginError("");
        setLoginLoading(true);
        try {
            await loginAdmin(email.trim(), password);
            setLoading(true);
            setPassword("");
            await load();
        } catch (e) {
            setLoginError(e.message || "Login nahi ho saka.");
        } finally {
            setLoginLoading(false);
        }
    };

    const logout = async () => {
        setLoginLoading(true);
        try {
            await logoutAdmin();
            setLoginError("");
        } catch (e) {
            setLoginError(e.message || "Logout nahi ho saka.");
        } finally {
            setAuthenticated(false);
            setUsers([]);
            setError("");
            setLoading(false);
            setLoginLoading(false);
        }
    };

    const changeStatus = async (user, status) => {
        setBusyId(user.id);
        try {
            await setUserStatus(user.id, status);
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, status } : u))
            );
        } catch (e) {
            if (e.status === 401) {
                expireSession();
            } else {
                setError(e.message || "Status update nahi ho saka.");
            }
        } finally {
            setBusyId(null);
        }
    };

    const counts = useMemo(() => {
        const c = { all: users.length, pending: 0, approved: 0, blocked: 0 };
        users.forEach((u) => (c[u.status] = (c[u.status] || 0) + 1));
        return c;
    }, [users]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter((u) => {
            if (filter !== "all" && u.status !== filter) return false;
            if (!q) return true;
            return [u.name, u.email, u.phone].some((v) =>
                String(v || "").toLowerCase().includes(q)
            );
        });
    }, [users, filter, search]);

    if (!authenticated && loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <p className="text-sm text-muted-foreground">Checking admin session...</p>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
                <section className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                            HK
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">
                                Hisab<span className="text-primary">Kitab</span> Admin
                            </h1>
                            <p className="text-sm text-muted-foreground">Sign in to manage users</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="admin-email" className="text-sm font-medium">Email</label>
                            <Input
                                id="admin-email"
                                type="email"
                                autoComplete="username"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="admin-password" className="text-sm font-medium">Password</label>
                            <Input
                                id="admin-password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                className="h-10"
                            />
                        </div>
                        {(loginError || error) && (
                            <p role="alert" className="rounded-lg bg-[#FDECEC] px-3 py-2 text-sm text-[#E5484D]">
                                {loginError || error}
                            </p>
                        )}
                        <Button type="submit" className="h-10 w-full" disabled={loginLoading}>
                            {loginLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                            HK
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-base font-semibold">
                                Hisab<span className="text-primary">Kitab</span> Admin
                            </h1>
                            <p className="text-xs text-muted-foreground">User approvals</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setLoading(true);
                                load();
                            }}
                            disabled={loading}
                        >
                            <FiRefreshCw className={loading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={logout}>
                            <FiLogOut /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
                {/* Stats */}
                <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <StatCard title="Pending" value={counts.pending} icon={FiClock} iconCls="bg-[#EEF0FF] text-[#4F46E5]" />
                    <StatCard title="Approved" value={counts.approved} icon={FiUserCheck} iconCls="bg-[#E0F4F8] text-[#0E7490]" />
                    <StatCard title="Blocked" value={counts.blocked} icon={FiUserX} iconCls="bg-[#FDECEC] text-[#E5484D]" />
                    <StatCard title="Total users" value={counts.all} icon={FiUsers} iconCls="bg-[#F6F7FB] text-[#6B7280]" />
                </section>

                {/* List */}
                <section className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
                        <Tabs value={filter} onValueChange={setFilter}>
                            <TabsList className="h-auto flex-wrap">
                                <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                                <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
                                <TabsTrigger value="blocked">Blocked ({counts.blocked})</TabsTrigger>
                                <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="relative w-full md:w-64">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Naam, email ya phone..."
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="border-b border-border bg-[#FDECEC] px-4 py-2 text-sm text-[#E5484D]">
                            {error}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-4">User</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="pr-4 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!loading && visible.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                                            Koi user nahi mila.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!loading &&
                                    visible.map((user) => {
                                        const st = STATUS_STYLE[user.status] || STATUS_STYLE.pending;
                                        const busy = busyId === user.id;

                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell className="pl-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9">
                                                            <AvatarFallback className="bg-[#EEF0FF] text-xs font-semibold text-[#3730A3]">
                                                                {initials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium">{user.name || "Unnamed"}</p>
                                                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                                    {user.phone || "—"}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                                    {formatDate(user.createdAt)}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge variant="secondary" className={`${st.cls} font-medium`}>
                                                        {st.label}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="pr-4">
                                                    <div className="flex justify-end gap-2">
                                                        {user.status === "pending" && (
                                                            <Button size="sm" disabled={busy} onClick={() => changeStatus(user, "approved")}>
                                                                <FiCheck /> Approve
                                                            </Button>
                                                        )}

                                                        {user.status !== "blocked" && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={busy}
                                                                onClick={() => setConfirmUser(user)}
                                                                className="border-[#E5484D]/40 text-[#E5484D] hover:bg-[#FDECEC] hover:text-[#E5484D]"
                                                            >
                                                                <FiSlash /> Block
                                                            </Button>
                                                        )}

                                                        {user.status === "blocked" && (
                                                            <Button size="sm" variant="outline" disabled={busy} onClick={() => changeStatus(user, "approved")}>
                                                                <FiRotateCcw /> Unblock
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </main>

            {/* Block confirm */}
            <AlertDialog open={!!confirmUser} onOpenChange={(open) => !open && setConfirmUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Is user ko block karein?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmUser?.name || confirmUser?.email} app use nahi kar sakega. Baad mein aap Unblock kar sakte hain.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-[#E5484D] text-white hover:bg-[#c93a3f]"
                            onClick={() => {
                                changeStatus(confirmUser, "blocked");
                                setConfirmUser(null);
                            }}
                        >
                            Block
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default AdminPanel;
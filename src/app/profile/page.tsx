"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertCircle, CheckCircle2, DollarSign, Edit2, Save, X, Lock, Mail, User } from "lucide-react";
import Link from "next/link";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;
const AUTH_API = `${API_BASE}/api/auth`;

// Helper to decode JWT
function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

interface UserInfo {
    user_id: number;
    start_date: string;
    payment_frequency: string;
    has_acre: boolean; // or number 1/0
}

interface Deadlines {
    urssaf?: Date[];
    cfe?: { exempt: boolean; date?: Date; message?: string };
}

// Logic provided by user
function getNextDeadlines(profile: UserInfo, today = new Date()) {
    const deadlines: Deadlines = {};
    const paymentFreq = profile.payment_frequency ? profile.payment_frequency.toLowerCase() : 'monthly';
    const currentYear = today.getFullYear();
    const years = [currentYear, currentYear + 1]; // Generate for this year and next year
    const urssafDates: Date[] = [];

    // URSSAF
    if (paymentFreq === 'monthly') {
        // Mensuel : fin du mois suivant
        // Pour chaque mois de l'année, on génère la deadline. 
        // L'échéance de Janvier est le 28/29 Fevrier.
        // L'échéance de Fevrier est le 31 Mars.
        // etc.
        years.forEach(year => {
            for (let month = 0; month < 12; month++) {
                // Deadline is end of next month
                // Period: month `month` of `year`.
                // Deadline: Last day of month `month + 1`.
                const d = new Date(year, month + 2, 0);
                urssafDates.push(d);
            }
        });
    } else if (paymentFreq === 'quarterly') {
        // Trimestriel
        // Q1 (Jan-Mar) -> 30 Avril
        // Q2 (Apr-Jun) -> 31 Juillet
        // Q3 (Jul-Sep) -> 31 Octobre
        // Q4 (Oct-Dec) -> 31 Janvier (Année N+1)

        years.forEach(year => {
            urssafDates.push(new Date(year, 3, 30)); // 30 Apr
            urssafDates.push(new Date(year, 6, 31)); // 31 July
            urssafDates.push(new Date(year, 9, 31)); // 31 Oct
            urssafDates.push(new Date(year + 1, 0, 31)); // 31 Jan next year
        });
    } else if (paymentFreq === 'annually') {
        // Annuel (Exemple hypothétique ou user-defined. User mentionne 31/01/2026 pour début 2025).
        // On suppose une deadline annuelle récurrente. Disons le 31 Janvier de l'année suivante.
        years.forEach(year => {
            urssafDates.push(new Date(year + 1, 0, 31)); // 31 Jan N+1
        });

        // Ou peut-être 31 Décembre ? 
        // Si l'utilisateur a vu 31/01/2026, c'est que mon ancien code (qui utilisait la logique trimestrielle par défaut) avait calculé Q4 -> 31 Jan.
        // Donc "Annuel" semble suivre la logique Trimestrielle Q4 ?? 
        // Pour l'instant je mets 31 Janvier N+1 comme deadline annuelle.
    }

    deadlines.urssaf = urssafDates;

    // CFE
    if (profile.start_date) {
        const startYear = new Date(profile.start_date).getFullYear();
        if (startYear === currentYear) {
            deadlines.cfe = { exempt: true, message: "Exonéré pour ta 1ère année ! 🎉" };
        } else {
            deadlines.cfe = { exempt: false, date: new Date(currentYear, 11, 15) }; // 15 Dec
        }
    }

    return deadlines;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [deadlines, setDeadlines] = useState<Deadlines>({});
    const [loading, setLoading] = useState(true);

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const decoded = parseJwt(token);
        if (!decoded || (!decoded.id && !decoded.sub)) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
        }
        setUser(decoded);

        const id = Number(decoded.id || decoded.sub);

        // Fetch user additional info
        fetch(`${API_BASE}/api/user-info/${id}`)
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setUserInfo(data);
                    // Calculate deadlines
                    const d = getNextDeadlines(data);
                    setDeadlines(d);
                } else if (res.status === 404) {
                    // Data not defined yet, handle gracefully
                    setUserInfo(null);
                    setDeadlines({});
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, [router]);

    // Calendar logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        // 0 = Sunday, 1 = Monday. We want Monday = 0, Sunday = 6 for our grid usually.
        // Let's stick to standard 0=Sun for now to keep it simple, or adjust.
        // Let's use Monday start.
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const isSameDate = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const getDeadlineForDay = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const events = [];

        if (deadlines.urssaf && Array.isArray(deadlines.urssaf)) {
            const hasUrssaf = deadlines.urssaf.some(d => isSameDate(d, date));
            if (hasUrssaf) {
                events.push({ type: 'URSSAF', label: 'Déclaration URSSAF', color: 'bg-red-100 text-red-700 border-red-200' });
            }
        }

        if (deadlines.cfe && !deadlines.cfe.exempt && deadlines.cfe.date && isSameDate(deadlines.cfe.date, date)) {
            events.push({ type: 'CFE', label: 'Paiement CFE', color: 'bg-orange-100 text-orange-700 border-orange-200' });
        }
        return events;
    };

    // Find next upcoming deadline
    const getNextUpcomingDeadline = () => {
        if (!deadlines.urssaf) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Sort dates and find first one >= today
        const sorted = [...deadlines.urssaf].sort((a, b) => a.getTime() - b.getTime());
        return sorted.find(d => d >= today);
    };

    const nextUrssaf = getNextUpcomingDeadline();

    // Modal state
    const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: Date; events: any[] } | null>(null);

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleDayClick = (day: number, events: any[]) => {
        if (events.length > 0) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            setSelectedDateEvents({ date, events });
        }
    };

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setEditForm(prev => ({ ...prev, username: user.username || "", email: user.email || "" }));
        }
    }, [user]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editForm.password && editForm.password !== editForm.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            return;
        }

        setIsSaving(true);
        try {
            const id = Number(user.id || user.sub);
            const res = await fetch(`${AUTH_API}/user/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: editForm.username,
                    email: editForm.email,
                    password: editForm.password || undefined
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Erreur lors de la mise à jour.");
                setIsSaving(false);
                return;
            }

            toast.success("Profil mis à jour avec succès !");
            setIsEditing(false);

            // Update local user state if username/email changed
            // Ideally we should update the token or re-fetch profile, but for now let's just update UI
            setUser((prev: any) => ({ ...prev, username: data.username || prev.username, email: data.email || prev.email }));

        } catch (error) {
            console.error(error);
            toast.error("Erreur réseau.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-200">Chargement...</div>;
    }

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100">
            <Navbar />

            <div className="flex-grow container mx-auto px-4 py-8 md:py-12 mt-16">

                <div className="flex flex-col md:flex-row gap-8 items-start">

                    {/* Sidebar / Info Card */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="w-12 h-12 rounded-full bg-[#FFCC00]/20 flex items-center justify-center text-[#FFCC00] font-bold text-xl shrink-0">
                                    {user?.username ? user.username[0].toUpperCase() : 'U'}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    {!isEditing ? (
                                        <>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">{user?.username}</h2>
                                            <p className="text-slate-500 dark:text-slate-300 text-sm truncate">{user?.email}</p>
                                        </>
                                    ) : (
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">Modification du profil</div>
                                    )}
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        title="Modifier le profil"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {isEditing && (
                                <form onSubmit={handleEditSubmit} className="space-y-3 mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1 block">Nom d'utilisateur</label>
                                        <div className="relative">
                                            <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                            <input
                                                type="text"
                                                name="username"
                                                value={editForm.username}
                                                onChange={handleEditChange}
                                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/10 outline-none"
                                                placeholder="Username"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1 block">Email</label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleEditChange}
                                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/10 outline-none"
                                                placeholder="Email"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1 block">Nouveau mot de passe (optionnel)</label>
                                        <div className="relative mb-2">
                                            <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                            <input
                                                type="password"
                                                name="password"
                                                value={editForm.password}
                                                onChange={handleEditChange}
                                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/10 outline-none"
                                                placeholder="Nouveau mot de passe"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={editForm.confirmPassword}
                                                onChange={handleEditChange}
                                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/10 outline-none"
                                                placeholder="Confirmer le mot de passe"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-1"
                                        >
                                            {isSaving ? '...' : <><Save className="w-3 h-3" /> Enregistrer</>}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-300 mb-1">Fréquence de paiement</h3>
                                    <p className="text-slate-900 dark:text-white font-medium capitalize">
                                        {userInfo?.payment_frequency ?
                                            (userInfo.payment_frequency === 'monthly' ? 'Mensuel' :
                                                userInfo.payment_frequency === 'quarterly' ? 'Trimestriel' :
                                                    userInfo.payment_frequency === 'annually' ? 'Annuel' : userInfo.payment_frequency)
                                            : 'Non défini'}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-300 mb-1">Date de début</h3>
                                    <p className="text-slate-900 dark:text-white font-medium">
                                        {userInfo?.start_date ? new Date(userInfo.start_date).toLocaleDateString() : 'Non définie'}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-300 mb-1">Prochaine Échéance URSSAF</h3>
                                    <p className="text-slate-900 dark:text-white font-medium flex items-center gap-2">
                                        {nextUrssaf ? nextUrssaf.toLocaleDateString() : 'Aucune'}
                                        {nextUrssaf && <AlertCircle className="w-4 h-4 text-orange-500" />}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <Link href="/calculateur" className="block w-full py-3 text-center bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                                    Mettre à jour mes infos
                                </Link>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        router.push("/login");
                                    }}
                                    className="mt-3 block w-full py-3 text-center text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Section */}
                    <div className="w-full md:w-2/3">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 overflow-hidden relative">

                            {/* Header */}
                            <div className="p-4 md:p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <CalendarIcon className="w-6 h-6 text-[#FFCC00]" />
                                    Calendrier Fiscal
                                </h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={goToToday}
                                        className="hidden md:block px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Aujourd'hui
                                    </button>
                                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-200" /></button>
                                        <span className="font-bold text-slate-800 dark:text-white w-32 text-center select-none">
                                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                        </span>
                                        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-200" /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="p-4 md:p-6">
                                <div className="grid grid-cols-7 mb-4">
                                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                                        <div key={day} className="text-center text-slate-400 dark:text-slate-300 text-sm font-semibold uppercase tracking-wider">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1 md:gap-2">
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-16 md:h-24 bg-slate-50/50 dark:bg-slate-900 rounded-xl border border-transparent" />
                                    ))}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const events = getDeadlineForDay(day);
                                        const today = isToday(day);
                                        const hasEvents = events.length > 0;

                                        return (
                                            <div
                                                key={day}
                                                onClick={() => handleDayClick(day, events)}
                                                className={`h-16 md:h-24 p-1.5 md:p-2 rounded-xl border transition-all relative group flex flex-col justify-between
                                                    ${today ? 'border-[#FFCC00] bg-[#FFCC00]/5 dark:bg-[#FFCC00]/10 ring-2 ring-[#FFCC00]/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'}
                                                    ${hasEvents ? 'cursor-pointer hover:scale-[1.02]' : ''}
                                                `}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <span className={`text-sm font-bold ${today ? 'text-[#e5b800]' : 'text-slate-700 dark:text-white'}`}>
                                                        {day}
                                                    </span>
                                                    {today && <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />}
                                                </div>

                                                <div className="flex flex-col gap-1 mt-auto">
                                                    {events.map((evt, idx) => (
                                                        <div key={idx} className={`text-[10px] md:text-xs px-2 py-1 rounded-lg font-bold border ${evt.color} truncate shadow-sm`}>
                                                            {evt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Legend / Info */}
                            <div className="px-8 pb-8 flex gap-6 text-sm text-slate-500 dark:text-slate-400">
                                {deadlines.cfe?.exempt && (
                                    <div className="flex items-center gap-2 text-primary dark:text-primary bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/20 dark:border-primary/30">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>{deadlines.cfe.message}</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Event Details Modal */}
            {selectedDateEvents && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedDateEvents(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                {selectedDateEvents.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h3>
                            <button onClick={() => setSelectedDateEvents(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <ChevronLeft className="w-5 h-5 rotate-180" /> {/* Close icon workaround or just X */}
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {selectedDateEvents.events.map((evt, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border ${evt.color.replace('bg-', 'bg-opacity-20 bg-')} dark:border-slate-700`}>
                                    <h4 className="font-bold text-base mb-1">{evt.label}</h4>
                                    <p className="text-sm opacity-90">
                                        N'oubliez pas de déclarer et payer avant minuit.
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
                            <button
                                onClick={() => setSelectedDateEvents(null)}
                                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}

import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, Link, usePage } from '@inertiajs/react';
import StatCards from './Dashboard/StatCards';
import RecentActivity from './Dashboard/RecentActivity';
import AttendanceChart from './Dashboard/AttendanceChart';
import { Button } from '@/Components/ui/button';
import { Camera, Building2, Users, UserCheck, ChevronRight } from 'lucide-react';
import { PageProps } from '@/types';

interface Stat {
    label: string;
    value: string | number;
    icon: string;
}

interface TenantStat {
    id: number;
    name: string;
    slug: string;
    owner_count: number;
    karyawan_count: number;
}

interface DashboardProps {
    role: 'superadmin' | 'owner' | 'karyawan';
    stats: Stat[];
    recentData: Array<Record<string, unknown>>;
    auditLogs?: Array<Record<string, unknown>>;
    chartData?: { day: string; count: number }[];
    tenantStats?: TenantStat[];
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}

export default function Dashboard({
    role,
    stats,
    recentData,
    auditLogs,
    chartData,
    tenantStats = [],
}: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const userName = auth?.user?.name ?? role;

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Dashboard" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8">

                        {/* Header */}
                        <div className="px-4 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div>
                                <p className="text-sm font-medium text-indigo-600 mb-0.5">
                                    {getGreeting()}, 👋
                                </p>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    {userName}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {role === 'superadmin'
                                        ? 'Kelola seluruh tenant dan pantau aktivitas sistem.'
                                        : role === 'karyawan'
                                          ? 'Pantau kehadiran dan riwayat absensi Anda di sini.'
                                          : 'Ringkasan aktivitas dan kehadiran karyawan hari ini.'}
                                </p>
                            </div>

                            {role === 'karyawan' && (
                                <Link href={route('attendance.index')} className="w-full md:w-auto">
                                    <Button
                                        size="lg"
                                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 gap-2 rounded-full px-8 h-12"
                                    >
                                        <Camera className="w-5 h-5" />
                                        Scan Wajah Sekarang
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Stats */}
                        <StatCards stats={stats} />

                        {/* Superadmin: Tenant Table */}
                        {role === 'superadmin' && tenantStats.length > 0 && (
                            <div className="px-4 lg:px-6">
                                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-indigo-500" />
                                            <h2 className="font-semibold text-gray-800 text-sm">Daftar Tenant</h2>
                                        </div>
                                        <Link
                                            href={route('settings.branches')}
                                            className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                                        >
                                            Lihat semua <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                                    <th className="px-6 py-3 text-left font-medium">Tenant</th>
                                                    <th className="px-6 py-3 text-left font-medium">Slug</th>
                                                    <th className="px-6 py-3 text-center font-medium">
                                                        <span className="flex items-center justify-center gap-1">
                                                            <UserCheck className="w-3 h-3" /> Admin
                                                        </span>
                                                    </th>
                                                    <th className="px-6 py-3 text-center font-medium">
                                                        <span className="flex items-center justify-center gap-1">
                                                            <Users className="w-3 h-3" /> Karyawan
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {tenantStats.map((t) => (
                                                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-3 font-medium text-gray-900">{t.name}</td>
                                                        <td className="px-6 py-3 text-gray-500">
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                                                                {t.slug}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 text-center text-gray-700">{t.owner_count}</td>
                                                        <td className="px-6 py-3 text-center text-gray-700">{t.karyawan_count}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Owner: Chart */}
                        {role === 'owner' && chartData && (
                            <AttendanceChart data={chartData} />
                        )}

                        {/* Superadmin: juga tampilkan chart */}
                        {role === 'superadmin' && chartData && (
                            <AttendanceChart data={chartData} />
                        )}

                        {/* Recent Activity */}
                        <RecentActivity
                            role={role}
                            data={recentData}
                            auditLogs={auditLogs}
                        />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

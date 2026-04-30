import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head } from '@inertiajs/react';
import StatCards from './Dashboard/StatCards';
import RecentActivity from './Dashboard/RecentActivity';
import AttendanceChart from './Dashboard/AttendanceChart';
import { Button } from '@/Components/ui/button';
import { Camera } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

interface Stat {
    label: string;
    value: string | number;
    icon: string;
}

interface DashboardProps {
    role: 'superadmin' | 'owner' | 'karyawan';
    stats: Stat[];
    recentData: Array<Record<string, unknown>>;
    chartData?: { day: string; count: number }[];
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
    chartData,
}: DashboardProps) {
    const { auth } = usePage<{
        auth: { user: { name: string } };
    }>().props;

    const userName = auth?.user?.name ?? role;

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Dashboard" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8">
                        {/* Header & Quick Action */}
                        <div className="px-4 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div>
                                <p className="text-sm font-medium text-indigo-600 mb-0.5">
                                    {getGreeting()}, 👋
                                </p>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    {userName}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {role === 'karyawan'
                                        ? 'Pantau kehadiran dan riwayat absensi Anda di sini.'
                                        : role === 'owner'
                                          ? 'Ringkasan aktivitas dan kehadiran karyawan hari ini.'
                                          : 'Overview seluruh tenant dan sistem absensi.'}
                                </p>
                            </div>

                            {role === 'karyawan' && (
                                <Link
                                    href={route('attendance.index')}
                                    className="w-full md:w-auto"
                                >
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

                        {/* Stats Section */}
                        <StatCards stats={stats} />

                        {/* Middle Section (Charts for Owners) */}
                        {role === 'owner' && chartData && (
                            <AttendanceChart data={chartData} />
                        )}

                        {/* Recent Activity */}
                        <RecentActivity role={role} data={recentData} />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

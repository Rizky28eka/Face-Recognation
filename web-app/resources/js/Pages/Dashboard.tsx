import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head } from '@inertiajs/react';
import StatCards from './Dashboard/StatCards';
import RecentActivity from './Dashboard/RecentActivity';
import AttendanceChart from './Dashboard/AttendanceChart';
import { Button } from '@/Components/ui/button';
import { Camera } from 'lucide-react';
import { Link } from '@inertiajs/react';

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

export default function Dashboard({
    role,
    stats,
    recentData,
    chartData,
}: DashboardProps) {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Dashboard" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-8">
                        {/* Header & Quick Action */}
                        <div className="px-4 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 capitalize">
                                    Halo, {role}
                                </h1>
                                <p className="text-gray-500">
                                    Selamat datang kembali di dashboard sistem
                                    absensi wajah.
                                </p>
                            </div>

                            {role === 'karyawan' && (
                                <Link href={route('attendance.index')}>
                                    <Button
                                        size="lg"
                                        className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 gap-2 rounded-full px-8 h-12"
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

                        {/* Recent Activity Table */}
                        <RecentActivity role={role} data={recentData} />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

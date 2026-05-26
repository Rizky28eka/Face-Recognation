'use client';

import * as React from 'react';
import {
    ArrowUpCircleIcon,
    Building2Icon,
    CameraIcon,
    ClipboardListIcon,
    FileTextIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    SettingsIcon,
    UsersIcon,
    CoffeeIcon,
    ShieldAlertIcon,
} from 'lucide-react';

import { NavMain } from '@/Components/nav-main';
import { NavSecondary } from '@/Components/nav-secondary';
import { NavUser } from '@/Components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/Components/ui/sidebar';

import { usePage } from '@inertiajs/react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<{
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                role: 'superadmin' | 'owner' | 'karyawan';
                avatar?: string;
            };
        };
    }>().props;
    const user = auth.user;
    const role = user.role;

    const navMain: {
        title: string;
        url: string;
        icon: any;
        items?: { title: string; url: string }[];
    }[] = [
        {
            title: 'Dashboard',
            url: route('dashboard'),
            icon: LayoutDashboardIcon,
        },
    ];

    if (role === 'superadmin') {
        navMain.push(
            {
                title: 'Daftar Perusahaan',
                url: route('admin.companies'),
                icon: Building2Icon,
            },
            {
                title: 'Laporan Global',
                url: route('attendance.report'),
                icon: ClipboardListIcon,
            },
            {
                title: 'Absensi Gagal',
                url: route('attendance.failed'),
                icon: ShieldAlertIcon,
            },
        );
    } else if (role === 'owner') {
        navMain.push(
            {
                title: 'Data Karyawan',
                url: route('karyawan.index'),
                icon: UsersIcon,
            },
            {
                title: 'Laporan Absensi',
                url: route('attendance.report'),
                icon: ClipboardListIcon,
            },
            {
                title: 'Absensi Gagal',
                url: route('attendance.failed'),
                icon: ShieldAlertIcon,
            },
            {
                title: 'Pengaturan Kantor',
                url: route('settings.branches'),
                icon: SettingsIcon,
                items: [
                    { title: 'Lokasi Cabang', url: route('settings.branches') },
                    { title: 'Manajemen Shift', url: route('settings.shifts') },
                ],
            },
            {
                title: 'Manajemen Cuti',
                url: route('leaves.index'),
                icon: CoffeeIcon,
            },
        );
    } else {
        navMain.push(
            {
                title: 'Presensi Wajah',
                url: route('attendance.index'),
                icon: CameraIcon,
            },
            {
                title: 'Riwayat Saya',
                url: route('attendance.report'),
                icon: ListIcon,
            },
            {
                title: 'Pengajuan Cuti',
                url: route('leaves.index'),
                icon: CoffeeIcon,
            },
        );
    }

    const userData = {
        name: user.name,
        email: user.email,
        avatar:
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`,
    };

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <ArrowUpCircleIcon className="h-5 w-5 text-indigo-600" />
                                <span className="text-base font-semibold">
                                    Sikawan
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
                <NavSecondary
                    items={[
                        {
                            title: 'Pusat Bantuan',
                            url: '#',
                            icon: HelpCircleIcon,
                        },
                        { title: 'Dokumentasi', url: '#', icon: FileTextIcon },
                    ]}
                    className="mt-auto"
                />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
        </Sidebar>
    );
}

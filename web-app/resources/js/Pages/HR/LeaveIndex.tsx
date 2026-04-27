import { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Calendar, FileText, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/Components/ui/badge';

interface Leave {
    id: number;
    user?: { name: string };
    type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface Props {
    leaves: {
        data: Leave[];
        links: any[];
    };
}

export default function LeaveIndex({ leaves }: Props) {
    const { auth } = usePage<any>().props;
    const user = auth.user;
    const isOwner = user.role === 'owner';
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        type: 'Cuti',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const submitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('leaves.store'), {
            onSuccess: () => {
                setShowForm(false);
                reset();
                toast.success('Pengajuan cuti berhasil dikirim');
            },
        });
    };

    const handleAction = (id: number, status: 'approved' | 'rejected') => {
        router.patch(
            route('leaves.update', id),
            {
                status: status,
            },
            {
                onSuccess: () => toast.success('Status pengajuan diperbarui'),
            },
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge
                        variant="success"
                        className="bg-green-100 text-green-700 hover:bg-green-200 border-none"
                    >
                        Disetujui
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700 hover:bg-red-200 border-none"
                    >
                        Ditolak
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none"
                    >
                        Menunggu
                    </Badge>
                );
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Manajemen Cuti & Izin" />

                <div className="flex flex-1 flex-col p-4 lg:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {isOwner
                                    ? 'Persetujuan Cuti'
                                    : 'Pengajuan Cuti'}
                            </h1>
                            <p className="text-gray-500">
                                {isOwner
                                    ? 'Kelola dan setujui permohonan cuti karyawan Anda.'
                                    : 'Ajukan permohonan cuti, sakit, atau izin dengan mudah.'}
                            </p>
                        </div>
                        {!isOwner && !showForm && (
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Ajukan Cuti
                            </Button>
                        )}
                    </div>

                    {!isOwner && showForm && (
                        <Card className="border-none shadow-xl bg-white animate-in fade-in slide-in-from-top-4 duration-300">
                            <CardHeader>
                                <CardTitle>Form Pengajuan Cuti</CardTitle>
                                <CardDescription>
                                    Isi detail pengajuan Anda di bawah ini.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={submitRequest}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label>Tipe Pengajuan</Label>
                                            <Select
                                                value={data.type}
                                                onValueChange={(val) =>
                                                    setData('type', val)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih tipe" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Cuti">
                                                        Cuti Tahunan
                                                    </SelectItem>
                                                    <SelectItem value="Sakit">
                                                        Sakit
                                                    </SelectItem>
                                                    <SelectItem value="Izin">
                                                        Izin Keperluan
                                                    </SelectItem>
                                                    <SelectItem value="Lainnya">
                                                        Lainnya
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tanggal Mulai</Label>
                                            <Input
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'start_date',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tanggal Selesai</Label>
                                            <Input
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'end_date',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Alasan</Label>
                                        <Textarea
                                            placeholder="Berikan alasan singkat..."
                                            value={data.reason}
                                            onChange={(e) =>
                                                setData(
                                                    'reason',
                                                    e.target.value,
                                                )
                                            }
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-indigo-600 hover:bg-indigo-700 px-8"
                                        >
                                            Kirim Pengajuan
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <div className="space-y-4">
                        {leaves.data.length === 0 ? (
                            <Card className="border-dashed border-2 bg-gray-50/50 flex flex-col items-center justify-center p-12 text-center">
                                <Calendar className="w-12 h-12 text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Belum Ada Riwayat
                                </h3>
                                <p className="text-gray-500">
                                    Semua pengajuan cuti akan tampil di sini.
                                </p>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {leaves.data.map((leave) => (
                                    <Card
                                        key={leave.id}
                                        className="border-none shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-gray-900">
                                                            {isOwner
                                                                ? leave.user
                                                                      ?.name
                                                                : leave.type}
                                                        </span>
                                                        {getStatusBadge(
                                                            leave.status,
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {leave.start_date}{' '}
                                                            s/d {leave.end_date}
                                                        </div>
                                                        {isOwner && (
                                                            <div className="flex items-center gap-1 font-medium text-indigo-600">
                                                                <FileText className="w-3.5 h-3.5" />
                                                                {leave.type}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-2 italic bg-gray-50 p-2 rounded-lg border-l-2 border-indigo-200">
                                                        "{leave.reason}"
                                                    </p>
                                                </div>

                                                {isOwner &&
                                                    leave.status ===
                                                        'pending' && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                className="bg-emerald-600 hover:bg-emerald-700"
                                                                onClick={() =>
                                                                    handleAction(
                                                                        leave.id,
                                                                        'approved',
                                                                    )
                                                                }
                                                            >
                                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                                Setujui
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    handleAction(
                                                                        leave.id,
                                                                        'rejected',
                                                                    )
                                                                }
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Tolak
                                                            </Button>
                                                        </div>
                                                    )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

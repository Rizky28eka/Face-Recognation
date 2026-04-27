import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Plus,
    Clock,
    Palette,
    Trash2,
    Edit2,
    Save,
    X,
    Building2,
    Home,
    Shuffle,
} from 'lucide-react';
import { toast } from 'sonner';

type WorkType = 'wfo' | 'wfh' | 'hybrid';

interface Shift {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    color: string;
    work_type: WorkType;
}

interface Props {
    shifts: Shift[];
}

const WORK_TYPE_OPTIONS: {
    value: WorkType;
    label: string;
    icon: React.ReactNode;
    badgeClass: string;
}[] = [
    {
        value: 'wfo',
        label: 'WFO (Kantor)',
        icon: <Building2 className="w-4 h-4" />,
        badgeClass: 'bg-blue-50 text-blue-700',
    },
    {
        value: 'wfh',
        label: 'WFH (Rumah)',
        icon: <Home className="w-4 h-4" />,
        badgeClass: 'bg-emerald-50 text-emerald-700',
    },
    {
        value: 'hybrid',
        label: 'Hybrid',
        icon: <Shuffle className="w-4 h-4" />,
        badgeClass: 'bg-violet-50 text-violet-700',
    },
];

function WorkTypeBadge({ type }: { type: WorkType }) {
    const opt =
        WORK_TYPE_OPTIONS.find((o) => o.value === type) ?? WORK_TYPE_OPTIONS[0];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${opt.badgeClass}`}
        >
            {opt.icon}
            {opt.label}
        </span>
    );
}

export default function Shifts({ shifts }: Props) {
    const [isEditing, setIsEditing] = useState<number | null>(null);

    const {
        data,
        setData,
        post,
        patch,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        name: '',
        start_time: '08:00',
        end_time: '17:00',
        color: '#4f46e5',
        work_type: 'wfo' as WorkType,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('settings.shifts.update', isEditing), {
                onSuccess: () => {
                    setIsEditing(null);
                    reset();
                    toast.success('Shift diperbarui');
                },
            });
        } else {
            post(route('settings.shifts.store'), {
                onSuccess: () => {
                    reset();
                    toast.success('Shift baru dibuat');
                },
            });
        }
    };

    const handleEdit = (shift: Shift) => {
        setIsEditing(shift.id);
        setData({
            name: shift.name,
            start_time: shift.start_time.substring(0, 5),
            end_time: shift.end_time.substring(0, 5),
            color: shift.color,
            work_type: shift.work_type,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus shift ini?')) {
            destroy(route('settings.shifts.destroy', id), {
                onSuccess: () => toast.success('Shift dihapus'),
            });
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Manajemen Shift" />

                <div className="flex flex-1 flex-col p-4 lg:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Manajemen Shift
                            </h1>
                            <p className="text-gray-500">
                                Atur jadwal dan tipe kerja fleksibel untuk
                                karyawan Anda.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <Card className="lg:col-span-1 border-none shadow-xl h-fit sticky top-6">
                            <CardHeader className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-t-xl">
                                <CardTitle className="flex items-center gap-2">
                                    {isEditing ? (
                                        <Edit2 className="w-5 h-5" />
                                    ) : (
                                        <Plus className="w-5 h-5" />
                                    )}
                                    {isEditing
                                        ? 'Edit Shift'
                                        : 'Tambah Shift Baru'}
                                </CardTitle>
                                <CardDescription className="text-indigo-100">
                                    Tentukan nama, jam kerja, dan tipe shift.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    {/* Nama Shift */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Shift</Label>
                                        <Input
                                            id="name"
                                            placeholder="Contoh: Pagi, Malam, atau Weekend"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="h-12 border-gray-200"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tipe Kerja */}
                                    <div className="space-y-2">
                                        <Label>Tipe Kerja</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {WORK_TYPE_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            'work_type',
                                                            opt.value,
                                                        )
                                                    }
                                                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                                                        data.work_type ===
                                                        opt.value
                                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                            : 'border-gray-200 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/50'
                                                    }`}
                                                >
                                                    {opt.icon}
                                                    {opt.value.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.work_type && (
                                            <p className="text-xs text-red-500">
                                                {errors.work_type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Jam */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Jam Mulai</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="time"
                                                    value={data.start_time}
                                                    onChange={(e) =>
                                                        setData(
                                                            'start_time',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="pl-10 h-12 border-gray-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jam Selesai</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="time"
                                                    value={data.end_time}
                                                    onChange={(e) =>
                                                        setData(
                                                            'end_time',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="pl-10 h-12 border-gray-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warna */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Palette className="w-4 h-4" />
                                            Warna Label
                                        </Label>
                                        <div className="flex gap-3">
                                            <Input
                                                type="color"
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        'color',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-16 h-12 p-1 border-gray-200 cursor-pointer"
                                            />
                                            <Input
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        'color',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-12 border-gray-200 font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isEditing
                                                ? 'Simpan Perubahan'
                                                : 'Buat Shift'}
                                        </Button>
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsEditing(null);
                                                    reset();
                                                }}
                                                className="h-12 border-2"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* List Section */}
                        <div className="lg:col-span-2">
                            <Card className="border-none shadow-xl overflow-hidden bg-white">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="font-bold py-4">
                                                Warna
                                            </TableHead>
                                            <TableHead className="font-bold">
                                                Nama Shift
                                            </TableHead>
                                            <TableHead className="font-bold">
                                                Tipe
                                            </TableHead>
                                            <TableHead className="font-bold">
                                                Jam Kerja
                                            </TableHead>
                                            <TableHead className="text-right font-bold pr-6">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {shifts.length > 0 ? (
                                            shifts.map((shift) => (
                                                <TableRow
                                                    key={shift.id}
                                                    className="hover:bg-indigo-50/30 transition-colors group"
                                                >
                                                    <TableCell className="py-4 pl-6">
                                                        <div
                                                            className="w-6 h-6 rounded-full shadow-inner ring-2 ring-white"
                                                            style={{
                                                                backgroundColor:
                                                                    shift.color,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-bold text-gray-900">
                                                        {shift.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <WorkTypeBadge
                                                            type={
                                                                shift.work_type
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                                                            <Clock className="w-4 h-4" />
                                                            {shift.start_time.substring(
                                                                0,
                                                                5,
                                                            )}{' '}
                                                            -{' '}
                                                            {shift.end_time.substring(
                                                                0,
                                                                5,
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        shift,
                                                                    )
                                                                }
                                                                className="h-8 w-8 rounded-full text-indigo-600 hover:bg-indigo-50"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        shift.id,
                                                                    )
                                                                }
                                                                className="h-8 w-8 rounded-full text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="h-48 text-center text-gray-400"
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Clock className="w-10 h-10 text-gray-200" />
                                                        <p>
                                                            Belum ada shift
                                                            terdaftar.
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

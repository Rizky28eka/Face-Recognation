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
        icon: <Building2 className="w-4 h-4 md:w-4 md:h-4" />,
        badgeClass: 'bg-blue-50 text-blue-700',
    },
    {
        value: 'wfh',
        label: 'WFH (Rumah)',
        icon: <Home className="w-4 h-4 md:w-4 md:h-4" />,
        badgeClass: 'bg-emerald-50 text-emerald-700',
    },
    {
        value: 'hybrid',
        label: 'Hybrid',
        icon: <Shuffle className="w-4 h-4 md:w-4 md:h-4" />,
        badgeClass: 'bg-violet-50 text-violet-700',
    },
];

function WorkTypeBadge({ type }: { type: WorkType }) {
    const opt =
        WORK_TYPE_OPTIONS.find((o) => o.value === type) ?? WORK_TYPE_OPTIONS[0];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold ${opt.badgeClass}`}
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

        // Scroll to form on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

                <div className="flex flex-1 flex-col p-4 lg:p-6 space-y-4 md:space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                Manajemen Shift
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                                Atur jadwal dan tipe kerja fleksibel untuk
                                karyawan Anda.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Form Section */}
                        <Card className="lg:col-span-1 border-none shadow-sm md:shadow-xl h-fit lg:sticky lg:top-6 bg-white">
                            <CardHeader className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-t-xl p-5 md:p-6">
                                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                    {isEditing ? (
                                        <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                                    ) : (
                                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                    )}
                                    {isEditing
                                        ? 'Edit Shift'
                                        : 'Tambah Shift Baru'}
                                </CardTitle>
                                <CardDescription className="text-indigo-100 text-xs md:text-sm">
                                    Tentukan nama, jam kerja, dan tipe shift.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-5 md:p-6">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 md:space-y-5"
                                >
                                    {/* Nama Shift */}
                                    <div className="space-y-1.5 md:space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-xs md:text-sm"
                                        >
                                            Nama Shift
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Contoh: Pagi, Malam..."
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="h-11 md:h-12 border-gray-200"
                                        />
                                        {errors.name && (
                                            <p className="text-[10px] md:text-xs text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tipe Kerja */}
                                    <div className="space-y-1.5 md:space-y-2">
                                        <Label className="text-xs md:text-sm">
                                            Tipe Kerja
                                        </Label>
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
                                                    className={`flex flex-col items-center gap-1 p-2 md:p-3 rounded-xl border-2 text-[10px] md:text-xs font-bold transition-all ${
                                                        data.work_type ===
                                                        opt.value
                                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                            : 'border-gray-200 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/50'
                                                    }`}
                                                >
                                                    {opt.icon}
                                                    <span className="truncate w-full text-center">
                                                        {opt.value.toUpperCase()}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.work_type && (
                                            <p className="text-[10px] md:text-xs text-red-500">
                                                {errors.work_type}
                                            </p>
                                        )}
                                    </div>

                                    {/* Jam */}
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="space-y-1.5 md:space-y-2">
                                            <Label className="text-xs md:text-sm">
                                                Jam Mulai
                                            </Label>
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
                                                    className="pl-9 h-11 md:h-12 border-gray-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 md:space-y-2">
                                            <Label className="text-xs md:text-sm">
                                                Jam Selesai
                                            </Label>
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
                                                    className="pl-9 h-11 md:h-12 border-gray-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warna */}
                                    <div className="space-y-1.5 md:space-y-2">
                                        <Label className="flex items-center gap-2 text-xs md:text-sm">
                                            <Palette className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            Warna Label
                                        </Label>
                                        <div className="flex gap-2 md:gap-3">
                                            <Input
                                                type="color"
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        'color',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-14 h-11 md:w-16 md:h-12 p-1 border-gray-200 cursor-pointer"
                                            />
                                            <Input
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        'color',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 md:h-12 border-gray-200 font-mono text-sm uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 h-11 md:h-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isEditing
                                                ? 'Simpan'
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
                                                className="h-11 md:h-12 border-2 sm:w-16 flex-shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                                <span className="sm:hidden ml-2">
                                                    Batal
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* List Section */}
                        <div className="lg:col-span-2">
                            {/* Desktop Table View */}
                            <Card className="hidden md:block border-none shadow-sm md:shadow-xl overflow-hidden bg-white">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="font-bold py-4 pl-6">
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

                            {/* Mobile List View */}
                            <div className="flex flex-col gap-3 md:hidden">
                                {shifts.length > 0 ? (
                                    shifts.map((shift) => (
                                        <Card
                                            key={shift.id}
                                            className="border-none shadow-sm bg-white overflow-hidden rounded-2xl relative"
                                        >
                                            <div
                                                className="absolute left-0 top-0 bottom-0 w-2"
                                                style={{
                                                    backgroundColor:
                                                        shift.color,
                                                }}
                                            />
                                            <CardContent className="p-4 pl-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">
                                                            {shift.name}
                                                        </h3>
                                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-wider">
                                                            {shift.color}
                                                        </p>
                                                    </div>
                                                    <WorkTypeBadge
                                                        type={shift.work_type}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-2 mb-4 bg-gray-50/50 rounded-xl p-3">
                                                    <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                                                    <p className="text-sm font-bold text-gray-700">
                                                        {shift.start_time.substring(
                                                            0,
                                                            5,
                                                        )}{' '}
                                                        -{' '}
                                                        {shift.end_time.substring(
                                                            0,
                                                            5,
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleEdit(shift)
                                                        }
                                                        className="flex-1 rounded-xl h-9 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold text-xs"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDelete(
                                                                shift.id,
                                                            )
                                                        }
                                                        className="flex-1 rounded-xl h-9 border-red-100 text-red-600 hover:bg-red-50 font-bold text-xs"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="border-dashed border-2 bg-gray-50/50 shadow-none">
                                        <CardContent className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                            <Clock className="w-10 h-10 text-gray-300 mb-3" />
                                            <p className="text-sm">
                                                Belum ada shift terdaftar.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

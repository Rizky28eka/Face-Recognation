import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { MapPin, Radius, Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/Components/ui/dialog';
import { Badge } from '@/Components/ui/badge';

interface Branch {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    radius: number;
    check_in_time: string;
    check_out_time: string;
    is_active: boolean;
}

interface Props {
    branches: Branch[];
}

export default function Branches({ branches }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const {
        data,
        setData,
        post,
        patch,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: '',
        latitude: '',
        longitude: '',
        radius: 100,
        check_in_time: '08:00',
        check_out_time: '17:00',
        is_active: true,
    });

    const openCreateDialog = () => {
        setEditingBranch(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (branch: Branch) => {
        setEditingBranch(branch);
        setData({
            name: branch.name,
            latitude: branch.latitude,
            longitude: branch.longitude,
            radius: branch.radius,
            check_in_time: branch.check_in_time,
            check_out_time: branch.check_out_time,
            is_active: branch.is_active,
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBranch) {
            patch(route('settings.branches.update', editingBranch.id), {
                onSuccess: () => {
                    toast.success('Cabang berhasil diperbarui');
                    setIsDialogOpen(false);
                },
            });
        } else {
            post(route('settings.branches.store'), {
                onSuccess: () => {
                    toast.success('Cabang baru berhasil ditambahkan');
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const deleteBranch = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus cabang ini?')) {
            router.delete(route('settings.branches.destroy', id), {
                onSuccess: () => toast.success('Cabang berhasil dihapus'),
                onError: (err: any) =>
                    toast.error(err.error || 'Gagal menghapus cabang'),
            });
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Manajemen Cabang" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-6xl mx-auto w-full">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                    Manajemen Cabang Kantor
                                </h1>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">
                                    Kelola berbagai lokasi cabang perusahaan
                                    Anda untuk sistem geofencing.
                                </p>
                            </div>
                            <Button
                                onClick={openCreateDialog}
                                className="w-full md:w-auto h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Tambah Cabang
                            </Button>
                        </div>

                        {/* Desktop Table View */}
                        <Card className="hidden md:block border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-bold py-4">
                                            Cabang
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Lokasi
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Radius
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Jam Kerja
                                        </TableHead>
                                        <TableHead className="font-bold">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right font-bold">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {branches.length > 0 ? (
                                        branches.map((branch) => (
                                            <TableRow
                                                key={branch.id}
                                                className="hover:bg-indigo-50/30 transition-colors group"
                                            >
                                                <TableCell className="py-4 font-bold text-gray-900">
                                                    {branch.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                                            {branch.latitude},{' '}
                                                            {branch.longitude}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {branch.radius}m
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-indigo-600">
                                                    {branch.check_in_time.substring(
                                                        0,
                                                        5,
                                                    )}{' '}
                                                    -{' '}
                                                    {branch.check_out_time.substring(
                                                        0,
                                                        5,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${branch.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                        />
                                                        <span
                                                            className={`text-[10px] font-black uppercase tracking-widest ${branch.is_active ? 'text-emerald-600' : 'text-red-600'}`}
                                                        >
                                                            {branch.is_active
                                                                ? 'Aktif'
                                                                : 'Nonaktif'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    branch,
                                                                )
                                                            }
                                                            className="h-8 w-8 rounded-full hover:bg-amber-50 hover:text-amber-600"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                deleteBranch(
                                                                    branch.id,
                                                                )
                                                            }
                                                            className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
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
                                                colSpan={6}
                                                className="h-48 text-center text-gray-400"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <MapPin className="w-10 h-10 text-gray-200" />
                                                    <p>
                                                        Belum ada cabang kantor
                                                        terdaftar.
                                                    </p>
                                                    <Button
                                                        variant="link"
                                                        onClick={
                                                            openCreateDialog
                                                        }
                                                        className="text-indigo-600 font-bold p-0 h-auto"
                                                    >
                                                        Tambah Cabang Pertama
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Card>

                        {/* Mobile List View */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {branches.length > 0 ? (
                                branches.map((branch) => (
                                    <Card
                                        key={branch.id}
                                        className="border-none shadow-sm bg-white overflow-hidden rounded-2xl"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">
                                                        {branch.name}
                                                    </h3>
                                                    <p className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[200px]">
                                                        {branch.latitude},{' '}
                                                        {branch.longitude}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        branch.is_active
                                                            ? 'border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] uppercase font-bold'
                                                            : 'border-red-100 bg-red-50 text-red-600 text-[10px] uppercase font-bold'
                                                    }
                                                >
                                                    {branch.is_active
                                                        ? 'Aktif'
                                                        : 'Nonaktif'}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50/50 rounded-xl p-3">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                                        Radius
                                                    </p>
                                                    <p className="text-sm font-bold text-indigo-600">
                                                        {branch.radius}m
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                                        Jam Kerja
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-700">
                                                        {branch.check_in_time.substring(
                                                            0,
                                                            5,
                                                        )}{' '}
                                                        -{' '}
                                                        {branch.check_out_time.substring(
                                                            0,
                                                            5,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        openEditDialog(branch)
                                                    }
                                                    className="flex-1 rounded-xl h-10 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold"
                                                >
                                                    <Edit2 className="w-4 h-4 mr-1.5" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        deleteBranch(branch.id)
                                                    }
                                                    className="flex-1 rounded-xl h-10 border-red-100 text-red-600 hover:bg-red-50 font-bold"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="border-dashed border-2 bg-gray-50/50 shadow-none">
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                        <MapPin className="w-10 h-10 text-gray-300 mb-3" />
                                        <p className="text-sm">
                                            Belum ada cabang terdaftar.
                                        </p>
                                        <Button
                                            variant="link"
                                            onClick={openCreateDialog}
                                            className="text-indigo-600 font-bold mt-2 h-auto p-0"
                                        >
                                            Tambah Cabang
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* Create/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-2xl w-[95%] max-h-[90vh] overflow-y-auto rounded-3xl border-none p-0 bg-white shadow-2xl">
                        <DialogHeader className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-xl">
                            <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">
                                {editingBranch
                                    ? 'Edit Cabang'
                                    : 'Tambah Cabang Baru'}
                            </DialogTitle>
                            <DialogDescription className="text-xs md:text-sm text-gray-500">
                                Masukkan detail lokasi dan pengaturan radius
                                untuk cabang ini.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submit}>
                            <div className="p-6 md:p-8 grid gap-4 md:gap-6 md:grid-cols-2">
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs md:text-sm font-bold text-gray-700"
                                    >
                                        Nama Cabang
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Contoh: Kantor Cabang Bandung"
                                        className="h-11 md:h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-[10px] md:text-xs text-red-500 font-medium">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="latitude"
                                        className="text-xs md:text-sm font-bold text-gray-700"
                                    >
                                        Latitude
                                    </Label>
                                    <Input
                                        id="latitude"
                                        value={data.latitude}
                                        onChange={(e) =>
                                            setData('latitude', e.target.value)
                                        }
                                        placeholder="-6.123456"
                                        className="h-11 md:h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    {errors.latitude && (
                                        <p className="text-[10px] md:text-xs text-red-500 font-medium">
                                            {errors.latitude}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="longitude"
                                        className="text-xs md:text-sm font-bold text-gray-700"
                                    >
                                        Longitude
                                    </Label>
                                    <Input
                                        id="longitude"
                                        value={data.longitude}
                                        onChange={(e) =>
                                            setData('longitude', e.target.value)
                                        }
                                        placeholder="106.123456"
                                        className="h-11 md:h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    {errors.longitude && (
                                        <p className="text-[10px] md:text-xs text-red-500 font-medium">
                                            {errors.longitude}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <Label
                                        htmlFor="radius"
                                        className="text-xs md:text-sm font-bold text-gray-700 flex justify-between"
                                    >
                                        <span>Radius Absensi (Meter)</span>
                                        <span className="text-indigo-600 font-black">
                                            {data.radius}m
                                        </span>
                                    </Label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <Radius className="w-5 h-5 text-gray-400 shrink-0" />
                                        <input
                                            type="range"
                                            min="10"
                                            max="1000"
                                            step="10"
                                            value={data.radius}
                                            onChange={(e) =>
                                                setData(
                                                    'radius',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="check_in"
                                        className="text-xs md:text-sm font-bold text-gray-700"
                                    >
                                        Jam Masuk
                                    </Label>
                                    <Input
                                        id="check_in"
                                        type="time"
                                        value={data.check_in_time}
                                        onChange={(e) =>
                                            setData(
                                                'check_in_time',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 md:h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="check_out"
                                        className="text-xs md:text-sm font-bold text-gray-700"
                                    >
                                        Jam Pulang
                                    </Label>
                                    <Input
                                        id="check_out"
                                        type="time"
                                        value={data.check_out_time}
                                        onChange={(e) =>
                                            setData(
                                                'check_out_time',
                                                e.target.value,
                                            )
                                        }
                                        className="h-11 md:h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl md:col-span-2 mt-2">
                                    <div className="space-y-1">
                                        <p className="text-xs md:text-sm font-bold text-gray-900 text-left">
                                            Status Aktif
                                        </p>
                                        <p className="text-[10px] md:text-xs text-gray-500">
                                            Jika dinonaktifkan, cabang ini tidak
                                            bisa digunakan untuk absensi.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked)
                                        }
                                    />
                                </div>
                            </div>

                            <DialogFooter className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-100 flex-col md:flex-row gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="w-full md:w-auto h-11 md:h-10 rounded-xl font-bold text-gray-600 border-gray-200"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto h-11 md:h-10 bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold shadow-lg shadow-indigo-200"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {editingBranch
                                        ? 'Simpan Perubahan'
                                        : 'Tambah Cabang'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    );
}

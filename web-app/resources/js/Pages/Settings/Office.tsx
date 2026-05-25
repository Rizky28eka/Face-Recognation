import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, useForm } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { MapPin, Clock, Radius, Save, Info, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OfficeSetting {
    id: number;
    latitude: string;
    longitude: string;
    radius: number;
    check_in_time: string;
    check_out_time: string;
    is_active: boolean;
}

interface Props {
    settings: OfficeSetting;
}

export default function Office({ settings }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        latitude: settings.latitude,
        longitude: settings.longitude,
        radius: settings.radius,
        check_in_time: settings.check_in_time,
        check_out_time: settings.check_out_time,
        is_active: settings.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('settings.office.update'), {
            onSuccess: () =>
                toast.success('Pengaturan kantor berhasil disimpan!'),
            onError: () => toast.error('Gagal menyimpan pengaturan.'),
        });
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Pengaturan Kantor" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="flex flex-col gap-4 py-4 md:gap-8 md:py-8 px-4 lg:px-6 max-w-4xl mx-auto w-full">
                        {/* Header */}
                        <div>
                            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                Pengaturan Kantor
                            </h1>
                            <p className="text-xs md:text-base text-gray-500 mt-1">
                                Kelola lokasi kantor, radius absensi, dan jam
                                kerja.
                            </p>
                        </div>

                        <form onSubmit={submit} className="grid gap-4 md:gap-6">
                            {/* Location & Radius Card */}
                            <Card className="border-none shadow-sm md:shadow-md rounded-3xl bg-white overflow-hidden">
                                <CardHeader className="border-b border-gray-50 bg-gray-50/50 p-5 md:p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 md:p-2.5 bg-indigo-50 rounded-2xl shrink-0">
                                            <MapPin className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base md:text-lg font-bold">
                                                Lokasi & Geofencing
                                            </CardTitle>
                                            <CardDescription className="text-[10px] md:text-sm mt-0.5">
                                                Tentukan titik pusat absensi dan
                                                batasan jarak.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 md:p-8 grid gap-5 md:gap-8 md:grid-cols-2">
                                    <div className="space-y-4 md:space-y-4">
                                        <div className="space-y-1.5 md:space-y-2">
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
                                                    setData(
                                                        'latitude',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 md:h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-colors"
                                                placeholder="-6.123456"
                                            />
                                            {errors.latitude && (
                                                <p className="text-[10px] md:text-xs text-red-500 font-medium">
                                                    {errors.latitude}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5 md:space-y-2">
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
                                                    setData(
                                                        'longitude',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 md:h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-colors"
                                                placeholder="106.123456"
                                            />
                                            {errors.longitude && (
                                                <p className="text-[10px] md:text-xs text-red-500 font-medium">
                                                    {errors.longitude}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:space-y-4 flex flex-col justify-between">
                                        <div className="space-y-1.5 md:space-y-2">
                                            <Label
                                                htmlFor="radius"
                                                className="text-xs md:text-sm font-bold text-gray-700 flex justify-between"
                                            >
                                                <span>
                                                    Radius Absensi (Meter)
                                                </span>
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
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400 leading-relaxed italic mt-1.5">
                                                Karyawan hanya bisa absen jika
                                                berada dalam radius ini dari
                                                titik pusat.
                                            </p>
                                        </div>

                                        <div className="p-3 md:p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-2.5 md:gap-3">
                                            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="text-[10px] md:text-xs font-bold text-amber-900 uppercase tracking-wider">
                                                    Tips Lokasi
                                                </p>
                                                <p className="text-[10px] md:text-[11px] text-amber-700 leading-relaxed">
                                                    Gunakan Google Maps untuk
                                                    mendapatkan koordinat
                                                    presisi kantor Anda. Klik
                                                    kanan pada peta untuk
                                                    menyalin koordinat.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Working Hours Card */}
                            <Card className="border-none shadow-sm md:shadow-md rounded-3xl bg-white overflow-hidden">
                                <CardHeader className="border-b border-gray-50 bg-gray-50/50 p-5 md:p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 md:p-2.5 bg-emerald-50 rounded-2xl shrink-0">
                                            <Clock className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base md:text-lg font-bold">
                                                Waktu Kerja
                                            </CardTitle>
                                            <CardDescription className="text-[10px] md:text-sm mt-0.5">
                                                Atur jam masuk dan jam pulang
                                                operasional.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 md:p-8 grid gap-4 md:gap-8 md:grid-cols-2">
                                    <div className="space-y-1.5 md:space-y-2">
                                        <Label
                                            htmlFor="check_in"
                                            className="text-xs md:text-sm font-bold text-gray-700"
                                        >
                                            Jam Masuk (Check-in)
                                        </Label>
                                        <div className="relative">
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
                                                className="h-11 md:h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-colors pl-9"
                                            />
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <Label
                                            htmlFor="check_out"
                                            className="text-xs md:text-sm font-bold text-gray-700"
                                        >
                                            Jam Pulang (Check-out)
                                        </Label>
                                        <div className="relative">
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
                                                className="h-11 md:h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-colors pl-9"
                                            />
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* System Status Card */}
                            <Card className="border-none shadow-sm md:shadow-md rounded-3xl bg-white overflow-hidden">
                                <CardContent className="p-5 md:p-8 flex items-center justify-between gap-4">
                                    <div className="flex gap-3 md:gap-4 items-center">
                                        <div
                                            className={`p-2 md:p-2.5 rounded-2xl shrink-0 ${data.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                                        >
                                            <Info className="w-5 h-5 md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm md:text-base">
                                                Status Sistem Absensi
                                            </p>
                                            <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">
                                                Aktifkan atau nonaktifkan fitur
                                                absensi secara global.
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData('is_active', checked)
                                        }
                                    />
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-2 md:pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 md:h-auto md:py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

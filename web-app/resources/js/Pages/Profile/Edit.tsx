import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import InputError from '@/Components/InputError';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import {
    User,
    Mail,
    Phone,
    Lock,
    Camera,
    Save,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRef, useState, useEffect } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    phone?: string;
    profile_photo_path?: string;
    is_face_registered: boolean;
    role: string;
}

interface Props {
    user: UserData;
    status?: string;
}

export default function Edit({ user, status }: Props) {
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
    });

    const {
        data: passData,
        setData: setPassData,
        put: putPass,
        processing: passProcessing,
        errors: passErrors,
        reset: resetPass,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (status === 'profile-updated') toast.success('Profil berhasil diperbarui.');
        if (status === 'photo-updated') toast.success('Foto profil berhasil diperbarui.');
        if (status === 'password-updated') toast.success('Password berhasil diubah.');
    }, [status]);

    const currentAvatar = photoPreview
        || (user.profile_photo_path ? `/storage/${user.profile_photo_path}` : null)
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoPreview(URL.createObjectURL(file));
    };

    const submitPhoto = () => {
        const file = photoInputRef.current?.files?.[0];
        if (!file) return;
        setUploadingPhoto(true);
        const formData = new FormData();
        formData.append('photo', file);
        router.post(route('profile.update-photo'), formData, {
            forceFormData: true,
            onFinish: () => {
                setUploadingPhoto(false);
                setPhotoPreview(null);
            },
            onError: () => {
                toast.error('Gagal mengunggah foto.');
                setUploadingPhoto(false);
            },
        });
    };

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        putPass(route('password.update'), {
            onSuccess: () => resetPass(),
        });
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Profil Saya" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="px-4 lg:px-6 py-4 md:py-8 max-w-3xl mx-auto w-full space-y-6">

                        <div>
                            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">Profil Saya</h1>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Kelola informasi akun dan foto profil Anda.</p>
                        </div>

                        {/* ── Photo Card ── */}
                        <Card className="border-none shadow-sm rounded-2xl bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold text-gray-800">Foto Profil</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative shrink-0">
                                    <Avatar className="h-24 w-24 rounded-2xl ring-4 ring-indigo-100">
                                        <AvatarImage src={currentAvatar} alt={user.name} className="object-cover" />
                                        <AvatarFallback className="rounded-2xl text-2xl bg-indigo-100 text-indigo-600 font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        type="button"
                                        onClick={() => photoInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 p-1.5 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors"
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3 flex-1 w-full sm:w-auto">
                                    <p className="text-sm text-gray-500">
                                        Format JPG, PNG, atau WebP. Maksimal 2 MB.
                                    </p>
                                    <input
                                        ref={photoInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => photoInputRef.current?.click()}
                                            className="rounded-xl border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                                        >
                                            <Camera className="w-4 h-4 mr-1.5" />
                                            Pilih Foto
                                        </Button>
                                        {photoPreview && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={submitPhoto}
                                                disabled={uploadingPhoto}
                                                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                                            >
                                                <Save className="w-4 h-4 mr-1.5" />
                                                {uploadingPhoto ? 'Menyimpan...' : 'Simpan Foto'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── Profile Data Card ── */}
                        <Card className="border-none shadow-sm rounded-2xl bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold text-gray-800">Informasi Pribadi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitProfile} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Lengkap</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="h-11 pl-10 border-gray-100 bg-gray-50/50 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Alamat Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="h-11 pl-10 border-gray-100 bg-gray-50/50 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                                            Nomor Telepon <span className="font-normal text-gray-400">(Opsional)</span>
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="08xxxxxxxxxx"
                                                className="h-11 pl-10 border-gray-100 bg-gray-50/50 rounded-xl"
                                            />
                                        </div>
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* ── Password Card ── */}
                        <Card className="border-none shadow-sm rounded-2xl bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold text-gray-800">Ubah Password</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitPassword} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="current_password" className="text-sm font-semibold text-gray-700">Password Saat Ini</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="current_password"
                                                type="password"
                                                value={passData.current_password}
                                                onChange={(e) => setPassData('current_password', e.target.value)}
                                                placeholder="••••••••"
                                                className="h-11 pl-10 border-gray-100 bg-gray-50/50 rounded-xl"
                                            />
                                        </div>
                                        <InputError message={passErrors.current_password} />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="new_password" className="text-sm font-semibold text-gray-700">Password Baru</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    id="new_password"
                                                    type="password"
                                                    value={passData.password}
                                                    onChange={(e) => setPassData('password', e.target.value)}
                                                    placeholder="••••••••"
                                                    className="h-11 pl-10 border-gray-100 bg-gray-50/50 rounded-xl"
                                                />
                                            </div>
                                            <InputError message={passErrors.password} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700">Konfirmasi Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={passData.password_confirmation}
                                                    onChange={(e) => setPassData('password_confirmation', e.target.value)}
                                                    placeholder="••••••••"
                                                    className="h-11 pl-10 border-gray-100 bg-gray-50/50 rounded-xl"
                                                />
                                            </div>
                                            <InputError message={passErrors.password_confirmation} />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            disabled={passProcessing}
                                            className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold gap-2"
                                        >
                                            <Lock className="w-4 h-4" />
                                            {passProcessing ? 'Menyimpan...' : 'Ubah Password'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* ── Face Registration Card ── */}
                        <Card className="border-none shadow-sm rounded-2xl bg-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-bold text-gray-800">Registrasi Wajah</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    {user.is_face_registered ? (
                                        <div className="p-2 bg-emerald-100 rounded-xl">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-amber-100 rounded-xl">
                                            <Camera className="w-5 h-5 text-amber-600" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {user.is_face_registered ? 'Wajah Terdaftar' : 'Belum Terdaftar'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.is_face_registered
                                                ? 'Wajah Anda sudah dikenali oleh sistem.'
                                                : 'Daftarkan wajah untuk bisa melakukan absensi.'}
                                        </p>
                                    </div>
                                </div>
                                <Link href={route('profile.face-setup')}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 shrink-0"
                                    >
                                        {user.is_face_registered ? 'Daftar Ulang' : 'Daftar Sekarang'}
                                        <ArrowRight className="w-4 h-4 ml-1.5" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

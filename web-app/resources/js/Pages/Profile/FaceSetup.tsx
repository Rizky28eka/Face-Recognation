import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import Webcam from 'react-webcam';
import {
    Camera,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    RefreshCcw,
} from 'lucide-react';
import { toast } from 'sonner';

const REGISTRATION_STEPS = [
    { title: 'Lurus', desc: 'Tatap lurus ke depan menghadap kamera' },
    { title: 'Tengok Kiri', desc: 'Tengokkan kepala Anda sedikit ke kiri' },
    { title: 'Tengok Kanan', desc: 'Tengokkan kepala Anda sedikit ke kanan' },
    { title: 'Senyum', desc: 'Berikan senyuman terbaik Anda ke kamera' },
    { title: 'Lihat Atas', desc: 'Angkat dagu dan lihat sedikit ke atas' },
];

interface CapturedImage {
    src: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    path?: string;
}

export default function FaceSetup() {
    const webcamRef = useRef<Webcam>(null);
    const [images, setImages] = useState<CapturedImage[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [processing, setProcessing] = useState(false);
    // Add state to track if we are retaking a specific image
    const [retakeIndex, setRetakeIndex] = useState<number | null>(null);
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            if (retakeIndex !== null) {
                // Replacing a specific failed image
                setImages((prev) => {
                    const newImages = [...prev];
                    newImages[retakeIndex] = {
                        src: imageSrc,
                        status: 'pending',
                    };
                    return newImages;
                });
                setRetakeIndex(null); // Go back to review mode
            } else {
                // Normal flow: adding new image
                setImages((prev) => [
                    ...prev,
                    { src: imageSrc, status: 'pending' },
                ]);
                setCurrentStep((prev) => prev + 1);
            }
        }
    }, [webcamRef, retakeIndex]);

    const reset = () => {
        setImages([]);
        setCurrentStep(0);
        setRetakeIndex(null);
    };

    const submit = async () => {
        if (images.length !== 5) return;

        setProcessing(true);
        let hasError = false;
        const currentImages = [...images];

        // Process only pending or error images
        for (let i = 0; i < currentImages.length; i++) {
            if (currentImages[i].status === 'success') continue;

            // Mark as uploading
            setImages((prev) => {
                const updated = [...prev];
                updated[i].status = 'uploading';
                return updated;
            });

            try {
                const response = await window.axios.post(
                    route('profile.face-setup.upload-single'),
                    {
                        image: currentImages[i].src,
                        index: i,
                    },
                );

                if (response.data.success) {
                    currentImages[i].status = 'success';
                    currentImages[i].path = response.data.path;
                    setImages((prev) => {
                        const updated = [...prev];
                        updated[i].status = 'success';
                        updated[i].path = response.data.path;
                        return updated;
                    });
                }
            } catch (error: any) {
                console.error('Upload error', error);
                hasError = true;
                currentImages[i].status = 'error';
                setImages((prev) => {
                    const updated = [...prev];
                    updated[i].status = 'error';
                    return updated;
                });

                // Ambil pesan error dari server jika ada
                const serverMessage: string =
                    error?.response?.data?.message ?? null;
                const httpStatus: number = error?.response?.status ?? 0;

                // Error 409: wajah sudah terdaftar akun lain — hentikan proses
                if (httpStatus === 409) {
                    toast.error(
                        serverMessage ??
                            'Wajah ini sudah terdaftar di akun lain.',
                        { duration: 6000 },
                    );
                    setProcessing(false);
                    return; // Hentikan loop, tidak perlu lanjut foto berikutnya
                }

                // Error lain: tampilkan pesan server jika ada, atau pesan default
                if (serverMessage) {
                    toast.error(serverMessage);
                }
            }
        }

        if (hasError) {
            setProcessing(false);
            toast.error(
                'Beberapa foto gagal diverifikasi AI. Silakan klik foto yang bergaris merah untuk mengambil ulang.',
            );
        } else {
            // All success, send complete request
            router.post(
                route('profile.face-setup.complete'),
                {
                    main_photo_path: currentImages[0]?.path,
                },
                {
                    onFinish: () => setProcessing(false),
                    onError: () => {
                        toast.error('Gagal menyelesaikan pendaftaran wajah.');
                        setProcessing(false);
                    },
                },
            );
        }
    };

    const isComplete = currentStep === 5;
    const isRetaking = retakeIndex !== null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Registrasi Wajah" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Registrasi Wajah
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Sistem membutuhkan 5 foto wajah Anda untuk akurasi maksimal.
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <Card className="border-none shadow-2xl rounded-3xl bg-white overflow-hidden">
                    <CardHeader
                        className={`${isComplete ? 'bg-emerald-600' : 'bg-indigo-600'} text-white p-8 text-center transition-colors`}
                    >
                        <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                            {isComplete ? (
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            ) : (
                                <Camera className="w-8 h-8 text-white" />
                            )}
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            {isRetaking
                                ? 'Ambil Ulang Foto'
                                : isComplete
                                  ? 'Selesai!'
                                  : `Langkah ${currentStep + 1} dari 5`}
                        </CardTitle>
                        <CardDescription className="text-white/80 font-medium mt-2">
                            {isRetaking
                                ? REGISTRATION_STEPS[retakeIndex].desc
                                : isComplete
                                  ? 'Seluruh foto berhasil diambil. Silakan verifikasi.'
                                  : REGISTRATION_STEPS[currentStep].desc}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Camera / Preview Area */}
                        <div className="relative aspect-video bg-black overflow-hidden">
                            {!isComplete || isRetaking ? (
                                <>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover transform scale-x-[-1]"
                                        videoConstraints={{
                                            facingMode: 'user',
                                        }}
                                    />
                                    {/* Overlay helper grid/circle */}
                                    <div className="absolute inset-0 border-2 border-dashed border-white/30 m-8 sm:m-12 rounded-3xl pointer-events-none flex items-center justify-center">
                                        <div className="w-48 h-64 sm:w-64 sm:h-80 border-2 border-indigo-400 rounded-full animate-pulse opacity-50" />
                                    </div>
                                    {isRetaking && (
                                        <div className="absolute top-4 right-4">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    setRetakeIndex(null)
                                                }
                                            >
                                                Batal Ambil Ulang
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full bg-slate-900 grid grid-cols-5 p-2 gap-2">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() =>
                                                img.status === 'error' &&
                                                setRetakeIndex(idx)
                                            }
                                            className={`relative rounded-xl overflow-hidden border-2 h-full transition-all ${
                                                img.status === 'error'
                                                    ? 'border-red-500 cursor-pointer hover:opacity-80 ring-2 ring-red-500/50'
                                                    : img.status === 'success'
                                                      ? 'border-emerald-500'
                                                      : img.status ===
                                                          'uploading'
                                                        ? 'border-blue-400 opacity-50'
                                                        : 'border-slate-700'
                                            }`}
                                        >
                                            <img
                                                src={img.src}
                                                className="w-full h-full object-cover transform scale-x-[-1]"
                                                alt={`Step ${idx}`}
                                            />
                                            {img.status === 'error' && (
                                                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                                    <div className="bg-red-600 text-white text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 shadow-lg">
                                                        <RefreshCcw className="w-3 h-3" />{' '}
                                                        Ulangi
                                                    </div>
                                                </div>
                                            )}
                                            {img.status === 'success' && (
                                                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            )}
                                            {img.status === 'uploading' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-1">
                                                {REGISTRATION_STEPS[idx].title}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-gray-100">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${(currentStep / 5) * 100}%` }}
                            />
                        </div>

                        <div className="p-6 sm:p-8 space-y-6">
                            {(!isComplete || isRetaking) && (
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 text-blue-700 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>
                                        {isRetaking
                                            ? `Ulangi foto "${REGISTRATION_STEPS[retakeIndex].title}". Posisikan wajah dengan jelas.`
                                            : 'Posisikan wajah Anda di dalam lingkaran dan ikuti instruksi gerakan di atas.'}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4">
                                {!isComplete || isRetaking ? (
                                    <Button
                                        onClick={capture}
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-lg shadow-lg transition-all"
                                    >
                                        <Camera className="w-5 h-5 mr-2" />
                                        {isRetaking
                                            ? 'Ambil Ulang'
                                            : `Ambil Foto (${currentStep + 1}/5)`}
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={reset}
                                            disabled={processing}
                                            className="flex-1 h-14 rounded-2xl font-bold border-2"
                                        >
                                            <RefreshCcw className="w-5 h-5 mr-2" />
                                            Mulai Ulang
                                        </Button>
                                        <Button
                                            onClick={submit}
                                            disabled={
                                                processing ||
                                                images.every(
                                                    (img) =>
                                                        img.status ===
                                                        'success',
                                                )
                                            }
                                            className={`flex-[2] h-14 rounded-2xl font-bold text-lg shadow-lg transition-all text-white ${
                                                images.every(
                                                    (img) =>
                                                        img.status ===
                                                        'success',
                                                )
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                                            }`}
                                        >
                                            {processing ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    {images.some(
                                                        (img) =>
                                                            img.status ===
                                                            'error',
                                                    )
                                                        ? 'Verifikasi Ulang'
                                                        : 'Verifikasi & Simpan'}
                                                </div>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
                FaceLog &copy; {new Date().getFullYear()} Bilcode Digital
                Solutions
            </div>
        </div>
    );
}

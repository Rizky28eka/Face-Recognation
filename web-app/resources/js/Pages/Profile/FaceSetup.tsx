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

export default function FaceSetup() {
    const webcamRef = useRef<Webcam>(null);
    const [images, setImages] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [processing, setProcessing] = useState(false);
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImages((prev) => [...prev, imageSrc]);
            setCurrentStep((prev) => prev + 1);
        }
    }, [webcamRef]);

    const reset = () => {
        setImages([]);
        setCurrentStep(0);
    };

    const submit = () => {
        if (images.length !== 5) return;

        setProcessing(true);
        router.post(
            route('profile.face-setup.store'),
            {
                images: images,
            },
            {
                onFinish: () => setProcessing(false),
                onError: (errors) => {
                    toast.error('Gagal menyimpan foto wajah.');
                    reset();
                },
            },
        );
    };

    const isComplete = currentStep === 5;

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
                            {isComplete
                                ? 'Selesai!'
                                : `Langkah ${currentStep + 1} dari 5`}
                        </CardTitle>
                        <CardDescription className="text-white/80 font-medium mt-2">
                            {isComplete
                                ? 'Seluruh foto berhasil diambil. Silakan simpan.'
                                : REGISTRATION_STEPS[currentStep].desc}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Camera / Preview Area */}
                        <div className="relative aspect-video bg-black overflow-hidden">
                            {!isComplete ? (
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
                                </>
                            ) : (
                                <div className="w-full h-full bg-slate-900 grid grid-cols-5 p-2 gap-2">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative rounded-xl overflow-hidden border-2 border-slate-700 h-full"
                                        >
                                            <img
                                                src={img}
                                                className="w-full h-full object-cover transform scale-x-[-1]"
                                                alt={`Step ${idx}`}
                                            />
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
                            {!isComplete && (
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 text-blue-700 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>
                                        Posisikan wajah Anda di dalam lingkaran
                                        dan ikuti instruksi gerakan di atas.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4">
                                {!isComplete ? (
                                    <Button
                                        onClick={capture}
                                        className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-lg shadow-lg transition-all"
                                    >
                                        <Camera className="w-5 h-5 mr-2" />
                                        Ambil Foto ({currentStep + 1}/5)
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
                                            Ulangi
                                        </Button>
                                        <Button
                                            onClick={submit}
                                            disabled={processing}
                                            className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all text-white"
                                        >
                                            {processing ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                    Kirim & Simpan Data
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

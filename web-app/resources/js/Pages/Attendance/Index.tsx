import { AppSidebar } from "@/Components/app-sidebar";
import { SiteHeader } from "@/Components/site-header";
import { SidebarInset, SidebarProvider } from "@/Components/ui/sidebar";
import { Head } from "@inertiajs/react";
import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Camera,
    MapPin,
    Signal,
    Loader2,
    CheckCircle2,
    XCircle,
    Upload,
    VideoOff,
    ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Attendance {
    id: number;
    user: { name: string };
    type: string;
    confidence: number;
    attended_at: string;
    branch?: {
        name: string;
    };
}

interface Props {
    recentAttendances: Attendance[];
    userRole: string;
}

export default function Index({ recentAttendances, userRole }: Props) {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [location, setLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [networkInfo, setNetworkInfo] = useState<string>("Unknown");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [cameraPermission, setCameraPermission] = useState<
        "prompt" | "granted" | "denied" | "checking"
    >("checking");

    // Check & request camera permission on mount
    useEffect(() => {
        if (userRole !== "karyawan") return;

        const checkCamera = async () => {
            try {
                // Check existing permission state first
                if ("permissions" in navigator) {
                    const perm = await navigator.permissions.query({
                        name: "camera" as PermissionName,
                    });
                    if (perm.state === "granted") {
                        setCameraPermission("granted");
                        return;
                    }
                    if (perm.state === "denied") {
                        setCameraPermission("denied");
                        return;
                    }
                }
                // State is "prompt" — belum pernah diminta
                setCameraPermission("prompt");
            } catch {
                setCameraPermission("prompt");
            }
        };

        checkCamera();
    }, [userRole]);

    const requestCameraAccess = async () => {
        setCameraPermission("checking");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            stream.getTracks().forEach((t) => t.stop()); // stop immediately, Webcam component manages its own stream
            setCameraPermission("granted");
            toast.success("Akses kamera berhasil diberikan.");
        } catch {
            setCameraPermission("denied");
            toast.error(
                "Akses kamera ditolak. Izinkan kamera di pengaturan browser.",
            );
        }
    };

    // Get Geolocation on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    const msg =
                        error.code === 1
                            ? "Izin lokasi ditolak. Izinkan akses lokasi di browser untuk absensi WFO."
                            : error.code === 2
                              ? "Lokasi tidak tersedia. Pastikan GPS aktif."
                              : "Gagal mendapatkan lokasi. Coba muat ulang halaman.";
                    toast.error(msg);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
            );
        } else {
            toast.error("Browser tidak mendukung GPS.");
        }

        // Get Network Info
        if ("connection" in navigator) {
            const conn = (
                navigator as unknown as {
                    connection: { effectiveType: string; type: string };
                }
            ).connection;
            setNetworkInfo(
                `${conn.effectiveType || "N/A"} (${conn.type || "unknown"})`,
            );
        }
    }, []);

    const handleCheckIn = useCallback(
        async (image: string) => {
            setProcessing(true);
            setStatus("idle");

            try {
                const response = await axios.post(
                    route("attendance.check-in"),
                    {
                        image,
                        latitude: location?.lat,
                        longitude: location?.lng,
                        network_info: networkInfo,
                    },
                );

                if (response.data.success) {
                    setStatus("success");
                    setMessage(response.data.message);
                    toast.success(response.data.message);
                }
            } catch (error) {
                setStatus("error");
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 400 &&
                    error.response?.data?.data
                ) {
                    console.error(
                        "[DEBUG FRONTEND] AI Service Response Data:",
                        JSON.stringify(error.response.data.data, null, 2),
                    );
                }
                const errorMessage =
                    axios.isAxiosError(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "Gagal melakukan absensi. Silakan coba lagi.";
                setMessage(errorMessage);
                toast.error(errorMessage);
            } finally {
                setProcessing(false);
            }
        },
        [location, networkInfo],
    );

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImgSrc(imageSrc);
            handleCheckIn(imageSrc);
        }
    }, [handleCheckIn]);

    const reset = () => {
        setImgSrc(null);
        setStatus("idle");
        setMessage("");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImgSrc(base64String);
                handleCheckIn(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <Head title="Presensi Wajah" />

                <div className="flex flex-1 flex-col pb-8">
                    <div className="px-4 lg:px-6 py-4 md:py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {/* Camera Section — only for karyawan */}
                            {userRole === 'karyawan' ? (
                            <div className="md:col-span-2 space-y-4 md:space-y-6">
                                <div>
                                    <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                        Presensi Wajah
                                    </h1>
                                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                                        Scan wajah Anda untuk melakukan absensi
                                        masuk atau pulang.
                                    </p>
                                </div>

                                <Card className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-black/5 rounded-3xl">
                                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 md:p-6">
                                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                                            <Camera className="w-5 h-5" />
                                            Kamera Verifikasi
                                        </CardTitle>
                                        <CardDescription className="text-indigo-100 text-xs md:text-sm">
                                            Posisikan wajah Anda di tengah area
                                            scan.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 relative">
                                        {!imgSrc ? (
                                            <div className="aspect-video bg-black relative group">
                                                {/* Camera permission states */}
                                                {cameraPermission === "checking" && (
                                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900 gap-3">
                                                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                                                        <p className="text-white/70 text-sm">Memeriksa izin kamera...</p>
                                                    </div>
                                                )}

                                                {cameraPermission === "prompt" && (
                                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900 gap-4 px-6 text-center">
                                                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                                            <Camera className="w-8 h-8 text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-semibold text-base">Izin Kamera Diperlukan</p>
                                                            <p className="text-white/60 text-sm mt-1">
                                                                Sistem absensi membutuhkan akses kamera untuk verifikasi wajah.
                                                            </p>
                                                        </div>
                                                        <Button
                                                            onClick={requestCameraAccess}
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                                                        >
                                                            <Camera className="w-4 h-4" />
                                                            Izinkan Akses Kamera
                                                        </Button>
                                                    </div>
                                                )}

                                                {cameraPermission === "denied" && (
                                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900 gap-4 px-6 text-center">
                                                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                                            <ShieldAlert className="w-8 h-8 text-red-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-semibold text-base">Akses Kamera Ditolak</p>
                                                            <p className="text-white/60 text-sm mt-1">
                                                                Buka pengaturan browser dan izinkan akses kamera untuk situs ini, lalu muat ulang halaman.
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                onClick={requestCameraAccess}
                                                                className="border-white/20 text-white hover:bg-white/10 gap-2"
                                                            >
                                                                <VideoOff className="w-4 h-4" />
                                                                Coba Lagi
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => window.location.reload()}
                                                                className="border-white/20 text-white hover:bg-white/10"
                                                            >
                                                                Muat Ulang
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    mirrored={false}
                                                    className="w-full h-full object-cover"
                                                    videoConstraints={{
                                                        facingMode: "user",
                                                    }}
                                                    onUserMedia={() => setCameraPermission("granted")}
                                                    onUserMediaError={() => setCameraPermission("denied")}
                                                />
                                                <div className="absolute inset-0 border-2 border-dashed border-white/20 m-6 md:m-12 rounded-3xl pointer-events-none flex items-center justify-center transition-all group-hover:border-white/40">
                                                    <div className="w-48 h-48 md:w-72 md:h-72 border-2 border-indigo-400/50 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-black flex items-center justify-center relative">
                                                <img
                                                    src={imgSrc}
                                                    alt="captured"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                                    {status === "success" && (
                                                        <CheckCircle2 className="w-16 h-16 md:w-24 md:h-24 text-green-400 animate-bounce" />
                                                    )}
                                                    {status === "error" && (
                                                        <XCircle className="w-16 h-16 md:w-24 md:h-24 text-red-400 animate-shake" />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-6 md:p-8 flex flex-col items-center gap-4 md:gap-6">
                                            {status === "idle" &&
                                                !processing && (
                                                    <div className="flex flex-col md:flex-row gap-3 w-full max-w-md justify-center">
                                                        <Button
                                                            onClick={capture}
                                                            disabled={cameraPermission !== "granted"}
                                                            className="flex-1 h-14 md:h-16 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Camera className="mr-2 w-5 h-5" />
                                                            {cameraPermission === "granted" ? "Ambil Foto" : "Izinkan Kamera Dulu"}
                                                        </Button>

                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            onChange={
                                                                handleFileUpload
                                                            }
                                                            accept="image/*"
                                                            className="hidden"
                                                        />

                                                        <Button
                                                            variant="outline"
                                                            onClick={() =>
                                                                fileInputRef.current?.click()
                                                            }
                                                            className="flex-1 h-14 md:h-16 text-lg border-2 border-indigo-100 hover:bg-indigo-50 text-indigo-600 rounded-2xl transition-all active:scale-95"
                                                        >
                                                            <Upload className="mr-2 w-5 h-5" />
                                                            Upload Foto
                                                        </Button>
                                                    </div>
                                                )}

                                            {processing && (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 animate-spin" />
                                                    <p className="text-base md:text-lg font-semibold text-gray-700">
                                                        Memverifikasi...
                                                    </p>
                                                </div>
                                            )}

                                            {status !== "idle" &&
                                                !processing && (
                                                    <div className="text-center space-y-4 md:space-y-6 w-full max-w-sm">
                                                        <p
                                                            className={`text-lg md:text-2xl font-bold ${status === "success" ? "text-green-600" : "text-red-600"}`}
                                                        >
                                                            {message}
                                                        </p>
                                                        <Button
                                                            variant="outline"
                                                            onClick={reset}
                                                            className="w-full rounded-full h-12 border-2 font-semibold"
                                                        >
                                                            Coba Lagi
                                                        </Button>
                                                    </div>
                                                )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            ) : (
                            <div className="md:col-span-2 space-y-4 md:space-y-6">
                                <div>
                                    <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                                        Presensi Wajah
                                    </h1>
                                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                                        Pantau riwayat kehadiran karyawan.
                                    </p>
                                </div>
                                <Card className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-black/5 rounded-3xl">
                                    <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                                        <div className="p-4 bg-gray-100 rounded-full">
                                            <Camera className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <p className="text-lg font-semibold text-gray-600">Fitur Presensi Tidak Tersedia</p>
                                        <p className="text-sm text-gray-400 max-w-xs">
                                            Fitur scan wajah hanya tersedia untuk karyawan. Gunakan menu Laporan untuk memantau kehadiran.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                            )}

                            {/* Info Section */}
                            <div className="space-y-4 md:space-y-6">
                                <Card className="border-none shadow-sm rounded-3xl bg-white/50 backdrop-blur-sm p-4 md:p-6">
                                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">
                                        Status Perangkat
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="p-2.5 md:p-3 bg-indigo-50 rounded-2xl shrink-0">
                                                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                    Koordinat GPS
                                                </p>
                                                <p className="text-sm font-bold text-gray-700 truncate">
                                                    {location
                                                        ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                                                        : "Mencari lokasi..."}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="p-2.5 md:p-3 bg-emerald-50 rounded-2xl shrink-0">
                                                <Signal className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                    Kualitas Jaringan
                                                </p>
                                                <p className="text-sm font-bold text-gray-700 truncate">
                                                    {networkInfo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="border-none shadow-sm rounded-3xl bg-white/50 backdrop-blur-sm p-4 md:p-6">
                                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">
                                        Aktivitas Hari Ini
                                    </h3>
                                    <div>
                                        {recentAttendances.length > 0 ? (
                                            <div className="space-y-3">
                                                {recentAttendances
                                                    .slice(0, 5)
                                                    .map((att) => (
                                                        <div
                                                            key={att.id}
                                                            className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-gray-50/80 transition-colors shadow-sm"
                                                        >
                                                            <div className="flex flex-col min-w-0 pr-2">
                                                                <span className="text-sm font-bold text-gray-700 truncate">
                                                                    {
                                                                        att.user
                                                                            .name
                                                                    }
                                                                </span>
                                                                <span className="text-[10px] text-gray-400 font-medium truncate">
                                                                    {
                                                                        att.attended_at
                                                                    }{" "}
                                                                    •{" "}
                                                                    {att.branch
                                                                        ?.name ||
                                                                        "Luar Area"}
                                                                </span>
                                                            </div>
                                                            <span
                                                                className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter shrink-0 ${att.type === "check-in" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                                                            >
                                                                {att.type}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                                                <p className="text-sm text-gray-400 font-medium">
                                                    Belum ada riwayat.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

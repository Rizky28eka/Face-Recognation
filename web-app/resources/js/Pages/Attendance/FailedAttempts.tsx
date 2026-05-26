import { AppSidebar } from '@/Components/app-sidebar';
import { SiteHeader } from '@/Components/site-header';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { AlertTriangle, Calendar as CalendarIcon, Eye, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

interface FailedRecord {
    id: number;
    user: { id: number; name: string; email: string };
    branch?: { id: number; name: string };
    reason: string;
    reason_message: string;
    confidence: number | null;
    image_path: string | null;
    latitude: string | null;
    longitude: string | null;
    ip_address: string | null;
    attempted_at: string;
}

interface Props {
    failed: {
        data: FailedRecord[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { start_date?: string; end_date?: string; reason?: string };
}

const REASON_LABELS: Record<string, { label: string; color: 'destructive' | 'secondary' | 'outline' }> = {
    no_face:       { label: 'Wajah Tidak Terdeteksi', color: 'secondary' },
    low_confidence:{ label: 'Wajah Tidak Dikenali',   color: 'outline' },
    not_in_branch: { label: 'Bukan Anggota Cabang',   color: 'secondary' },
    face_mismatch: { label: 'Wajah Tidak Cocok',       color: 'destructive' },
    unknown:       { label: 'Tidak Diketahui',          color: 'outline' },
};

export default function FailedAttempts({ failed, filters }: Props) {
    const [startDate, setStartDate] = useState(filters.start_date ?? '');
    const [endDate, setEndDate]     = useState(filters.end_date ?? '');
    const [reason, setReason]       = useState(filters.reason ?? 'all');
    const [preview, setPreview]     = useState<FailedRecord | null>(null);

    const applyFilter = () => {
        router.get(route('attendance.failed'), {
            start_date: startDate || undefined,
            end_date:   endDate   || undefined,
            reason:     reason === 'all' ? undefined : reason,
        }, { preserveState: true });
    };

    const resetFilter = () => {
        setStartDate(''); setEndDate(''); setReason('all');
        router.get(route('attendance.failed'));
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <Head title="Percobaan Absensi Gagal" />

                <div className="flex flex-1 flex-col gap-6 p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Percobaan Absensi Gagal</h1>
                            <p className="text-sm text-muted-foreground">
                                Log karyawan yang gagal melakukan absensi karena wajah tidak cocok atau tidak dikenali
                            </p>
                        </div>
                    </div>

                    {/* Filter */}
                    <Card>
                        <CardContent className="flex flex-wrap gap-3 pt-4">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-40" />
                                <span className="text-muted-foreground text-sm">s/d</span>
                                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-40" />
                            </div>
                            <Select value={reason} onValueChange={setReason}>
                                <SelectTrigger className="w-52">
                                    <SelectValue placeholder="Semua Alasan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Alasan</SelectItem>
                                    <SelectItem value="no_face">Wajah Tidak Terdeteksi</SelectItem>
                                    <SelectItem value="low_confidence">Wajah Tidak Dikenali</SelectItem>
                                    <SelectItem value="not_in_branch">Bukan Anggota Cabang</SelectItem>
                                    <SelectItem value="face_mismatch">Wajah Tidak Cocok</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={applyFilter}>Filter</Button>
                            <Button variant="outline" onClick={resetFilter}>Reset</Button>
                        </CardContent>
                    </Card>

                    {/* Summary badges */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>Total <strong>{failed.total}</strong> percobaan gagal ditemukan</span>
                    </div>

                    {/* Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Karyawan</TableHead>
                                        <TableHead>Cabang</TableHead>
                                        <TableHead>Alasan</TableHead>
                                        <TableHead>Confidence</TableHead>
                                        <TableHead>IP Address</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead className="text-center">Foto</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {failed.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                                                Tidak ada percobaan gagal ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : failed.data.map(row => {
                                        const meta = REASON_LABELS[row.reason] ?? REASON_LABELS.unknown;
                                        return (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    <div className="font-medium">{row.user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{row.user.email}</div>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {row.branch?.name ?? <span className="text-muted-foreground">—</span>}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={meta.color}>{meta.label}</Badge>
                                                    <p className="mt-1 text-xs text-muted-foreground max-w-[220px]">{row.reason_message}</p>
                                                </TableCell>
                                                <TableCell>
                                                    {row.confidence !== null
                                                        ? <span className={`font-mono text-sm ${row.confidence < 0.5 ? 'text-red-500' : 'text-amber-500'}`}>
                                                            {(row.confidence * 100).toFixed(1)}%
                                                          </span>
                                                        : <span className="text-muted-foreground">—</span>
                                                    }
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">{row.ip_address ?? '—'}</TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(row.attempted_at).toLocaleString('id-ID', {
                                                        day: '2-digit', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {row.image_path ? (
                                                        <Button size="sm" variant="ghost" onClick={() => setPreview(row)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">—</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {failed.last_page > 1 && (
                        <div className="flex justify-center gap-1">
                            {failed.links.map((link, i) => (
                                <Button
                                    key={i}
                                    size="sm"
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Image preview dialog */}
                <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Foto Percobaan — {preview?.user.name}</DialogTitle>
                        </DialogHeader>
                        {preview?.image_path && (
                            <img
                                src={`/storage/${preview.image_path}`}
                                alt="Foto percobaan gagal"
                                className="w-full rounded-lg object-cover"
                            />
                        )}
                        <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Waktu: {preview && new Date(preview.attempted_at).toLocaleString('id-ID')}</p>
                            <p>IP: {preview?.ip_address ?? '—'}</p>
                            {preview?.latitude && preview.longitude && (
                                <a
                                    href={`https://maps.google.com/?q=${preview.latitude},${preview.longitude}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Lihat di Google Maps
                                </a>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </SidebarInset>
        </SidebarProvider>
    );
}

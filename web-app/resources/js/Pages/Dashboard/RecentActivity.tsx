import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

interface Props {
    role: 'superadmin' | 'owner' | 'karyawan';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    auditLogs?: any[];
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDateShort(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function ConfidenceBadge({ confidence }: { confidence: number | undefined }) {
    if (!confidence) return <span className="text-gray-400 text-sm">-</span>;
    const pct = (confidence * 100).toFixed(1);
    const isHigh = confidence > 0.7;
    return (
        <Badge
            variant={isHigh ? 'default' : 'outline'}
            className={
                isHigh
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : ''
            }
        >
            {pct}%
        </Badge>
    );
}

// ─── Superadmin View ─────────────────────────────────────────────────────────
function SuperadminTable({
    data,
    auditLogs = [],
}: {
    data: any[];
    auditLogs?: any[];
}) {
    return (
        <div className="space-y-6">
            <Card className="mx-4 lg:mx-6 border-none shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle>Tenant Terbaru</CardTitle>
                    <CardDescription>
                        Daftar tenant yang baru bergabung
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Mobile: card list */}
                    <div className="block md:hidden divide-y divide-gray-100">
                        {data.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">
                                Belum ada data tenant.
                            </p>
                        )}
                        {data.map((tenant) => (
                            <div
                                key={tenant.id}
                                className="px-4 py-3 flex flex-col gap-1"
                            >
                                <p className="font-semibold text-gray-800">
                                    {tenant.name}
                                </p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <span>{tenant.users_count} Pengguna</span>
                                    <span>
                                        {tenant.attendances_count} Absensi
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Bergabung{' '}
                                    {formatDateShort(tenant.created_at)}
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* Desktop: table */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Perusahaan</TableHead>
                                    <TableHead>Jumlah User</TableHead>
                                    <TableHead>Total Absensi</TableHead>
                                    <TableHead>Tanggal Join</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center text-gray-400 py-8"
                                        >
                                            Belum ada data tenant.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {data.map((tenant) => (
                                    <TableRow key={tenant.id}>
                                        <TableCell className="font-medium">
                                            {tenant.name}
                                        </TableCell>
                                        <TableCell>
                                            {tenant.users_count}
                                        </TableCell>
                                        <TableCell>
                                            {tenant.attendances_count}
                                        </TableCell>
                                        <TableCell>
                                            {formatDateShort(tenant.created_at)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="mx-4 lg:mx-6 border-none shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle>Audit Log Sistem</CardTitle>
                    <CardDescription>
                        Aktivitas sistem dan log audit global
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="block md:hidden divide-y divide-gray-100">
                        {auditLogs.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">
                                Belum ada log audit.
                            </p>
                        )}
                        {auditLogs.map((log) => (
                            <div
                                key={log.id}
                                className="px-4 py-3 flex flex-col gap-1"
                            >
                                <p className="font-semibold text-gray-800 text-sm">
                                    {log.action}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {log.description}
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-[10px] text-gray-400">
                                        By {log.user?.name || 'System'}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        {formatDate(log.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Aksi</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Pengguna</TableHead>
                                    <TableHead>Waktu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLogs.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center text-gray-400 py-8"
                                        >
                                            Belum ada log audit.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {auditLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium text-sm">
                                            {log.action}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                                            {log.description}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {log.user?.name || 'System'}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {formatDate(log.created_at)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ─── Owner / Karyawan Attendance View ────────────────────────────────────────
function AttendanceTable({
    role,
    data,
}: {
    role: 'owner' | 'karyawan';
    data: any[];
}) {
    const title = role === 'owner' ? 'Absensi Terbaru' : 'Riwayat Absensi Anda';
    const description =
        role === 'owner'
            ? '10 log absensi terakhir dari seluruh karyawan'
            : '5 absensi terakhir Anda';

    return (
        <Card className="mx-4 lg:mx-6 border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {/* Mobile: card list */}
                <div className="block md:hidden divide-y divide-gray-100">
                    {data.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">
                            Belum ada data absensi.
                        </p>
                    )}
                    {data.map((att) => (
                        <div
                            key={att.id}
                            className="px-4 py-3 flex items-start justify-between gap-3"
                        >
                            <div className="flex flex-col gap-0.5 min-w-0">
                                {role === 'owner' && (
                                    <p className="font-semibold text-gray-800 truncate">
                                        {att.user?.name}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600 capitalize">
                                    {att.type}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {formatDate(att.created_at)}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <ConfidenceBadge confidence={att.confidence} />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Desktop: table */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {role === 'owner' && (
                                    <TableHead>Karyawan</TableHead>
                                )}
                                <TableHead>Tipe</TableHead>
                                <TableHead>Waktu</TableHead>
                                <TableHead>Confidence</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={role === 'owner' ? 5 : 4}
                                        className="text-center text-gray-400 py-8"
                                    >
                                        Belum ada data absensi.
                                    </TableCell>
                                </TableRow>
                            )}
                            {data.map((att) => (
                                <TableRow key={att.id}>
                                    {role === 'owner' && (
                                        <TableCell className="font-medium">
                                            {att.user?.name}
                                        </TableCell>
                                    )}
                                    <TableCell className="capitalize">
                                        {att.type}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(att.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <ConfidenceBadge
                                            confidence={att.confidence}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                (att.confidence as number) > 0.7
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={
                                                (att.confidence as number) > 0.7
                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                    : ''
                                            }
                                        >
                                            {(att.confidence as number) > 0.7
                                                ? 'Verified'
                                                : 'Low Confidence'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function RecentActivity({ role, data, auditLogs }: Props) {
    if (role === 'superadmin') {
        return <SuperadminTable data={data} auditLogs={auditLogs} />;
    }
    return <AttendanceTable role={role} data={data} />;
}

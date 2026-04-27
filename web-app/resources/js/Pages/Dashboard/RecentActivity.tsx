import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

interface Props {
    role: 'superadmin' | 'owner' | 'karyawan';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
}

export default function RecentActivity({ role, data }: Props) {
    if (role === 'superadmin') {
        return (
            <Card className="mx-4 lg:mx-6 border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Tenant Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
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
                            {data.map((tenant) => (
                                <TableRow key={tenant.id}>
                                    <TableCell className="font-medium">
                                        {tenant.name}
                                    </TableCell>
                                    <TableCell>{tenant.users_count}</TableCell>
                                    <TableCell>
                                        {tenant.attendances_count}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            tenant.created_at,
                                        ).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mx-4 lg:mx-6 border-none shadow-sm">
            <CardHeader>
                <CardTitle>
                    {role === 'owner'
                        ? 'Absensi Terbaru'
                        : 'Riwayat Absensi Anda'}
                </CardTitle>
            </CardHeader>
            <CardContent>
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
                                <TableCell>
                                    {new Date(att.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {att.confidence
                                        ? (att.confidence * 100).toFixed(1) +
                                          '%'
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            (att.confidence as number) > 0.7
                                                ? 'success'
                                                : 'outline'
                                        }
                                    >
                                        Verified
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

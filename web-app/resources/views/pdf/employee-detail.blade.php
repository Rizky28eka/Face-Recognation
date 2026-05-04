<!DOCTYPE html>
<html>
<head>
    <title>Detail Karyawan - {{ $employee->name }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 40px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #1e293b;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0;
            color: #64748b;
            font-size: 14px;
        }
        .profile-section {
            margin-bottom: 30px;
            display: flex;
        }
        .profile-photo {
            width: 150px;
            height: 150px;
            border-radius: 20px;
            border: 4px solid #f1f5f9;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .info-table th, .info-table td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #f1f5f9;
        }
        .info-table th {
            width: 30%;
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .info-table td {
            color: #1e293b;
            font-weight: bold;
            font-size: 14px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 15px;
            border-left: 4px solid #6366f1;
            padding-left: 10px;
        }
        .attendance-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .attendance-table th {
            background-color: #f8fafc;
            color: #64748b;
            font-size: 10px;
            text-transform: uppercase;
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        .attendance-table td {
            padding: 10px;
            font-size: 12px;
            border-bottom: 1px solid #f1f5f9;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            display: inline-block;
        }
        .status-on-time { background-color: #f0fdf4; color: #166534; }
        .status-late { background-color: #fef2f2; color: #991b1b; }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>LAPORAN PROFIL KARYAWAN</h1>
            <p>{{ $tenant->name }} • Dicetak pada {{ date('d F Y H:i') }}</p>
        </div>

        <div style="width: 100%;">
            <div style="float: left; width: 25%;">
                @if($employee->face_path)
                    <img src="{{ public_path('storage/' . $employee->face_path) }}" class="profile-photo">
                @else
                    <div style="width: 150px; height: 150px; background: #f1f5f9; border-radius: 20px; text-align: center; line-height: 150px; color: #94a3b8; font-size: 40px; font-weight: bold;">
                        {{ substr($employee->name, 0, 1) }}
                    </div>
                @endif
            </div>
            <div style="float: right; width: 70%;">
                <div class="section-title">Informasi Personal</div>
                <table class="info-table">
                    <tr>
                        <th>Nama Lengkap</th>
                        <td>{{ $employee->name }}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{{ $employee->email }}</td>
                    </tr>
                    <tr>
                        <th>ID Karyawan</th>
                        <td>#{{ str_pad($employee->id, 5, '0', STR_PAD_LEFT) }}</td>
                    </tr>
                    <tr>
                        <th>Cabang</th>
                        <td>{{ $employee->branch->name ?? '-' }}</td>
                    </tr>
                    <tr>
                        <th>Shift</th>
                        <td>{{ $employee->shift->name ?? '-' }} ({{ strtoupper($employee->shift->work_type ?? '-') }})</td>
                    </tr>
                </table>
            </div>
            <div style="clear: both;"></div>
        </div>

        <div style="margin-top: 40px;">
            <div class="section-title">Riwayat Kehadiran Terakhir (20 Sesi)</div>
            <table class="attendance-table">
                <thead>
                    <tr>
                        <th>Tanggal & Waktu</th>
                        <th>Tipe</th>
                        <th>Mode</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($attendances as $attn)
                        <tr>
                            <td>{{ \Carbon\Carbon::parse($attn->attended_at)->translatedFormat('l, d F Y H:i') }}</td>
                            <td>{{ $attn->type === 'check_in' ? 'Masuk' : 'Pulang' }}</td>
                            <td>{{ strtoupper($attn->work_type) }}</td>
                            <td>
                                <span class="status-badge {{ $attn->late_minutes > 0 ? 'status-late' : 'status-on-time' }}">
                                    {{ $attn->late_minutes > 0 ? 'TERLAMBAT' : 'TEPAT WAKTU' }}
                                </span>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" style="text-align: center; color: #94a3b8;">Belum ada riwayat kehadiran.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="footer">
            Dokumen ini dihasilkan secara otomatis oleh sistem FaceLog {{ date('Y') }}.
        </div>
    </div>
</body>
</html>

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToTenant;

class Attendance extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'branch_id',
        'type',
        'work_type',
        'confidence',
        'image_path',
        'latitude',
        'longitude',
        'ip_address',
        'network_info',
        'attended_at',
        'late_minutes',
        'overtime_minutes',
        'bbox',
    ];

    protected $casts = [
        'bbox' => 'array',
        'attended_at' => 'datetime',
    ];

    /**
     * Relasi ke User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Cabang.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}

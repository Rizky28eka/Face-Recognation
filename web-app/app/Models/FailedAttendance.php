<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FailedAttendance extends Model
{
    protected $fillable = [
        'user_id', 'branch_id', 'reason', 'reason_message',
        'confidence', 'image_path', 'latitude', 'longitude',
        'ip_address', 'attempted_at',
    ];

    protected $casts = [
        'attempted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}

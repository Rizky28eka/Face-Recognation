<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfficeSetting extends Model
{
    protected $fillable = [
        'tenant_id',
        'latitude',
        'longitude',
        'radius',
        'check_in_time',
        'check_out_time',
        'is_active'
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}

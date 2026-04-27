<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToTenant;

class Branch extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'latitude',
        'longitude',
        'radius',
        'check_in_time',
        'check_out_time',
        'is_active',
    ];

    /**
     * Relasi ke Users.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}

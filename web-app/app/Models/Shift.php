<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'start_time',
        'end_time',
        'color',
        'work_type',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}

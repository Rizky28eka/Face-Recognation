<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $fillable = ['name', 'slug', 'address', 'registration_token'];

    public function getInviteUrl(): string
    {
        if (!$this->registration_token) {
            $this->registration_token = \Illuminate\Support\Str::random(32);
            $this->save();
        }
        
        return url('/join/' . $this->registration_token);
    }

    /**
     * Relasi ke semua User di Tenant ini.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Relasi ke semua Absensi di Tenant ini.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Relasi ke Cabang-cabang Kantor.
     */
    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    /**
     * Relasi ke semua Shift.
     */
    public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class);
    }

    /**
     * Relasi ke semua pengajuan Cuti.
     */
    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class);
    }
}

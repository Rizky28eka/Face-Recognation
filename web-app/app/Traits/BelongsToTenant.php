<?php

namespace App\Traits;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToTenant
{
    /**
     * Guard against infinite recursion when retrieving authenticated user.
     */
    protected static bool $applyingTenantScope = false;

    protected static function bootBelongsToTenant()
    {
        static::creating(function ($model) {
            if (Auth::check() && Auth::user()->tenant_id) {
                $model->tenant_id = Auth::user()->tenant_id;
            }
        });

        static::addGlobalScope('tenant', function (Builder $builder) {
            if (app()->runningInConsole()) {
                return;
            }

            // If we are already in the middle of applying the scope (which calls Auth::user()),
            // stop here to prevent infinite recursion.
            if (static::$applyingTenantScope) {
                return;
            }

            static::$applyingTenantScope = true;

            try {
                if (Auth::check() && Auth::user()->tenant_id) {
                    $builder->where($builder->getModel()->getTable() . '.tenant_id', Auth::user()->tenant_id);
                }
            } finally {
                static::$applyingTenantScope = false;
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}

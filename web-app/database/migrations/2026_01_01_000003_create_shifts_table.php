<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('color', 7)->default('#4f46e5');
            $table->string('work_type')->default('wfo');
            $table->timestamps();
        });

        DB::statement("ALTER TABLE shifts ADD CONSTRAINT shifts_work_type_check CHECK (work_type IN ('wfo', 'wfh', 'hybrid'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};

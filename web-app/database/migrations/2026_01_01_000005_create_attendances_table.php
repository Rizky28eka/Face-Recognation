<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            $table->string('type');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('network_info')->nullable();
            $table->string('work_type')->default('wfo');
            $table->integer('late_minutes')->default(0);
            $table->integer('overtime_minutes')->default(0);
            $table->float('confidence')->nullable();
            $table->float('accuracy')->nullable();
            $table->float('f1_score')->nullable();
            $table->float('precision')->nullable();
            $table->float('recall')->nullable();
            $table->json('bbox')->nullable();
            $table->string('image_path')->nullable();
            $table->string('raw_image_path')->nullable();
            $table->timestamp('attended_at')->useCurrent();
            $table->timestamps();
        });

        DB::statement("ALTER TABLE attendances ADD CONSTRAINT attendances_type_check CHECK (type IN ('check-in', 'check-out'))");
        DB::statement("ALTER TABLE attendances ADD CONSTRAINT attendances_work_type_check CHECK (work_type IN ('wfo', 'wfh', 'dinas_luar'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};

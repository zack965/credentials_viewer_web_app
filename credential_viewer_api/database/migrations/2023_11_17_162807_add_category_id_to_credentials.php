<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('credentials', function (Blueprint $table) {
            //
            $table->unsignedBigInteger("categorie_id");
            $table->foreign("categorie_id")->references("categorie_id")->on("categories");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('credentials', function (Blueprint $table) {
            //
            $table->dropColumn("categorie_id");
        });
    }
};

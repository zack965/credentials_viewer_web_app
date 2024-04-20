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
        Schema::create('nested_categories', function (Blueprint $table) {
            $table->id("nested_categorie_id");
            $table->unsignedBigInteger('parent_category_id');
            $table->unsignedBigInteger('child_category_id');
            $table->foreign('parent_category_id')->references('categorie_id')->on('categories')->onDelete('cascade');
            $table->foreign('child_category_id')->references('categorie_id')->on('categories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nested_categories');
    }
};

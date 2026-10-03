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
        Schema::table('ingredients', function (Blueprint $table) {
            $table->dropForeign(['ingredient_category_id']);

            $table->foreign('ingredient_category_id')
                ->references('id')
                ->on('ingredient_categories')
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ingredients', function (Blueprint $table) {
            $table->dropForeign(['ingredient_category_id']);

            $table->foreign('ingredient_category_id')
                ->references('id')
                ->on('ingredient_categories')
                ->cascadeOnDelete();
        });
    }
};

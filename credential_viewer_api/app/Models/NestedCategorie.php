<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NestedCategorie extends Model
{
    use HasFactory;
    protected $primaryKey="categorie_id";
    public function childCategories(){
        return $this->hasMany(Category::class,"categorie_id");
    }
}

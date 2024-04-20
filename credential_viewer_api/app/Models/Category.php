<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $primaryKey="categorie_id";
    protected $fillable=["categorie_name","categorie_description","user_id"];
    public function parentCategories()
    {
        return $this->belongsToMany(Category::class, 'nested_categories', 'child_category_id', 'parent_category_id');
    }

    public function childCategories()
    {
        return $this->belongsToMany(Category::class, 'nested_categories', 'parent_category_id', 'child_category_id')->distinct();
    }
    public function cridentials(){
        return $this->hasMany(Credential::class,"categorie_id");
    }
    public function nestedCategories()
    {
        return $this->hasMany(NestedCategorie::class, 'parent_category_id', 'categorie_id');
    }
}

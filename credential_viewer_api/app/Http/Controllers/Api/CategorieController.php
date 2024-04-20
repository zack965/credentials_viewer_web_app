<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CategorieController extends Controller
{
    //
    public function getData():JsonResponse
    {
         $categories = Category::with(["parentCategories","cridentials"])->where("user_id",Auth::id())
         ->get();
        return response()->json($categories);
    }
    public function createCategory(CreateCategoryRequest $createCategoryRequest){
        $category = Category::create([
            "categorie_name"=>$createCategoryRequest->categorie_name,
            "categorie_description"=>$createCategoryRequest->categorie_description,
            "user_id"=>Auth::id()
        ]);
        return response()->json($category,200);
    }
    public function deleteCategory($category_id){
        $category = Category::find($category_id);
        if(!$category){
            return response()->json(null,404);
        }
        $category->cridentials->each->delete();
        $category->delete();
        return response()->json(null,200);
    }
}

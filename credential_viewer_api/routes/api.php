<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\CredentialsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/* Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); */

// auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// app routes
Route::middleware(["auth:sanctum"])->group(function () {
    // category routes
    Route::get("/credential/credential_list", [CategorieController::class, "getData"]);
    Route::post("/credential/create_category", [CategorieController::class, "createCategory"]);
    Route::delete("/credential/delete_category/{category_id}", [CategorieController::class, "deleteCategory"]);
    // credentials routes
    Route::get("/credential/get_decryptes_values/{credential_id}", [CredentialsController::class, "getDecryptesValues"]);
    Route::post("/credential/create_credential", [CredentialsController::class, "creadeCredential"]);
    Route::post("/credential/create_credential_as_file", [CredentialsController::class, "creeateCredentialAsFile"]);
    Route::delete("/credential/delete_credential/{credential_id}", [CredentialsController::class, "deleteCredential"]);
});

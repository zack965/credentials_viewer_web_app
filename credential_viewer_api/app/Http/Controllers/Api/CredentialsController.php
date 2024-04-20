<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Credentials\CreateCredentialRequestFile;
use App\Http\Requests\Credentials\CreateCredentials;
use App\Models\Credential;
use App\Services\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;

class CredentialsController extends Controller
{
    //
    public function creadeCredential(CreateCredentials $createCredentials): JsonResponse
    {
        $credential = Credential::create([
            "credential_key" => $createCredentials->credential_key,
            "credential_value" => Crypt::encrypt($createCredentials->credential_value),
            "categorie_id" => $createCredentials->categorie_id,
            "credential_type" => "text"
        ]);
        return response()->json($credential);
    }
    public function deleteCredential($credential_id)
    {
        $credential = Credential::find($credential_id);
        if (!$credential) {
            return response()->json(null, 404);
        }
        $credential->delete();
        return response()->json(null, 200);
    }
    public function getDecryptesValues(int $credential_id)
    {
        $credential = Credential::find($credential_id);
        if (!$credential) {
            return response()->json(null, 404);
        }
        return response()->json(["data" => Crypt::decrypt($credential->credential_value)]);
    }
    public function creeateCredentialAsFile(CreateCredentialRequestFile $createCredentialRequestFile)
    {
        $credential_value_file = null;
        if ($createCredentialRequestFile->hasFile("credential_value_file")) {
            $credential_value_file = FileService::StoreFileToStoragePath($createCredentialRequestFile, "credential_value_file", "credential_value_file");
        }
        $credential = Credential::create([
            "credential_key" => $createCredentialRequestFile->credential_key,
            "credential_value" => $credential_value_file,
            "categorie_id" => $createCredentialRequestFile->categorie_id,
            "credential_type" => "file"
        ]);
        return response()->json($credential);
    }
    public function GetFileFromStoragePath(Request $request)
    {
        $request->validate([
            "file_path" => "required"
        ]);
        return FileService::GetFileFromStoragePath($request->file_path);
    }
}

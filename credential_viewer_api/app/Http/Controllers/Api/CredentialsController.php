<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Credentials\CreateCredentials;
use App\Models\Credential;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Crypt;

class CredentialsController extends Controller
{
    //
    public function creadeCredential(CreateCredentials $createCredentials):JsonResponse
    {
        $credential = Credential::create([
            "credential_key" => $createCredentials->credential_key,
            "credential_value" =>Crypt::encrypt( $createCredentials->credential_value),
            "categorie_id" => $createCredentials->categorie_id,
        ]);
        return response()->json($credential);
    }
    public function deleteCredential($credential_id){
        $credential = Credential::find($credential_id);
        if(!$credential){
            return response()->json(null,404);
        }
        $credential->delete();
        return response()->json(null,200);
    }
    public function getDecryptesValues(int $credential_id){
        $credential = Credential::find($credential_id);
        if(!$credential){
            return response()->json(null,404);
        }
        return response()->json(["data"=>Crypt::decrypt($credential->credential_value)]);
    }
}

<?php

namespace App\Services;

use Illuminate\Http\Request;

class FileService
{
    public static function StoreFileToPublicPath(Request $request, $directory, $request_key)
    {
        $file = $request->file($request_key);
        $fileName = uniqid() . $file->getClientOriginalName();
        $destinationPath = public_path() . '/' . $directory;
        $file->move($destinationPath, $fileName);
        $fullpath = $directory . '/' . $fileName;
        return env("APP_URL") . "/" . $fullpath;
    }
}

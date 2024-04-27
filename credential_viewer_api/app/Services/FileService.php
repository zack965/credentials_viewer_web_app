<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class FileService
{
    public static function StoreFileToStoragePath(Request $request, $directory, $request_key)
    {
        $file = $request->file($request_key);
        $fileName = uniqid() . $file->getClientOriginalName();
        $destinationPath = storage_path() . '/' . $directory;
        $file->move($destinationPath, $fileName);
        $fullpath = $directory . '/' . $fileName;
        return $fullpath;
    }
    public static function GetFileFromStoragePath(string $file_path): JsonResponse|BinaryFileResponse
    {
        $filePath = storage_path($file_path);
        if (!file_exists($filePath)) {
            return response()->json(["ddd" => ",kkkk"], 422);
        }
        return response()->download($filePath);
    }
}

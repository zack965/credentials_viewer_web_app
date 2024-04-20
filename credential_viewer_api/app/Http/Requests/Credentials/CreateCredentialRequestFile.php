<?php

namespace App\Http\Requests\Credentials;

use Illuminate\Foundation\Http\FormRequest;

class CreateCredentialRequestFile extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "credential_key" => "required|string",
            'credential_value_file' => 'required|file|mimes:*',
            "categorie_id" => "required|numeric",
        ];
    }
}

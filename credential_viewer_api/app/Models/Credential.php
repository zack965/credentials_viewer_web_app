<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Credential extends Model
{
    use HasFactory;
    protected $primaryKey="credential_id";
    protected $fillable=["credential_key","credential_value","categorie_id"];
}

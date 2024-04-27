<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CredentialsControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_can_save_credential_as_text_with_existing_categorie_and_valid_data(): void
    {
        $user = User::factory()->create([
            "name" => "name",
            'email' => 'test@example.com',
            'password' => Hash::make("password"),
        ]);
        Sanctum::actingAs(
            $user,
            ['*']
        );
        // Create categories for the authenticated user
        $categories = Category::factory()->create([
            'user_id' => $user->id,
        ]);
        $response = $this->postJson('/api/credential/create_credential', [
            "credential_key" => "credential_key",
            "credential_value" => "credential_value",
            "categorie_id" => $categories->categorie_id,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'credential_key',
            "credential_value",
            "categorie_id",
            "credential_type",
            "created_at",
            "updated_at",
            "credential_id"
        ]);
    }
    public function test_can_save_credential_as_text_with_not_existing_categorie_and_valid_data(): void
    {
        $user = User::factory()->create([
            "name" => "name",
            'email' => 'test@example.com',
            'password' => Hash::make("password"),
        ]);
        Sanctum::actingAs(
            $user,
            ['*']
        );

        $response = $this->postJson('/api/credential/create_credential', [
            "credential_key" => "credential_key",
            "credential_value" => "credential_value",
            "categorie_id" => 1,
        ]);

        $response->assertStatus(404);
        $response->assertJsonStructure([
            'msg'
        ]);
        $response->assertJson([
            'msg' => 'categorie not found',
        ]);
    }
    public function test_can_save_credential_as_text_with_not_existing_categorie_and_invalid_data(): void
    {
        $user = User::factory()->create([
            "name" => "name",
            'email' => 'test@example.com',
            'password' => Hash::make("password"),
        ]);
        Sanctum::actingAs(
            $user,
            ['*']
        );

        $response = $this->postJson('/api/credential/create_credential', [
            "credential_key" => "",
            "credential_value" => "",
            "categorie_id" => 1,
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'message' => 'The credential key field is required. (and 1 more error)',
            'errors' => [
                'credential_key' => [
                    'The credential key field is required.',
                ],
                'credential_value' => [
                    'The credential value field is required.',
                ],
            ],
        ]);
        // Assert that the response contains the expected keys
        $response->assertJsonStructure([
            'message',
            'errors' => [
                'credential_key',
                'credential_value',
            ],
        ]);
    }
}

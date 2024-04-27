<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_register_with_already_existing_email(): void
    {
        $user = User::factory()->create([
            "name" => "name",
            'email' => 'test@example.com',
            'password' => Hash::make("password"),
        ]);
        $response = $this->postJson('/api/register', [
            'email' => 'test@example.com',
            'password' => 'password',
            "name" => "name"
        ]);
        $response->assertStatus(422);
        // Assert that the response contains the expected keys
        $response->assertJsonStructure([
            'message',
            'errors' => [
                'email',
            ],
        ]);
        // Optionally, assert specific data in the response
        $response->assertJson([
            'message' => 'The email has already been taken.',
            'errors' => [
                'email' => [
                    'The email has already been taken.',
                ],
            ],
        ]);
    }
    public function test_register_success(): void
    {
        /* $user = User::factory()->create([
            "name" => "name",
            'email' => 'test@example.com',
            'password' => Hash::make("password"),
        ]); */
        $response = $this->postJson('/api/register', [
            'email' => 'test@example.com',
            'password' => 'password',
            "name" => "name"
        ]);
        $response->assertStatus(200);
        // Assert that the response contains the expected keys
        $response->assertJsonStructure([
            'access_token',
            'user' => [
                'id',
                'name',
                'email',
                // Add other fields if necessary
            ],
        ]);
        // Optionally, assert specific data in the response
        $response->assertJson([
            'user' => [
                'email' => 'test@example.com',
                // Add other assertions if necessary
            ],
        ]);
    }
    public function test_login_success(): void
    {
        // create the user
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make("password"),
        ]);
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);
        $response->assertStatus(200);
        // Assert that the response contains the expected keys
        $response->assertJsonStructure([
            'access_token',
            'user' => [
                'id',
                'name',
                'email',
                // Add other fields if necessary
            ],
        ]);
        // Optionally, assert specific data in the response
        $response->assertJson([
            'user' => [
                'email' => 'test@example.com',
                // Add other assertions if necessary
            ],
        ]);
    }

    public function test_login_invalid_credentials()
    {
        // Make a request to the login endpoint with invalid credentials
        $response = $this->postJson('/api/login', [
            'email' => 'invalid@example.com',
            'password' => 'invalidpassword',
        ]);

        // Assert that the response indicates invalid credentials
        $response->assertStatus(401);
        $response->assertJson([
            'message' => 'Invalid login details',
        ]);
    }
}

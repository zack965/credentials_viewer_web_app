<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Credential;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategorieControllerTest extends TestCase
{
    use RefreshDatabase;


    /**
     * A basic feature test example.
     */
    public function test_can_save_categorie_with_valid_data(): void
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
        $response = $this->postJson('/api/credential/create_category', [
            "categorie_name" => "categorie_name",
            "categorie_description" => "categorie_description",
        ]);

        $response->assertStatus(200);

        $response->assertJsonStructure([
            'categorie_name',
            "categorie_description",
            "user_id",
            "updated_at",
            "created_at",
            "categorie_id"
        ]);
        // Optionally, assert specific data in the response
        $response->assertJson([
            'categorie_name' => "categorie_name",
            "categorie_description" => "categorie_description",
            "user_id" => $user->id,
            "categorie_id" => 1
        ]);
    }
    public function test_can_save_categorie_with_in_valid_data(): void
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
        $response = $this->postJson('/api/credential/create_category', [
            "categorie_name_invalid" => "categorie_name",
            "categorie_description_invalid" => "categorie_description",
        ]);

        $response->assertStatus(422);

        $response->assertJsonStructure([
            'message',
            'errors' => [
                'categorie_name',
                'categorie_description',
            ],
        ]);
        $response->assertJson([
            'message' => 'The categorie name field is required. (and 1 more error)',
            'errors' => [
                'categorie_name' => [
                    "The categorie name field is required."
                ],
                'categorie_description' => [
                    "The categorie description field is required."
                ],
            ],
        ]);
    }
    public function test_delete_category_success(): void
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
        // Create a category
        $category = Category::factory()->create([
            "user_id" => $user->id
        ]);
        // Create associated credentials
        Credential::factory()->count(3)->create([
            'categorie_id' => $category->categorie_id,
        ]);
        $response = $this->deleteJson("/api/credential/delete_category/{$category->categorie_id}");

        // Assert that the response indicates success
        $response->assertStatus(200);

        $this->assertCount(0, Credential::where('categorie_id', $category->categorie_id)->get());
    }
    public function test_get_data(): void
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
        $categories = Category::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);
        // Create credentials for some of the categories
        Credential::factory()->count(2)->create([
            'categorie_id' => $categories[0]->categorie_id,
        ]);
        // Make a request to get data
        $response = $this->getJson('/api/credential/credential_list');
        // Assert the JSON response structure
        $response->assertJsonStructure([
            '*' => [
                'categorie_id',
                'categorie_name',
                'categorie_description',
                'created_at',
                'updated_at',
                'user_id',
                'cridentials',
            ],
        ]);
    }
}

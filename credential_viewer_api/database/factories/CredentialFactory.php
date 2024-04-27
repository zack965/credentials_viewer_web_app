<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Credential>
 */
class CredentialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'credential_value' => $this->faker->word,
            'credential_key' => $this->faker->sentence,
            'categorie_id' => Category::factory(),
            "credential_type" => $this->faker->word,
        ];
    }
}

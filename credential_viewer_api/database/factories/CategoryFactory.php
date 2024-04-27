<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'categorie_name' => $this->faker->word,
            'categorie_description' => $this->faker->sentence,
            'user_id' => \App\Models\User::factory(), // If user_id is related to a User model
        ];
    }
}

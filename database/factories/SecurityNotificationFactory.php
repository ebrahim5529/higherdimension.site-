<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SecurityNotification>
 */
class SecurityNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['new_device', 'two_factor_enabled', 'login_attempt']),
            'title' => fake()->sentence(),
            'message' => fake()->paragraph(),
            'device_info' => [
                'device_name' => fake()->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
            ],
            'ip_address' => fake()->ipv4(),
            'read_at' => null,
        ];
    }

    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'read_at' => now(),
        ]);
    }

    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'read_at' => null,
        ]);
    }
}

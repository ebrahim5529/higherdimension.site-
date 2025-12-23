<?php

namespace Database\Factories;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contract>
 */
class ContractFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Contract::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $contractNumber = 'CONT-' . str_pad((string) fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT);
        $startDate = fake()->dateTimeBetween('-1 year', '+1 month');
        $endDate = fake()->dateTimeBetween($startDate, '+6 months');

        return [
            'contract_number' => $contractNumber,
            'title' => 'عقد تأجير - ' . $contractNumber,
            'description' => fake()->optional()->text(),
            'amount' => fake()->randomFloat(2, 100, 10000),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => fake()->randomElement(['ACTIVE', 'EXPIRED', 'CANCELLED', 'COMPLETED']),
            'payment_type' => fake()->randomElement(['CASH', 'INSTALLMENT', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
            'installment_count' => fake()->optional()->numberBetween(1, 12),
            'delivery_address' => fake()->address(),
            'location_map_link' => fake()->optional()->url(),
            'transport_and_installation_cost' => fake()->randomFloat(2, 0, 500),
            'total_discount' => fake()->randomFloat(2, 0, 200),
            'contract_notes' => fake()->optional()->text(),
            'customer_id' => Customer::factory(),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the contract is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ACTIVE',
        ]);
    }

    /**
     * Indicate that the contract is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'EXPIRED',
            'end_date' => fake()->dateTimeBetween('-1 year', '-1 day'),
        ]);
    }

    /**
     * Indicate that the contract is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'CANCELLED',
        ]);
    }
}

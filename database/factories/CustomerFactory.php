<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Customer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $customerNumber = 'CUST-' . str_pad((string) fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT);

        return [
            'customer_number' => $customerNumber,
            'name' => fake('ar_SA')->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => '+968' . fake()->numerify('#######'),
            'address' => fake('ar_SA')->address(),
            'nationality' => fake()->randomElement(['عماني', 'إماراتي', 'سعودي', 'كويتي']),
            'customer_type' => fake()->randomElement(['INDIVIDUAL', 'COMPANY']),
            'id_number' => fake()->numerify('##########'),
            'commercial_record' => fake()->optional()->regexify('CR-[0-9]{6}'),
            'status' => fake()->randomElement(['ACTIVE', 'INACTIVE']),
            'registration_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'guarantor_name' => fake()->optional()->name(),
            'guarantor_phone' => fake()->optional()->numerify('+968#######'),
            'guarantor_id' => fake()->optional()->numerify('##########'),
            'notes' => fake()->optional()->text(),
            'warnings' => fake()->optional()->text(),
            'rating' => fake()->optional()->numberBetween(1, 5),
            'phones' => null,
        ];
    }

    /**
     * Indicate that the customer is an individual.
     */
    public function individual(): static
    {
        return $this->state(fn (array $attributes) => [
            'customer_type' => 'INDIVIDUAL',
            'commercial_record' => null,
        ]);
    }

    /**
     * Indicate that the customer is a company.
     */
    public function company(): static
    {
        return $this->state(fn (array $attributes) => [
            'customer_type' => 'COMPANY',
            'commercial_record' => 'CR-' . fake()->numerify('######'),
            'id_number' => null,
        ]);
    }

    /**
     * Indicate that the customer is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ACTIVE',
        ]);
    }

    /**
     * Indicate that the customer is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'INACTIVE',
        ]);
    }
}

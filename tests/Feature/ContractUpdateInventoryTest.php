<?php

namespace Tests\Feature;

use App\Models\Contract;
use App\Models\ContractEquipment;
use App\Models\Customer;
use App\Models\Scaffold;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractUpdateInventoryTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_closing_contract_returns_equipment_to_inventory(): void
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create();
        $scaffold = Scaffold::create([
            'scaffold_number' => 'SC-TEST-001',
            'quantity' => 100,
            'available_quantity' => 100,
            'daily_rental_price' => 10,
            'monthly_rental_price' => 200,
            'description_ar' => 'وصف',
            'description_en' => 'desc',
        ]);

        $contract = Contract::factory()->active()->create([
            'customer_id' => $customer->id,
            'user_id' => $this->user->id,
            'delivery_address' => 'مسقط',
        ]);

        $rentedQty = 25;
        $scaffold->update(['available_quantity' => 100 - $rentedQty]);

        ContractEquipment::create([
            'contract_id' => $contract->id,
            'scaffold_id' => $scaffold->id,
            'item_code' => 'SC-TEST-001',
            'item_description' => 'وصف',
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addMonth()->format('Y-m-d'),
            'duration' => 1,
            'duration_type' => 'monthly',
            'quantity' => $rentedQty,
            'daily_rate' => 10,
            'monthly_rate' => 200,
            'total' => 200,
        ]);

        $payload = $this->buildUpdatePayload($contract, $customer, $scaffold, $rentedQty, 'CLOSED');

        $response = $this->put(route('contracts.update', $contract->id), $payload);

        $response->assertRedirect();
        $scaffold->refresh();

        $this->assertEquals(100, $scaffold->available_quantity);
        $this->assertEquals('CLOSED', $contract->fresh()->status);
    }

    public function test_editing_closed_contract_does_not_double_release_inventory(): void
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create();
        $scaffold = Scaffold::create([
            'scaffold_number' => 'SC-TEST-002',
            'quantity' => 50,
            'available_quantity' => 50,
            'daily_rental_price' => 5,
            'monthly_rental_price' => 100,
            'description_ar' => 'وصف',
            'description_en' => 'desc',
        ]);

        $contract = Contract::factory()->create([
            'customer_id' => $customer->id,
            'user_id' => $this->user->id,
            'status' => 'CLOSED',
            'delivery_address' => 'مسقط',
        ]);

        $qty = 10;
        ContractEquipment::create([
            'contract_id' => $contract->id,
            'scaffold_id' => $scaffold->id,
            'item_code' => 'SC-TEST-002',
            'item_description' => 'وصف',
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addMonth()->format('Y-m-d'),
            'duration' => 1,
            'duration_type' => 'monthly',
            'quantity' => $qty,
            'daily_rate' => 5,
            'monthly_rate' => 100,
            'total' => 100,
        ]);

        $payload = $this->buildUpdatePayload($contract, $customer, $scaffold, $qty, 'CLOSED');
        $payload['contract_notes'] = 'ملاحظة محدثة';

        $this->put(route('contracts.update', $contract->id), $payload);

        $scaffold->refresh();
        $this->assertEquals(50, $scaffold->available_quantity);
    }

    /**
     * @return array<string, mixed>
     */
    private function buildUpdatePayload(
        Contract $contract,
        Customer $customer,
        Scaffold $scaffold,
        int $quantity,
        string $status,
    ): array {
        return [
            'contract_number' => $contract->contract_number,
            'contract_date' => $contract->start_date->format('Y-m-d'),
            'customer_id' => $customer->id,
            'delivery_address' => $contract->delivery_address,
            'transport_and_installation_cost' => 0,
            'total_discount' => 0,
            'status' => $status,
            'rental_details' => [
                [
                    'scaffold_id' => $scaffold->id,
                    'item_code' => $scaffold->scaffold_number,
                    'item_description' => 'وصف',
                    'start_date' => now()->format('Y-m-d'),
                    'end_date' => now()->addMonth()->format('Y-m-d'),
                    'duration' => 1,
                    'duration_type' => 'monthly',
                    'quantity' => $quantity,
                    'daily_rate' => 10,
                    'monthly_rate' => 200,
                    'discount' => 0,
                    'total' => 200,
                ],
            ],
        ];
    }
}

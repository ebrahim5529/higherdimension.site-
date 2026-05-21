<?php

namespace Tests\Feature;

use App\Models\Contract;
use App\Models\ContractEquipment;
use App\Models\Customer;
use App\Models\Scaffold;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryUpdateAvailableQuantityTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_updating_quantity_syncs_available_when_no_contracts(): void
    {
        $this->actingAs($this->user);

        $scaffold = Scaffold::create([
            'scaffold_number' => 'SC-UPD-001',
            'quantity' => 50,
            'available_quantity' => 45,
            'daily_rental_price' => 10,
            'monthly_rental_price' => 200,
            'description_ar' => 'وصف',
            'description_en' => 'desc',
        ]);

        $response = $this->put(route('inventory.update', $scaffold->id), [
            'scaffold_number' => $scaffold->scaffold_number,
            'quantity' => 30000,
            'description_ar' => 'وصف',
            'description_en' => 'desc',
            'daily_rental_price' => 10,
            'monthly_rental_price' => 200,
            'status' => 'AVAILABLE',
        ]);

        $response->assertRedirect(route('inventory.index'));

        $scaffold->refresh();
        $this->assertEquals(30000, $scaffold->quantity);
        $this->assertEquals(30000, $scaffold->available_quantity);
    }

    public function test_updating_quantity_preserves_reserved_amount_from_contracts(): void
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create();
        $scaffold = Scaffold::create([
            'scaffold_number' => 'SC-UPD-002',
            'quantity' => 100,
            'available_quantity' => 75,
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

        ContractEquipment::create([
            'contract_id' => $contract->id,
            'scaffold_id' => $scaffold->id,
            'quantity' => 25,
            'daily_rate' => 10,
            'monthly_rate' => 200,
            'total' => 1000,
        ]);

        $response = $this->put(route('inventory.update', $scaffold->id), [
            'scaffold_number' => $scaffold->scaffold_number,
            'quantity' => 30000,
            'description_ar' => 'وصف',
            'description_en' => 'desc',
            'daily_rental_price' => 10,
            'monthly_rental_price' => 200,
            'status' => 'AVAILABLE',
        ]);

        $response->assertRedirect(route('inventory.index'));

        $scaffold->refresh();
        $this->assertEquals(30000, $scaffold->quantity);
        $this->assertEquals(29975, $scaffold->available_quantity);
    }

    public function test_cannot_set_quantity_below_contract_reserved_total(): void
    {
        $this->actingAs($this->user);

        $customer = Customer::factory()->create();
        $scaffold = Scaffold::create([
            'scaffold_number' => 'SC-UPD-003',
            'quantity' => 100,
            'available_quantity' => 75,
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

        ContractEquipment::create([
            'contract_id' => $contract->id,
            'scaffold_id' => $scaffold->id,
            'quantity' => 25,
            'daily_rate' => 10,
            'monthly_rate' => 200,
            'total' => 1000,
        ]);

        $response = $this->put(route('inventory.update', $scaffold->id), [
            'scaffold_number' => $scaffold->scaffold_number,
            'quantity' => 10,
            'description_ar' => 'وصف',
            'description_en' => 'desc',
            'daily_rental_price' => 10,
            'monthly_rental_price' => 200,
            'status' => 'AVAILABLE',
        ]);

        $response->assertSessionHasErrors('quantity');

        $scaffold->refresh();
        $this->assertEquals(100, $scaffold->quantity);
        $this->assertEquals(75, $scaffold->available_quantity);
    }
}

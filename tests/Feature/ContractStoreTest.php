<?php

namespace Tests\Feature;

use App\Models\Contract;
use App\Models\ContractEquipment;
use App\Models\ContractPayment;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class ContractStoreTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // إنشاء مستخدم للاختبار
        $this->user = User::factory()->create();
    }

    /**
     * اختبار إنشاء عقد جديد بنجاح
     */
    public function test_can_create_contract_successfully(): void
    {
        // إنشاء عميل
        $customer = Customer::factory()->create();

        // تسجيل الدخول كمستخدم
        $this->actingAs($this->user);

        // بيانات العقد
        $contractData = [
            'contract_number' => 'CONT-001',
            'contract_date' => now()->format('Y-m-d'),
            'customer_id' => $customer->id,
            'delivery_address' => 'مسقط، سلطنة عمان',
            'location_map_link' => 'https://maps.google.com/test',
            'transport_and_installation_cost' => 100.50,
            'total_discount' => 50.00,
            'contract_notes' => 'ملاحظات العقد',
            'rental_details' => [
                [
                    'scaffold_id' => null,
                    'item_code' => 'ITEM-001',
                    'item_description' => 'سقالات معدنية',
                    'start_date' => now()->format('Y-m-d'),
                    'end_date' => now()->addMonths(3)->format('Y-m-d'),
                    'duration' => 3,
                    'duration_type' => 'monthly',
                    'quantity' => 10,
                    'daily_rate' => 5.00,
                    'monthly_rate' => 150.00,
                    'total' => 450.00,
                ],
                [
                    'scaffold_id' => null,
                    'item_code' => 'ITEM-002',
                    'item_description' => 'رافعات',
                    'start_date' => now()->format('Y-m-d'),
                    'end_date' => now()->addMonths(2)->format('Y-m-d'),
                    'duration' => 2,
                    'duration_type' => 'monthly',
                    'quantity' => 5,
                    'daily_rate' => 10.00,
                    'monthly_rate' => 300.00,
                    'total' => 600.00,
                ],
            ],
            'payments' => [
                [
                    'payment_method' => 'cash',
                    'payment_date' => now()->format('Y-m-d'),
                    'amount' => 500.00,
                ],
            ],
        ];

        // إرسال طلب إنشاء العقد
        $response = $this->post(route('contracts.store'), $contractData);

        // التحقق من أن الطلب تم بنجاح (redirect back)
        $response->assertRedirect();
        $response->assertSessionHas('success', 'تم إنشاء العقد بنجاح');

        // التحقق من وجود العقد في قاعدة البيانات
        $this->assertDatabaseHas('contracts', [
            'contract_number' => 'CONT-001',
            'customer_id' => $customer->id,
            'user_id' => $this->user->id,
            'delivery_address' => 'مسقط، سلطنة عمان',
            'transport_and_installation_cost' => 100.50,
            'total_discount' => 50.00,
            'status' => 'ACTIVE',
        ]);

        // الحصول على العقد من قاعدة البيانات
        $contract = Contract::where('contract_number', 'CONT-001')->first();
        $this->assertNotNull($contract);

        // التحقق من المبلغ الإجمالي (450 + 600 + 100.50 - 50.00 = 1100.50)
        $expectedAmount = 450.00 + 600.00 + 100.50 - 50.00;
        $this->assertEquals($expectedAmount, (float) $contract->amount);

        // التحقق من وجود معدات العقد
        $this->assertEquals(2, $contract->equipment()->count());
        $this->assertDatabaseHas('contract_equipment', [
            'contract_id' => $contract->id,
            'item_code' => 'ITEM-001',
            'quantity' => 10,
        ]);

        // التحقق من وجود المدفوعات
        $this->assertEquals(1, $contract->contractPayments()->count());
        $this->assertDatabaseHas('contract_payments', [
            'contract_id' => $contract->id,
            'payment_method' => 'cash',
            'amount' => 500.00,
        ]);
    }

    /**
     * اختبار التحقق من الحقول المطلوبة
     */
    public function test_validation_requires_contract_number(): void
    {
        $customer = Customer::factory()->create();
        $this->actingAs($this->user);

        $response = $this->post(route('contracts.store'), [
            'customer_id' => $customer->id,
            'delivery_address' => 'عنوان',
            'rental_details' => [],
        ]);

        $response->assertSessionHasErrors('contract_number');
    }

    /**
     * اختبار التحقق من رقم العقد الفريد
     */
    public function test_contract_number_must_be_unique(): void
    {
        $customer = Customer::factory()->create();
        $existingContract = Contract::factory()->create([
            'contract_number' => 'CONT-EXISTING',
            'customer_id' => $customer->id,
            'user_id' => $this->user->id,
        ]);

        $this->actingAs($this->user);

        $response = $this->post(route('contracts.store'), [
            'contract_number' => 'CONT-EXISTING',
            'contract_date' => now()->format('Y-m-d'),
            'customer_id' => $customer->id,
            'delivery_address' => 'عنوان',
            'rental_details' => [
                [
                    'item_code' => 'ITEM-001',
                    'item_description' => 'وصف',
                    'start_date' => now()->format('Y-m-d'),
                    'end_date' => now()->addMonths(1)->format('Y-m-d'),
                    'duration' => 1,
                    'duration_type' => 'monthly',
                    'quantity' => 1,
                    'daily_rate' => 10,
                    'monthly_rate' => 300,
                    'total' => 300,
                ],
            ],
        ]);

        $response->assertSessionHasErrors('contract_number');
    }

    /**
     * اختبار التحقق من وجود العميل
     */
    public function test_validation_requires_valid_customer(): void
    {
        $this->actingAs($this->user);

        $response = $this->post(route('contracts.store'), [
            'contract_number' => 'CONT-001',
            'contract_date' => now()->format('Y-m-d'),
            'customer_id' => 99999, // عميل غير موجود
            'delivery_address' => 'عنوان',
            'rental_details' => [
                [
                    'item_code' => 'ITEM-001',
                    'item_description' => 'وصف',
                    'start_date' => now()->format('Y-m-d'),
                    'end_date' => now()->addMonths(1)->format('Y-m-d'),
                    'duration' => 1,
                    'duration_type' => 'monthly',
                    'quantity' => 1,
                    'daily_rate' => 10,
                    'monthly_rate' => 300,
                    'total' => 300,
                ],
            ],
        ]);

        $response->assertSessionHasErrors('customer_id');
    }

    /**
     * اختبار التحقق من وجود تفاصيل الإيجار
     */
    public function test_validation_requires_rental_details(): void
    {
        $customer = Customer::factory()->create();
        $this->actingAs($this->user);

        $response = $this->post(route('contracts.store'), [
            'contract_number' => 'CONT-001',
            'contract_date' => now()->format('Y-m-d'),
            'customer_id' => $customer->id,
            'delivery_address' => 'عنوان',
            'rental_details' => [], // فارغ
        ]);

        $response->assertSessionHasErrors('rental_details');
    }

    /**
     * اختبار التحقق من تفاصيل الإيجار المطلوبة
     */
    public function test_validation_requires_rental_detail_fields(): void
    {
        $customer = Customer::factory()->create();
        $this->actingAs($this->user);

        $response = $this->post(route('contracts.store'), [
            'contract_number' => 'CONT-001',
            'contract_date' => now()->format('Y-m-d'),
            'customer_id' => $customer->id,
            'delivery_address' => 'عنوان',
            'rental_details' => [
                [
                    // بيانات ناقصة
                    'item_code' => 'ITEM-001',
                ],
            ],
        ]);

        $response->assertSessionHasErrors([
            'rental_details.0.item_description',
            'rental_details.0.start_date',
            'rental_details.0.duration',
            'rental_details.0.quantity',
        ]);
    }

    /**
     * اختبار إنشاء عقد بدون مدفوعات
     */
    public function test_can_create_contract_without_payments(): void
    {
        $customer = Customer::factory()->create();
        $this->actingAs($this->user);

        $contractData = [
            'contract_number' => 'CONT-NO-PAYMENT',
            'contract_date' => now()->format('Y-m-d'),
            'customer_id' => $customer->id,
            'delivery_address' => 'عنوان',
            'rental_details' => [
                [
                    'item_code' => 'ITEM-001',
                    'item_description' => 'وصف',
                    'start_date' => now()->format('Y-m-d'),
                    'end_date' => now()->addMonths(1)->format('Y-m-d'),
                    'duration' => 1,
                    'duration_type' => 'monthly',
                    'quantity' => 1,
                    'daily_rate' => 10,
                    'monthly_rate' => 300,
                    'total' => 300,
                ],
            ],
        ];

        $response = $this->post(route('contracts.store'), $contractData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $contract = Contract::where('contract_number', 'CONT-NO-PAYMENT')->first();
        $this->assertNotNull($contract);
        $this->assertEquals(0, $contract->contractPayments()->count());
    }

    /**
     * اختبار حساب المبلغ الإجمالي بشكل صحيح
     */
    public function test_calculates_total_amount_correctly(): void
    {
        $customer = Customer::factory()->create();
        $this->actingAs($this->user);

        $contractData = [
            'contract_number' => 'CONT-CALC',
            'contract_date' => now()->format('Y-m-d'),
            'customer_id' => $customer->id,
            'delivery_address' => 'عنوان',
            'transport_and_installation_cost' => 200.00,
            'total_discount' => 100.00,
            'rental_details' => [
                [
                    'item_code' => 'ITEM-001',
                    'item_description' => 'وصف 1',
                    'start_date' => now()->format('Y-m-d'),
                    'end_date' => now()->addMonths(1)->format('Y-m-d'),
                    'duration' => 1,
                    'duration_type' => 'monthly',
                    'quantity' => 1,
                    'daily_rate' => 10,
                    'monthly_rate' => 300,
                    'total' => 300,
                ],
                [
                    'item_code' => 'ITEM-002',
                    'item_description' => 'وصف 2',
                    'start_date' => now()->format('Y-m-d'),
                    'end_date' => now()->addMonths(2)->format('Y-m-d'),
                    'duration' => 2,
                    'duration_type' => 'monthly',
                    'quantity' => 2,
                    'daily_rate' => 15,
                    'monthly_rate' => 450,
                    'total' => 900,
                ],
            ],
        ];

        $this->post(route('contracts.store'), $contractData);

        $contract = Contract::where('contract_number', 'CONT-CALC')->first();
        // المبلغ الإجمالي = 300 + 900 + 200 - 100 = 1300
        $this->assertEquals(1300.00, (float) $contract->amount);
    }

    /**
     * اختبار حساب تاريخي البدء والنهاية من تفاصيل الإيجار
     */
    public function test_calculates_start_and_end_dates_from_rental_details(): void
    {
        $customer = Customer::factory()->create();
        $this->actingAs($this->user);

        $startDate1 = now()->addDays(5)->format('Y-m-d');
        $endDate1 = now()->addMonths(1)->format('Y-m-d');
        $startDate2 = now()->addDays(10)->format('Y-m-d');
        $endDate2 = now()->addMonths(2)->format('Y-m-d');

        $contractData = [
            'contract_number' => 'CONT-DATES',
            'contract_date' => now()->format('Y-m-d'),
            'customer_id' => $customer->id,
            'delivery_address' => 'عنوان',
            'rental_details' => [
                [
                    'item_code' => 'ITEM-001',
                    'item_description' => 'وصف 1',
                    'start_date' => $startDate1,
                    'end_date' => $endDate1,
                    'duration' => 1,
                    'duration_type' => 'monthly',
                    'quantity' => 1,
                    'daily_rate' => 10,
                    'monthly_rate' => 300,
                    'total' => 300,
                ],
                [
                    'item_code' => 'ITEM-002',
                    'item_description' => 'وصف 2',
                    'start_date' => $startDate2,
                    'end_date' => $endDate2,
                    'duration' => 2,
                    'duration_type' => 'monthly',
                    'quantity' => 1,
                    'daily_rate' => 10,
                    'monthly_rate' => 300,
                    'total' => 600,
                ],
            ],
        ];

        $this->post(route('contracts.store'), $contractData);

        $contract = Contract::where('contract_number', 'CONT-DATES')->first();

        // تاريخ البدء يجب أن يكون الأصغر (startDate1)
        $this->assertEquals($startDate1, $contract->start_date->format('Y-m-d'));

        // تاريخ النهاية يجب أن يكون الأكبر (endDate2)
        $this->assertEquals($endDate2, $contract->end_date->format('Y-m-d'));
    }
}

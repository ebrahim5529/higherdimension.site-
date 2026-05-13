<?php

namespace Tests\Feature;

use Tests\TestCase;

class CustomerContractsPaymentsReportTest extends TestCase
{
    public function test_guest_cannot_access_customer_contracts_payments_report(): void
    {
        $this->get('/dashboard/customer-contracts-payments-report')
            ->assertRedirect();
    }
}

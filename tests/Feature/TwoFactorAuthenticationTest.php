<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\TwoFactorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class TwoFactorAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_enable_two_factor_authentication(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('profile.two-factor.enable'))
            ->assertRedirect()
            ->assertSessionHas('success');

        $user->refresh();
        $this->assertTrue($user->hasTwoFactorEnabled());
    }

    public function test_user_can_disable_two_factor_authentication(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
            'two_factor_enabled' => true,
        ]);

        $this->actingAs($user)
            ->post(route('profile.two-factor.disable'), [
                'password' => 'password',
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $user->refresh();
        $this->assertFalse($user->hasTwoFactorEnabled());
    }

    public function test_user_cannot_disable_two_factor_without_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
            'two_factor_enabled' => true,
        ]);

        $this->actingAs($user)
            ->post(route('profile.two-factor.disable'), [
                'password' => 'wrong-password',
            ])
            ->assertSessionHasErrors('password');

        $user->refresh();
        $this->assertTrue($user->hasTwoFactorEnabled());
    }

    public function test_two_factor_service_generates_valid_otp(): void
    {
        $service = new TwoFactorService;
        $otp = $service->generateOtp();

        $this->assertEquals(6, strlen($otp));
        $this->assertTrue(ctype_digit($otp));
    }

    public function test_two_factor_service_sends_otp_to_user_email(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'two_factor_enabled' => true,
        ]);

        $service = new TwoFactorService;
        $service->sendOtp($user);

        Notification::assertSentTo($user, \App\Notifications\TwoFactorOtpNotification::class);

        $user->refresh();
        $this->assertNotNull($user->two_factor_otp);
        $this->assertNotNull($user->two_factor_otp_expires_at);
    }

    public function test_two_factor_service_verifies_valid_otp(): void
    {
        $user = User::factory()->create([
            'two_factor_enabled' => true,
        ]);

        $service = new TwoFactorService;
        $otp = $service->sendOtp($user);

        $this->assertTrue($service->verifyOtp($user, $otp));

        $user->refresh();
        $this->assertNull($user->two_factor_otp);
        $this->assertNull($user->two_factor_otp_expires_at);
    }

    public function test_two_factor_service_rejects_invalid_otp(): void
    {
        $user = User::factory()->create([
            'two_factor_enabled' => true,
        ]);

        $service = new TwoFactorService;
        $service->sendOtp($user);

        $this->assertFalse($service->verifyOtp($user, '000000'));
    }
}

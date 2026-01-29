<?php

namespace Tests\Feature;

use App\Models\SecurityNotification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityNotificationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_security_notifications(): void
    {
        $user = User::factory()->create();

        SecurityNotification::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user)
            ->get(route('notifications.index'))
            ->assertOk();
    }

    public function test_user_can_mark_notification_as_read(): void
    {
        $user = User::factory()->create();

        $notification = SecurityNotification::factory()->create([
            'user_id' => $user->id,
            'read_at' => null,
        ]);

        $this->actingAs($user)
            ->post(route('notifications.read', $notification))
            ->assertRedirect()
            ->assertSessionHas('success');

        $notification->refresh();
        $this->assertNotNull($notification->read_at);
    }

    public function test_user_can_mark_all_notifications_as_read(): void
    {
        $user = User::factory()->create();

        SecurityNotification::factory()->count(3)->create([
            'user_id' => $user->id,
            'read_at' => null,
        ]);

        $this->actingAs($user)
            ->post(route('notifications.read-all'))
            ->assertRedirect()
            ->assertSessionHas('success');

        $unreadCount = SecurityNotification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        $this->assertEquals(0, $unreadCount);
    }

    public function test_user_can_delete_notification(): void
    {
        $user = User::factory()->create();

        $notification = SecurityNotification::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->actingAs($user)
            ->delete(route('notifications.destroy', $notification))
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('security_notifications', [
            'id' => $notification->id,
        ]);
    }

    public function test_user_cannot_access_other_users_notifications(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $notification = SecurityNotification::factory()->create([
            'user_id' => $user2->id,
        ]);

        $this->actingAs($user1)
            ->post(route('notifications.read', $notification))
            ->assertForbidden();
    }
}

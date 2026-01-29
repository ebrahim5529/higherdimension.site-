<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ResetPasswordArabic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'two_factor_enabled',
        'two_factor_otp',
        'two_factor_otp_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_otp',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_enabled' => 'boolean',
            'two_factor_otp_expires_at' => 'datetime',
        ];
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin') || $this->role === 'ADMIN';
    }

    // Relationships
    public function contracts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function payments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function activities(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function customerNotes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(CustomerNote::class);
    }

    public function trustedDevices(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TrustedDevice::class);
    }

    public function securityNotifications(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SecurityNotification::class);
    }

    public function hasTwoFactorEnabled(): bool
    {
        return $this->two_factor_enabled === true;
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordArabic($token));
    }
}

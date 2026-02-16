<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountingSetting extends Model
{
    protected $fillable = ['key', 'value', 'label', 'group'];

    public static function get(string $key, $default = null): ?string
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function set(string $key, ?string $value, ?string $label = null, string $group = 'general'): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'label' => $label ?? $key, 'group' => $group]
        );
    }

    public static function getAccountId(string $key): ?int
    {
        $value = static::get($key);
        return $value ? (int) $value : null;
    }
}

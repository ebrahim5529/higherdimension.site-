<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Schema;

class AppSetting extends Model
{
    protected $table = 'app_settings';

    private static array $encryptedKeys = [
        'mail_password',
    ];

    protected $fillable = [
        'key',
        'value',
    ];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        if (! Schema::hasTable('app_settings')) {
            return $default;
        }

        $row = static::query()->where('key', $key)->first();

        if (! $row) {
            return $default;
        }

        if (in_array($key, static::$encryptedKeys, true)) {
            try {
                return Crypt::decryptString((string) $row->value);
            } catch (\Throwable $e) {
                return $default;
            }
        }

        return $row->value;
    }

    public static function setValue(string $key, mixed $value): void
    {
        if (! Schema::hasTable('app_settings')) {
            return;
        }

        if (in_array($key, static::$encryptedKeys, true)) {
            $value = Crypt::encryptString((string) ($value ?? ''));
        }

        static::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}

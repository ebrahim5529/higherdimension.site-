<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TransferLocalToProduction extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:transfer-local-to-production';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'نقل البيانات من قاعدة البيانات المحلية إلى قاعدة البيانات الإنتاجية';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('بدء عملية نقل البيانات من المحلية إلى الإنتاج...');

        // إعدادات قاعدة البيانات المحلية
        $localConfig = [
            'host' => 'localhost',
            'database' => 'higherdimension',
            'username' => 'root',
            'password' => '',
        ];

        // إعدادات قاعدة البيانات الإنتاجية
        $productionConfig = [
            'host' => 'srv2119.hstgr.io',
            'database' => 'u183760739_higher',
            'username' => 'u183760739_higher',
            'password' => 'y7M959qjdKF$',
        ];

        try {
            // الاتصال بقاعدة البيانات المحلية
            $this->createConnection('local', $localConfig);
            $this->info('✓ تم الاتصال بقاعدة البيانات المحلية');

            // الاتصال بقاعدة البيانات الإنتاجية
            $this->createConnection('production', $productionConfig);
            $this->info('✓ تم الاتصال بقاعدة البيانات الإنتاجية');

            // الحصول على قائمة الجداول
            $tables = $this->getTables('local');
            $this->info("تم العثور على " . count($tables) . " جدول");

            // نقل البيانات من كل جدول
            foreach ($tables as $table) {
                // تخطي جداول النظام
                if (in_array($table, ['migrations', 'cache', 'cache_locks', 'sessions', 'jobs', 'job_batches', 'failed_jobs'])) {
                    $this->warn("تخطي جدول: {$table}");
                    continue;
                }

                $this->info("نقل بيانات جدول: {$table}");

                // التحقق من وجود الجدول في قاعدة البيانات الإنتاجية
                $productionTables = $this->getTables('production');
                if (!in_array($table, $productionTables)) {
                    $this->warn("  - الجدول غير موجود في قاعدة البيانات الإنتاجية، سيتم تخطيه");
                    continue;
                }

                // الحصول على البيانات من قاعدة البيانات المحلية
                $localCount = DB::connection('local')->table($table)->count();
                $productionCountBefore = DB::connection('production')->table($table)->count();

                if ($localCount == 0) {
                    $this->warn("  - الجدول فارغ (المحلية: {$localCount}, الإنتاج: {$productionCountBefore})");
                    continue;
                }

                $data = DB::connection('local')->table($table)->get();

                // نقل البيانات إلى قاعدة البيانات الإنتاجية
                $chunkSize = 100;
                $insertedCount = 0;
                $skippedCount = 0;

                $data->chunk($chunkSize)->each(function ($chunk) use ($table, &$insertedCount, &$skippedCount) {
                    try {
                        DB::connection('production')->table($table)->insert(
                            $chunk->map(function ($item) {
                                return (array) $item;
                            })->toArray()
                        );
                        $insertedCount += $chunk->count();
                    } catch (\Exception $e) {
                        // في حالة وجود سجلات مكررة، نحاول الإدراج بشكل فردي
                        foreach ($chunk as $item) {
                            try {
                                DB::connection('production')->table($table)->insert((array) $item);
                                $insertedCount++;
                            } catch (\Exception $ex) {
                                // تخطي السجلات المكررة
                                $skippedCount++;
                            }
                        }
                    }
                });

                $productionCountAfter = DB::connection('production')->table($table)->count();

                if ($insertedCount > 0) {
                    $this->info("  ✓ تم نقل {$insertedCount} سجل (المحلية: {$localCount}, الإنتاج قبل: {$productionCountBefore}, الإنتاج بعد: {$productionCountAfter})");
                } else {
                    $this->warn("  - لم يتم نقل أي سجل (ربما مكررة) (المحلية: {$localCount}, الإنتاج: {$productionCountAfter})");
                }
            }

            $this->info('✓ تم نقل جميع البيانات بنجاح!');
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('حدث خطأ: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
            return Command::FAILURE;
        }
    }

    /**
     * إنشاء اتصال بقاعدة البيانات
     */
    private function createConnection(string $name, array $config): void
    {
        config(["database.connections.{$name}" => [
            'driver' => 'mysql',
            'host' => $config['host'],
            'port' => 3306,
            'database' => $config['database'],
            'username' => $config['username'],
            'password' => $config['password'],
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
        ]]);
    }

    /**
     * الحصول على قائمة الجداول
     */
    private function getTables(string $connection): array
    {
        $database = config("database.connections.{$connection}.database");
        $tables = DB::connection($connection)->select("SHOW TABLES");
        $tableName = 'Tables_in_' . $database;
        
        return array_map(function ($table) use ($tableName) {
            return $table->$tableName;
        }, $tables);
    }
}

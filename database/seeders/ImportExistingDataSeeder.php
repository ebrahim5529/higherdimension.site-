<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\Article;
use App\Models\Message;
use App\Models\Video;
use App\Models\Story;
use App\Models\MotivatingEnergy;
use App\Models\User;
use Illuminate\Support\Str;

class ImportExistingDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء مستخدم admin إذا لم يكن موجوداً
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('تم إنشاء/التحقق من مستخدم Admin');

        // Import Books
        $booksData = [
            [
                'title' => 'المختصر في علم النفس الجنائي وإرشاد الجناة',
                'description' => 'كتاب يتناول تقديم عرض مختصر لمفهوم علم النفس الجنائي: أهدافه، أهميته، تطوره، علاقته بالعلوم الأخرى وعلم النفس الشرعي.',
                'cover_image' => '/b1.jpg',
                'publisher' => 'شركة دار العلم للنشر والتوزيع - الكويت',
                'price' => 0,
                'language' => 'ar',
                'is_published' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'مقامك أرفع مما تظن - كتاب يهمس إلى قلبك',
                'description' => 'كتاب يهمس إلى قلبك برفق وصدق، يحمل رسالة إلى كل نفس متعبة.',
                'cover_image' => '/b2.jpg',
                'publisher' => 'مكتبة الأنجلو المصرية',
                'price' => 0,
                'language' => 'ar',
                'is_published' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'الصحة النفسية للطفل',
                'description' => 'الصحة النفسية للطفل مفهومها ونظرياتها وقواعدها.',
                'cover_image' => '/b3.jpg',
                'publisher' => 'شركة دار العلم للنشر والتوزيع',
                'price' => 0,
                'language' => 'ar',
                'is_published' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'المحترف في الإرشاد المعرفي السلوكي',
                'description' => 'يعتبر الإرشاد النفسي من المهن السامية التي تهدف لإعادة بناء الإنسان.',
                'cover_image' => '/b4.jpg',
                'publisher' => 'شركة دار العلم للنشر والتوزيع',
                'price' => 0,
                'language' => 'ar',
                'is_published' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'المختصر في علم النفس الجنائي وإرشاد الجناة (الطبعة الثانية)',
                'description' => 'تناول هذا الكتاب تقديم عرض مختصر لمفهوم علم النفس الجنائي.',
                'cover_image' => '/b5.jpg',
                'publisher' => 'مكتبة الأنجلو المصرية',
                'price' => 0,
                'language' => 'ar',
                'is_published' => true,
                'sort_order' => 5,
            ],
            [
                'title' => 'الصحة النفسية للطفل (الطبعة الثانية)',
                'description' => 'الصحة النفسية للطفل مفهومها ونظرياتها وقواعدها.',
                'cover_image' => '/b6.png',
                'publisher' => 'شركة دار العلم للنشر والتوزيع',
                'price' => 0,
                'language' => 'ar',
                'is_published' => true,
                'sort_order' => 6,
            ],
            [
                'title' => 'وليد في رمضان',
                'description' => 'قصة هادفة ومسلية للأم والطفل من سلسلة الحياة السعيدة.',
                'cover_image' => '/WhatsApp Image 2025-11-19 at 12.05.53 PM (1).jpeg',
                'publisher' => 'سلسلة الحياة السعيدة',
                'price' => 0,
                'language' => 'ar',
                'is_published' => true,
                'sort_order' => 7,
            ],
            [
                'title' => 'الصدقة الجارية',
                'description' => 'قصة هادفة ومسلية للأم والطفل من سلسلة يوميات وليد.',
                'cover_image' => '/WhatsApp Image 2025-11-19 at 12.05.53 PM (2).jpeg',
                'publisher' => 'سلسلة يوميات وليد',
                'price' => 0,
                'language' => 'ar',
                'is_published' => true,
                'sort_order' => 8,
            ],
            [
                'title' => 'يوميات وليد',
                'description' => 'قصة هادفة ومسلية للأم والطفل من سلسلة قصص يوميات وليد.',
                'cover_image' => '/WhatsApp Image 2025-11-19 at 12.05.54 PM (1).jpeg',
                'publisher' => 'سلسلة يوميات وليد',
                'price' => 0,
                'language' => 'ar',
                'is_published' => true,
                'sort_order' => 9,
            ],
        ];

        foreach ($booksData as $bookData) {
            Book::firstOrCreate(
                ['title' => $bookData['title']],
                $bookData
            );
        }
        $this->command->info('✓ تم استيراد ' . count($booksData) . ' كتاب');

        // Import Articles
        $articlesData = [
            [
                'title' => 'بين الصمت والدعاء - يولد نورك من جديد',
                'slug' => Str::slug('بين الصمت والدعاء يولد نورك من جديد'),
                'category' => 'تطوير الذات',
                'excerpt' => 'حين يمر عليك يوم أثقل من احتمال قلبك، رغم ذلك تواصل سيرك وكأنك ثابت...',
                'content' => 'محتوى المقال الكامل...',
                'author_id' => $adminUser->id,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 1,
            ],
            [
                'title' => 'حين يكلّمنا الله عبر الألم',
                'slug' => Str::slug('حين يكلّمنا الله عبر الألم'),
                'category' => 'صحة نفسية',
                'excerpt' => 'في أكتوبر من كل عام، لا تأتي حملات التوعية بسرطان الثدي صدفة...',
                'content' => 'محتوى المقال الكامل...',
                'author_id' => $adminUser->id,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 2,
            ],
            [
                'title' => 'التواصل الفعال مع الأطفال عبر القصة',
                'slug' => Str::slug('التواصل الفعال مع الأطفال عبر القصة'),
                'category' => 'تربية',
                'excerpt' => 'أطفالنا هدايا من الله جميلة رزقنا الله إياهم لنسعد بهم...',
                'content' => 'محتوى المقال الكامل...',
                'author_id' => $adminUser->id,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 3,
            ],
            [
                'title' => 'الإرشاد والمرشد النفسي',
                'slug' => Str::slug('الإرشاد والمرشد النفسي'),
                'category' => 'إرشاد نفسي',
                'excerpt' => 'يعتبر الإرشاد أحد الدعائم الأساسية لعلم النفس...',
                'content' => 'محتوى المقال الكامل...',
                'author_id' => $adminUser->id,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 4,
            ],
            [
                'title' => 'تقدير النعم',
                'slug' => Str::slug('تقدير النعم'),
                'category' => 'تطوير الذات',
                'excerpt' => 'عندما ينظر الإنسان إلى من هم أقل منه في النعم...',
                'content' => 'محتوى المقال الكامل...',
                'author_id' => $adminUser->id,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 5,
            ],
            [
                'title' => 'كيف نخلص أبناءنا من مشاهير السوشل ميديا',
                'slug' => Str::slug('كيف نخلص أبناءنا من مشاهير السوشل ميديا'),
                'category' => 'تربية',
                'excerpt' => 'كل إنسان على هذه الأرض منذ بداية نشأته يختار قدوة...',
                'content' => 'محتوى المقال الكامل...',
                'author_id' => $adminUser->id,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 6,
            ],
            [
                'title' => 'الأطفال زينة الحياة',
                'slug' => Str::slug('الأطفال زينة الحياة'),
                'category' => 'تربية',
                'excerpt' => 'إن الأطفال هم زينة الحياة الدنيا رزقنا الله إياهم...',
                'content' => 'محتوى المقال الكامل...',
                'author_id' => $adminUser->id,
                'is_published' => true,
                'published_at' => now(),
                'sort_order' => 7,
            ],
        ];

        foreach ($articlesData as $articleData) {
            Article::firstOrCreate(
                ['slug' => $articleData['slug']],
                $articleData
            );
        }
        $this->command->info('✓ تم استيراد ' . count($articlesData) . ' مقال');

        // Import Messages
        $messagesData = [
            ['title' => null, 'content' => 'السعادة ليست وجهة نصل إليها، بل طريقة نعيش بها كل يوم.', 'category' => 'تحفيز', 'is_published' => true, 'published_at' => now(), 'sort_order' => 1],
            ['title' => null, 'content' => 'لا تقارن نفسك بالآخرين، فأنت في رحلتك الخاصة.', 'category' => 'تطوير الذات', 'is_published' => true, 'published_at' => now(), 'sort_order' => 2],
            ['title' => null, 'content' => 'الهدوء الداخلي يبدأ عندما تتوقف عن السماح للآخرين بالتحكم في مشاعرك.', 'category' => 'سلام داخلي', 'is_published' => true, 'published_at' => now(), 'sort_order' => 3],
            ['title' => null, 'content' => 'كل يوم جديد هو فرصة لتكون نسخة أفضل من نفسك.', 'category' => 'تحفيز', 'is_published' => true, 'published_at' => now(), 'sort_order' => 4],
            ['title' => null, 'content' => 'الاهتمام بصحتك النفسية ليس رفاهية، بل ضرورة.', 'category' => 'صحة نفسية', 'is_published' => true, 'published_at' => now(), 'sort_order' => 5],
            ['title' => null, 'content' => 'التسامح يحررك أنت قبل أن يحرر الآخرين.', 'category' => 'سلام داخلي', 'is_published' => true, 'published_at' => now(), 'sort_order' => 6],
        ];

        foreach ($messagesData as $messageData) {
            Message::firstOrCreate(
                ['content' => $messageData['content']],
                $messageData
            );
        }
        $this->command->info('✓ تم استيراد ' . count($messagesData) . ' رسالة');

        // Import Videos
        $videosData = [
            ['title' => 'كيف تتغلب على القلق؟', 'description' => '', 'video_url' => '', 'video_type' => 'youtube', 'category' => 'نصائح نفسية', 'is_published' => true, 'published_at' => now(), 'sort_order' => 1],
            ['title' => '5 طرق لتحسين مزاجك', 'description' => '', 'video_url' => '', 'video_type' => 'youtube', 'category' => 'نصائح نفسية', 'is_published' => true, 'published_at' => now(), 'sort_order' => 2],
            ['title' => 'فهم الاكتئاب وعلاجه', 'description' => '', 'video_url' => '', 'video_type' => 'youtube', 'category' => 'فيديوهات تعليمية', 'is_published' => true, 'published_at' => now(), 'sort_order' => 3],
            ['title' => 'التعامل مع الضغط النفسي', 'description' => '', 'video_url' => '', 'video_type' => 'youtube', 'category' => 'نصائح نفسية', 'is_published' => true, 'published_at' => now(), 'sort_order' => 4],
            ['title' => 'سيكولوجية العلاقات', 'description' => '', 'video_url' => '', 'video_type' => 'youtube', 'category' => 'فيديوهات تعليمية', 'is_published' => true, 'published_at' => now(), 'sort_order' => 5],
            ['title' => 'بناء الثقة بالنفس', 'description' => '', 'video_url' => '', 'video_type' => 'youtube', 'category' => 'نصائح نفسية', 'is_published' => true, 'published_at' => now(), 'sort_order' => 6],
        ];

        foreach ($videosData as $videoData) {
            Video::firstOrCreate(
                ['title' => $videoData['title']],
                $videoData
            );
        }
        $this->command->info('✓ تم استيراد ' . count($videosData) . ' فيديو');

        // Import Stories
        $storiesData = [
            ['title' => 'وليد في رمضان', 'content' => 'قصة هادفة ومسلية للأم والطفل من سلسلة الحياة السعيدة. قصة تعليمية تهدف إلى غرس القيم الإسلامية والوعي الديني لدى الأطفال من خلال قصة مسلية ومشوقة.', 'category' => 'قصص أطفال', 'is_published' => true, 'published_at' => now(), 'sort_order' => 1],
            ['title' => 'الصدقة الجارية', 'content' => 'قصة هادفة ومسلية للأم (المربي) والطفل من سلسلة يوميات وليد. قصة تعليمية تهدف إلى تعليم الأطفال مفهوم الصدقة الجارية وأهميتها في الإسلام.', 'category' => 'قصص أطفال', 'is_published' => true, 'published_at' => now(), 'sort_order' => 2],
            ['title' => 'يوميات وليد', 'content' => 'قصة هادفة ومسلية للأم والطفل من سلسلة قصص يوميات وليد. قصة تعليمية تهدف إلى تنمية الوعي والسلوك الإيجابي لدى الأطفال.', 'category' => 'قصص أطفال', 'is_published' => true, 'published_at' => now(), 'sort_order' => 3],
        ];

        foreach ($storiesData as $storyData) {
            Story::firstOrCreate(
                ['title' => $storyData['title']],
                $storyData
            );
        }
        $this->command->info('✓ تم استيراد ' . count($storiesData) . ' قصة');

        // Import Motivating Energies
        $energiesData = [
            ['title' => null, 'content' => "ليس كل يوم سهل…\nومع ذلك تكمل الطريق لأن بداخلك قوة لا يراها أحد.", 'category' => 'تحفيز', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 1],
            ['title' => null, 'content' => "روحك لا تنطفئ…\nهي فقط تبحث عن لحظة هدوء لتعود أقوى.", 'category' => 'تحفيز', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 2],
            ['title' => null, 'content' => "ابتسامتك ليست دائمًا فرحًا…\nبل غطاء لوجع لا تريد أن تُثقل به أحدًا.", 'category' => 'صحة نفسية', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 3],
            ['title' => null, 'content' => "تأخر الإجابة ليس رفضًا…\nبل إعداد لشيء أنسب وأجمل مما تتوقع.", 'category' => 'إيمان', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 4],
            ['title' => null, 'content' => "ما يرهقك اليوم هو صقل،\nيبني منك نسخة أقوى دون أن تشعر.", 'category' => 'تحفيز', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 5],
            ['title' => null, 'content' => "الله يسمع صمتك…\nكما يسمع دعاءك.", 'category' => 'إيمان', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 6],
            ['title' => null, 'content' => "بعض الأمنيات تحتاج قلبًا أثبت،\nوبعض الإجابات تأتي عندما تنضج بما يكفي.", 'category' => 'إيمان', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 7],
            ['title' => null, 'content' => "أعظم انتصار…\nأن تصافحك روحك بسلام.", 'category' => 'سلام داخلي', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 8],
            ['title' => null, 'content' => "العثرات ليست عقبات…\nبل علامات طريق تُعيدك لنورك الحقيقي.", 'category' => 'تحفيز', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 9],
            ['title' => null, 'content' => "ما ظننته فقدًا…\nكان ترتيبًا إلهيًا ليقودك لطف جديد.", 'category' => 'إيمان', 'image' => '', 'is_published' => true, 'published_at' => now(), 'sort_order' => 10],
        ];

        foreach ($energiesData as $energyData) {
            MotivatingEnergy::firstOrCreate(
                ['content' => $energyData['content']],
                $energyData
            );
        }
        $this->command->info('✓ تم استيراد ' . count($energiesData) . ' بطاقة تحفيزية');

        $this->command->info('✓ تم استيراد جميع البيانات بنجاح!');
    }
}

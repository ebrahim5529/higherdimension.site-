<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ $title ?? config('app.name') }}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;direction:rtl;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:#f1f5f9;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:#1e40af;padding:18px 22px;">
                <div style="font-family:Tahoma, Arial, sans-serif;font-size:18px;font-weight:700;color:#ffffff;">
                  {{ config('app.name') }}
                </div>
                @if(!empty($subtitle))
                  <div style="font-family:Tahoma, Arial, sans-serif;font-size:12px;color:rgba(255,255,255,0.85);margin-top:4px;">
                    {{ $subtitle }}
                  </div>
                @endif
              </td>
            </tr>

            <tr>
              <td style="padding:22px;">
                @if(!empty($greeting))
                  <div style="font-family:Tahoma, Arial, sans-serif;font-size:18px;font-weight:700;color:#0f172a;">
                    {{ $greeting }}
                  </div>
                @endif

                @if(!empty($introLines) && is_array($introLines))
                  <div style="margin-top:12px;">
                    @foreach($introLines as $line)
                      @if(strip_tags($line) !== $line)
                        {!! $line !!}
                      @else
                        <div style="font-family:Tahoma, Arial, sans-serif;font-size:14px;line-height:1.8;color:#334155;margin:0 0 10px 0;">
                          {{ $line }}
                        </div>
                      @endif
                    @endforeach
                  </div>
                @endif

                @if(!empty($listItems) && is_array($listItems) && count($listItems) > 0)
                  <div style="margin-top:12px;">
                    <ul style="margin:0;padding-right:18px;">
                      @foreach($listItems as $item)
                        <li style="font-family:Tahoma, Arial, sans-serif;font-size:14px;line-height:1.8;color:#0f172a;">
                          {{ $item }}
                        </li>
                      @endforeach
                    </ul>
                  </div>
                @endif

                @if(!empty($actionText) && !empty($actionUrl))
                  <div style="margin-top:18px;margin-bottom:10px;">
                    <a href="{{ $actionUrl }}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-family:Tahoma, Arial, sans-serif;font-size:14px;font-weight:700;padding:12px 18px;border-radius:10px;">
                      {{ $actionText }}
                    </a>
                  </div>
                  <div style="font-family:Tahoma, Arial, sans-serif;font-size:12px;line-height:1.8;color:#64748b;">
                    إذا لم يعمل الزر، انسخ الرابط التالي والصقه في المتصفح:
                    <div style="direction:ltr;text-align:left;word-break:break-all;background:#f8fafc;border:1px solid #e2e8f0;padding:10px;border-radius:10px;margin-top:8px;">
                      {{ $actionUrl }}
                    </div>
                  </div>
                @endif

                @if(!empty($outroLines) && is_array($outroLines))
                  <div style="margin-top:14px;">
                    @foreach($outroLines as $line)
                      @if(strip_tags($line) !== $line)
                        {!! $line !!}
                      @else
                        <div style="font-family:Tahoma, Arial, sans-serif;font-size:14px;line-height:1.8;color:#334155;margin:0 0 10px 0;">
                          {{ $line }}
                        </div>
                      @endif
                    @endforeach
                  </div>
                @endif

                @if(!empty($salutation))
                  <div style="margin-top:16px;font-family:Tahoma, Arial, sans-serif;font-size:14px;color:#0f172a;font-weight:700;">
                    {{ $salutation }}
                  </div>
                @endif
              </td>
            </tr>

            <tr>
              <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:14px 22px;">
                <div style="font-family:Tahoma, Arial, sans-serif;font-size:12px;color:#64748b;line-height:1.7;">
                  © {{ date('Y') }} {{ config('app.name') }}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

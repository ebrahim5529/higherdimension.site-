import { showToast } from '@/hooks/use-toast'

const PRINT_QUERY = 'print=1'

/**
 * يفتح صفحة توقيع العقد (نفس محتوى الطباعة في /contract/sign/…)
 * ثم تُستدعى الطباعة تلقائياً بعد التحميل عبر معامل ?print=1 في صفحة التوقيع.
 */
export function openContractSignPrintWindow (contractNumber: string): void {
  if (typeof window === 'undefined') return
  const num = (contractNumber || '').trim()
  if (!num) {
    showToast.error('خطأ', 'رقم العقد غير متوفر')
    return
  }
  const path = `/contract/sign/${encodeURIComponent(num)}`
  const url = `${path}?${PRINT_QUERY}`
  const win = window.open(url, '_blank', 'noopener,noreferrer')
  if (!win) {
    showToast.error('تعذر فتح الطباعة', 'يرجى السماح بالنوافذ المنبثقة ثم المحاولة مرة أخرى')
  }
}

export function getContractSignPrintUrl (contractNumber: string): string {
  const num = (contractNumber || '').trim()
  return `/contract/sign/${encodeURIComponent(num)}?${PRINT_QUERY}`
}

import { router } from '@inertiajs/react'
import { ContractWhatsAppModal } from '@/components/features/ContractWhatsAppModal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract: any
  customerPhone: string
  redirectOnCloseTo?: string | null
}

export function ContractWhatsAppModalSection ({
  open,
  onOpenChange,
  contract,
  customerPhone,
  redirectOnCloseTo = null
}: Props) {
  return (
    <ContractWhatsAppModal
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen && redirectOnCloseTo) {
          router.visit(redirectOnCloseTo)
        }
      }}
      contract={contract}
      customerPhone={customerPhone}
    />
  )
}


/** @jsxImportSource react */
import * as React from 'react'
import { Printer } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CONTRACT_SIGN_PRINT_STYLES } from '@/lib/contract-sign-print-styles'

export function ContractPrintStyles (): React.ReactElement {
  return <style>{CONTRACT_SIGN_PRINT_STYLES}</style>
}

export function ContractPrintButton ({
  className,
  children,
  onClick,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <Button
      type="button"
      {...props}
      className={cn(
        'bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2',
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        window.print()
      }}
    >
      {children ?? (
        <>
          <Printer className="h-4 w-4" />
          طباعة العقد
        </>
      )}
    </Button>
  )
}

export { openContractSignPrintWindow, getContractSignPrintUrl } from '@/lib/open-contract-sign-print'

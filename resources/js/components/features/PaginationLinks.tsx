/** @jsxImportSource react */
import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem
} from '@/components/ui/pagination'

type PaginationLinkItem = {
  url: string | null
  label: string
  active: boolean
}

function getArabicLabel (label: string) {
  if (label.includes('Previous')) return 'السابق'
  if (label.includes('Next')) return 'التالي'
  if (label === '...') return '...'
  return label
    .replace(/&laquo;|&raquo;/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim()
}

export function PaginationLinks ({ links, className }: { links: PaginationLinkItem[]; className?: string }) {
  if (!links || links.length <= 1) return null

  const previous = links[0]
  const next = links[links.length - 1]
  const middle = links.slice(1, -1)

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          {previous?.url ? (
            <Button asChild variant="outline" size="sm">
              <Link href={previous.url}>السابق</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              السابق
            </Button>
          )}
        </PaginationItem>

        {middle.map((link, idx) => {
          const label = getArabicLabel(link.label)
          const isEllipsis = label === '...'

          return (
            <PaginationItem key={`${label}-${idx}`}>
              {isEllipsis ? (
                <PaginationEllipsis />
              ) : link.url
                ? (
                  <Button asChild variant={link.active ? 'default' : 'outline'} size="icon">
                    <Link href={link.url}>{label}</Link>
                  </Button>
                )
                : (
                  <Button variant={link.active ? 'default' : 'outline'} size="icon" disabled>
                    {label}
                  </Button>
              )}
            </PaginationItem>
          )
        })}

        <PaginationItem>
          {next?.url ? (
            <Button asChild variant="outline" size="sm">
              <Link href={next.url}>التالي</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              التالي
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}


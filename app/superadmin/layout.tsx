'use client'

import { SuperadminLayout } from '@/components/superadmin-layout'

export default function SuperadminLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return <SuperadminLayout>{children}</SuperadminLayout>
}

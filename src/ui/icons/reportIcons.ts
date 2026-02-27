import { Receipt, PackageSearch, Truck, Users } from 'lucide-react'

export const REPORT_ICONS = {
    receipt: Receipt,
    package: PackageSearch,
    truck: Truck,
    users: Users
} as const

export type ReportIconKey = keyof typeof REPORT_ICONS
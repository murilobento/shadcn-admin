import { type CustomerStatus } from './schema'

export const callTypes = new Map<CustomerStatus, string>([
    ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
    ['inactive', 'bg-neutral-300/40 border-neutral-300'],
    ['blocked', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
])

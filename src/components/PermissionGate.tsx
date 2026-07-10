import type { PropsWithChildren, ReactNode } from 'react'
import { useAppContext } from '../context/AppContext'
import type { RoleKey } from '../types'

interface PermissionGateProps {
  anyOf: RoleKey[]
  fallback?: ReactNode
}

export function PermissionGate({ anyOf, fallback = null, children }: PropsWithChildren<PermissionGateProps>) {
  const { currentContext } = useAppContext()

  if (!anyOf.includes(currentContext.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

import { useEffect, useState } from 'react'
import { createDemoDashboard, DASHBOARD_STREAM } from './dashboard-data'
import type { DashboardData } from './dashboard-data'

export function useDashboard() {
  const [data, setData] = useState(createDemoDashboard)
  const [connection, setConnection] = useState(import.meta.env.DEV ? 'Connecting…' : 'Sample data')

  useEffect(() => {
    if (!import.meta.env.DEV) return

    const stream = new EventSource(DASHBOARD_STREAM)
    stream.onmessage = (event: MessageEvent<string>) => {
      const snapshot: DashboardData = JSON.parse(event.data)
      setData(snapshot)
      setConnection('Live demo')
    }
    stream.onerror = () => setConnection('Reconnecting…')

    return () => stream.close()
  }, [])

  return { data, connection }
}

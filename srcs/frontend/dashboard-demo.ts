import type { ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { createDemoDashboard, DASHBOARD_STREAM, DEMO_COMPLETION } from './src/features/dashboard/dashboard-data.ts'

export default function dashboardDemo(): Plugin {
  return {
    name: 'nexa-dashboard-demo',
    apply: 'serve',
    configureServer(server) {
      const clients = new Set<ServerResponse>()
      const dashboard = createDemoDashboard()
      const send = (client: ServerResponse) => client.write(`data: ${JSON.stringify(dashboard)}\n\n`)

      server.middlewares.use((request, response, next) => {
        if (request.url === DASHBOARD_STREAM && request.method === 'GET') {
          response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
          })
          clients.add(response)
          const heartbeat = setInterval(() => response.write(': heartbeat\n\n'), 25_000)
          response.once('close', () => {
            clearInterval(heartbeat)
            clients.delete(response)
          })
          send(response)
          return
        }

        if (request.url !== DEMO_COMPLETION || request.method !== 'POST') {
          next()
          return
        }

        if (request.headers['x-nexa-demo'] !== '1') {
          response.writeHead(403).end()
          return
        }

        if (dashboard.active > 0) {
          dashboard.active -= 1
          dashboard.completed += 1
          const task = dashboard.tasks.find(({ status }) => status !== 'Done')
          if (task) task.status = 'Done'

          dashboard.activity.unshift({
            id: dashboard.completed,
            text: task ? `Completed: ${task.name}` : `Demo task #${dashboard.completed} completed`,
            date: new Date().toISOString(),
            completion: true,
          })
          clients.forEach(send)
        }

        response.writeHead(204).end()
      })

      server.httpServer?.once('close', () => clients.clear())
    },
  }
}

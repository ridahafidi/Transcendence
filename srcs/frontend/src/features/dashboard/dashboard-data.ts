export type Activity = {
  id: number
  text: string
  date: string
  completion?: boolean
}

export type Task = {
  name: string
  status: 'To do' | 'In progress' | 'Done'
  due: string
}

export type DashboardData = {
  active: number
  completed: number
  online: number
  members: number
  overdue: number
  activity: Activity[]
  tasks: Task[]
}

export const DASHBOARD_STREAM = '/__nexa-demo/dashboard'
export const DEMO_COMPLETION = '/__nexa-demo/dashboard/complete'

export function createDemoDashboard(): DashboardData {
  const activity = [
    'Sara completed Inventory check',
    'Youssef joined Kitchen',
    'New file uploaded: menu.pdf',
    'Task assigned to you: Order supplies',
    'Khalid commented on Fix oven timer',
  ].map((text, index) => ({
    id: index + 1,
    text,
    date: new Date(Date.now() - index * 86_400_000).toISOString(),
    completion: index === 0,
  }))

  const tasks: Task[] = [
    { name: 'Update weekly schedule', status: 'In progress', due: 'Nov 3' },
    { name: 'Order supplies', status: 'To do', due: 'Nov 5' },
    { name: 'Review invoices', status: 'To do', due: 'Nov 9' },
    { name: 'Clean freezer', status: 'Done', due: 'Nov 1' },
  ]

  return { active: 128, completed: 342, online: 14, members: 22, overdue: 9, activity, tasks }
}

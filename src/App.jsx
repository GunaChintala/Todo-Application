import { useState } from 'react'
import Sidebar, { MobileNav } from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import TasksPage from './components/TasksPage'
import CalendarView from './components/Calendar'
import Statistics from './components/Statistics'
import Settings from './components/Settings'
import TaskForm from './components/TaskForm'
import TaskHistory from './components/TaskHistory'
import ConfirmDialog from './components/ConfirmDialog'
import { useTasks } from './hooks/useTasks'
import './App.css'

const TITLES = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  calendar: 'Calendar',
  statistics: 'Statistics',
  settings: 'Settings',
  history: 'Task History',
}

export default function App() {
  const {
    tasks,
    settings,
    setSettings,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleCompletion,
    resetData,
  } = useTasks()

  const [page, setPage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [historyTaskId, setHistoryTaskId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [pendingReset, setPendingReset] = useState(false)

  const historyTask = tasks.find((task) => task.id === historyTaskId)
  const currentPage = historyTask ? 'history' : page

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(task) {
    setEditing(task)
    setFormOpen(true)
  }

  function handleSubmit(form) {
    if (editing) {
      updateTask(editing.id, form)
    } else {
      addTask(form)
      setPage('dashboard')
      setHistoryTaskId(null)
    }
    setFormOpen(false)
    setEditing(null)
  }

  function navigate(nextPage) {
    setHistoryTaskId(null)
    setPage(nextPage)
  }

  return (
    <div className="app-shell">
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      <div className="main">
        <Navbar title={TITLES[currentPage]} onMenu={() => setMenuOpen(true)} />
        <div className="content">
          {historyTask ? (
            <TaskHistory
              task={historyTask}
              onBack={() => setHistoryTaskId(null)}
              onToggle={toggleCompletion}
            />
          ) : null}
          {!historyTask && page === 'dashboard' ? (
            <Dashboard
              tasks={tasks}
              stats={stats}
              onToggle={toggleCompletion}
              onOpen={(task) => setHistoryTaskId(task.id)}
              onEdit={openEdit}
              onDelete={setPendingDelete}
              onCreate={openCreate}
            />
          ) : null}
          {!historyTask && page === 'tasks' ? (
            <TasksPage
              tasks={tasks}
              categories={stats.categories}
              today={stats.today}
              onToggle={toggleCompletion}
              onOpen={(task) => setHistoryTaskId(task.id)}
              onEdit={openEdit}
              onDelete={setPendingDelete}
              onCreate={openCreate}
            />
          ) : null}
          {!historyTask && page === 'calendar' ? (
            <CalendarView tasks={tasks} onToggle={toggleCompletion} />
          ) : null}
          {!historyTask && page === 'statistics' ? (
            <Statistics tasks={tasks} stats={stats} />
          ) : null}
          {!historyTask && page === 'settings' ? (
            <Settings
              settings={settings}
              setSettings={setSettings}
              taskCount={tasks.length}
              onReset={() => setPendingReset(true)}
            />
          ) : null}
        </div>
      </div>
      <MobileNav currentPage={page} onNavigate={navigate} />

      <TaskForm
        open={formOpen}
        initialTask={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this task?"
        message={
          pendingDelete
            ? `“${pendingDelete.title}” and its daily history will be removed.`
            : ''
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteTask(pendingDelete.id)
          if (historyTaskId === pendingDelete.id) setHistoryTaskId(null)
          setPendingDelete(null)
        }}
      />

      <ConfirmDialog
        open={pendingReset}
        title="Restore sample data?"
        message="This replaces your current tasks with the starter habits."
        confirmLabel="Restore"
        onCancel={() => setPendingReset(false)}
        onConfirm={() => {
          resetData()
          setPendingReset(false)
          setHistoryTaskId(null)
          setPage('dashboard')
        }}
      />
    </div>
  )
}

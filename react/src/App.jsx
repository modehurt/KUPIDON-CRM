import { useEffect, useState } from 'react'
import {
	Navigate,
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
	useNavigate,
} from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar/sidebar'
import { initialSchedule, initialTasks, initialUsers } from './data'
import Challenge from './pages/Challenge'
import Chats from './pages/Chats'
import Login from './pages/Login'
import Lookup from './pages/Lookup'
import Rating from './pages/Rating'
import Schedule from './pages/Schedule'
import Statistics from './pages/Statistics'
import Tasks from './pages/Tasks'
import UserDetail from './pages/UserDetail'
import Users from './pages/Users'

const getStatusForUser = (user, schedule) => {
	const now = new Date()

	// Format today's date to match the key format in the schedule object (YYYY-MM-DD)
	const todayKey = now.toISOString().split('T')[0]
	const todaySchedule = schedule[todayKey]

	if (!todaySchedule) {
		return 'Свободна' // No schedule for today
	}

	const userSchedule = todaySchedule.find(s => s.user === user.name)

	if (!userSchedule || !userSchedule.guests) {
		return 'Свободна' // No schedule for this user today
	}

	for (const guest of userSchedule.guests) {
		// Example time: "10:00 - 12:00"
		if (!guest.time || !guest.time.includes(' - ')) continue

		const [startTimeStr, endTimeStr] = guest.time.split(' - ')
		if (!startTimeStr || !endTimeStr) continue

		const [startHour, startMinute] = startTimeStr.split(':').map(Number)
		const [endHour, endMinute] = endTimeStr.split(':').map(Number)

		// Create Date objects for today with the start and end times
		const startDate = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			startHour,
			startMinute
		)
		const endDate = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			endHour,
			endMinute
		)

		// Check for "Ждёт гостя" (e.g., within 30 mins before start)
		const thirtyMinutesBefore = new Date(startDate.getTime() - 30 * 60 * 1000)
		if (now >= thirtyMinutesBefore && now < startDate) {
			return 'Ждёт гостя'
		}

		// Check for "Занята"
		if (now >= startDate && now < endDate) {
			return 'Занята'
		}
	}

	return 'Свободна'
}

// Main layout component including the sidebar and content area
const AppLayout = ({ currentUser, onLogout }) => (
	<div className='App'>
		<Sidebar currentUser={currentUser} onLogout={onLogout} />
		<main className='content'>
			<Outlet /> {/* Nested routes will render here */}
		</main>
	</div>
)

function App() {
	// --- STATE MANAGEMENT ---
	const [users, setUsers] = useState(() => {
		const savedUsers = localStorage.getItem('users')
		return savedUsers ? JSON.parse(savedUsers) : initialUsers
	})

	const [schedule, setSchedule] = useState(() => {
		const savedSchedule = localStorage.getItem('schedule')
		return savedSchedule ? JSON.parse(savedSchedule) : initialSchedule
	})

	const [tasks, setTasks] = useState(() => {
		const savedTasks = localStorage.getItem('tasks')
		return savedTasks ? JSON.parse(savedTasks) : initialTasks
	})

	const [archivedSchedule, setArchivedSchedule] = useState(() => {
		const savedArchivedSchedule = localStorage.getItem('archivedSchedule')
		return savedArchivedSchedule ? JSON.parse(savedArchivedSchedule) : {}
	})

	const [currentUser, setCurrentUser] = useState(() => {
		const savedUser = localStorage.getItem('currentUser')
		return savedUser ? JSON.parse(savedUser) : null
	})

	const [loginError, setLoginError] = useState('')

	// --- LOCALSTORAGE PERSISTENCE ---
	useEffect(() => {
		localStorage.setItem('users', JSON.stringify(users))
		localStorage.setItem('schedule', JSON.stringify(schedule))
		localStorage.setItem('tasks', JSON.stringify(tasks))
		localStorage.setItem('archivedSchedule', JSON.stringify(archivedSchedule))
		if (currentUser) {
			localStorage.setItem('currentUser', JSON.stringify(currentUser))
		} else {
			localStorage.removeItem('currentUser')
		}
	}, [users, schedule, tasks, currentUser, archivedSchedule])

	// Effect for dynamically updating user statuses
	useEffect(() => {
		const updateStatuses = () => {
			setUsers(currentUsers =>
				currentUsers.map(user => {
					// We only update status for users with the 'Пользователь' role
					if (user.role === 'Пользователь') {
						const newStatus = getStatusForUser(user, schedule)
						// Only update if the status has changed
						if (newStatus !== user.status) {
							return { ...user, status: newStatus }
						}
					}
					return user
				})
			)
		}

		// Run once immediately on load
		updateStatuses()

		// Then update every 60 seconds
		const intervalId = setInterval(updateStatuses, 60000)

		// Cleanup interval on component unmount
		return () => clearInterval(intervalId)
	}, [schedule]) // Dependency array includes schedule

	// --- AUTHENTICATION & NAVIGATION ---
	const navigate = useNavigate()

	const handleLogin = (login, password) => {
		const user = initialUsers.find(
			u => u.login === login && u.password === password
		)
		if (user) {
			setCurrentUser(user)
			setLoginError('')
			navigate('/') // Navigate to the default dashboard after login
		} else {
			setLoginError('Неверный логин или пароль')
			setCurrentUser(null)
		}
	}

	const handleLogout = () => {
		setCurrentUser(null)
		navigate('/login')
	}

	// --- DATA HANDLERS ---
	const handleAddUser = newUser => {
		setUsers([
			...users,
			{
				id: users.length + 1,
				...newUser,
				status: 'Свободна',
				expenses: 0,
				role: 'Пользователь', // Default role for new users
			},
		])
	}

	const handleAddGuest = ({ user, guest, date }) => {
		const updatedSchedule = { ...schedule }
		if (!updatedSchedule[date]) {
			updatedSchedule[date] = []
		}
		const userSchedule = updatedSchedule[date].find(s => s.user === user)
		if (userSchedule) {
			userSchedule.guests.push({ ...guest, id: Date.now() })
		} else {
			updatedSchedule[date].push({
				user,
				guests: [{ ...guest, id: Date.now() }],
			})
		}
		setSchedule(updatedSchedule)
	}

	const handleAddExpense = (userId, amount) => {
		setUsers(
			users.map(user =>
				user.id === userId
					? { ...user, expenses: (user.expenses || 0) + amount }
					: user
			)
		)
	}

	const handleArchiveDay = date => {
		if (schedule[date]) {
			const dayToArchive = { ...schedule }
			const archivedDayData = dayToArchive[date]
			delete dayToArchive[date]

			setSchedule(dayToArchive)
			setArchivedSchedule({
				...archivedSchedule,
				[date]: archivedDayData,
			})
			alert(`Расписание за ${date} было заархивировано.`)
		}
	}

	const handleAddTask = newTask => {
		setTasks([
			...tasks,
			{ id: tasks.length + 1, ...newTask, progress: 0, status: 'активно' },
		])
	}

	// --- RENDER LOGIC ---
	if (!currentUser) {
		return <Login onLogin={handleLogin} error={loginError} />
	}

	return (
		<Routes>
			<Route
				path='/login'
				element={<Login onLogin={handleLogin} error={loginError} />}
			/>
			<Route
				path='/*'
				element={
					currentUser ? (
						<AppLayout currentUser={currentUser} onLogout={handleLogout} />
					) : (
						<Navigate to='/login' />
					)
				}
			>
				{/* Nested Routes for the main application */}
				<Route index element={<Navigate to='/users' />} />
				<Route
					path='users'
					element={
						<Users
							users={users}
							schedule={schedule}
							onAddUser={handleAddUser}
							onAddExpense={handleAddExpense}
						/>
					}
				/>
				<Route
					path='users/:userId'
					element={
						<UserDetail
							users={users}
							schedule={schedule}
							onAddExpense={handleAddExpense}
						/>
					}
				/>
				<Route
					path='schedule'
					element={
						<Schedule
							schedule={schedule}
							users={users}
							currentUser={currentUser}
							onAddGuest={handleAddGuest}
							onArchiveDay={handleArchiveDay}
							archivedSchedule={archivedSchedule}
						/>
					}
				/>
				<Route
					path='statistics'
					element={<Statistics users={users} schedule={schedule} />}
				/>
				<Route path='lookup' element={<Lookup />} />
				<Route path='chats' element={<Chats />} />
				<Route
					path='tasks'
					element={<Tasks tasks={tasks} onAddTask={handleAddTask} />}
				/>
				<Route path='challenge' element={<Challenge />} />
				<Route path='rating' element={<Rating />} />
			</Route>
		</Routes>
	)
}

const Root = () => (
	<Router>
		<App />
	</Router>
)

export default Root

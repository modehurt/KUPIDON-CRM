import React, { useState } from 'react'
import AddExpenseModal from '../components/AddExpenseModal/AddExpenseModal'
import AddUserModal from '../components/AddUserModal/AddUserModal'
import UserCard from '../components/UserCard/UserCard'
import './Users.css'

const calculateHours = timeRange => {
	if (!timeRange) return 0
	const [start, end] = timeRange.split(' - ')
	const startDate = new Date(`1970-01-01T${start}:00`)
	const endDate = new Date(`1970-01-01T${end}:00`)
	const difference = endDate.getTime() - startDate.getTime()
	return difference / (1000 * 60 * 60)
}

const Users = ({ users, schedule, onAddUser, onAddExpense }) => {
	const [isAddUserModalOpen, setAddUserModalOpen] = useState(false)
	const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)

	const enrichedUsers = users.map(user => {
		const userSchedule = Object.values(schedule)
			.flat()
			.filter(s => s.user === user.name)
		const turnover = userSchedule.reduce(
			(acc, day) =>
				acc + day.guests.reduce((sum, guest) => sum + guest.price, 0),
			0
		)
		const hours = userSchedule.reduce(
			(acc, day) =>
				acc +
				day.guests.reduce((sum, guest) => sum + calculateHours(guest.time), 0),
			0
		)
		const profit = turnover - user.expenses

		return {
			...user,
			turnover,
			hours,
			profit,
		}
	})

	const handleAddExpenseClick = user => {
		setSelectedUser(user)
		setAddExpenseModalOpen(true)
	}

	const handleAddExpense = amount => {
		onAddExpense(selectedUser.id, amount)
		setAddExpenseModalOpen(false)
		setSelectedUser(null)
	}

	return (
		<div className='users-page'>
			<div className='users-header'>
				<h1>Пользователи</h1>
				<button
					onClick={() => setAddUserModalOpen(true)}
					className='add-user-btn'
				>
					+
				</button>
			</div>
			<div className='user-list'>
				{enrichedUsers.map(user => (
					<UserCard
						key={user.id}
						user={user}
						onAddExpenseClick={handleAddExpenseClick}
					/>
				))}
			</div>
			{isAddUserModalOpen && (
				<AddUserModal
					onClose={() => setAddUserModalOpen(false)}
					onAddUser={onAddUser}
				/>
			)}
			{isAddExpenseModalOpen && selectedUser && (
				<AddExpenseModal
					onClose={() => setAddExpenseModalOpen(false)}
					onAddExpense={handleAddExpense}
					userName={selectedUser.name}
				/>
			)}
		</div>
	)
}

export default Users

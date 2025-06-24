import PropTypes from 'prop-types'
import React, { useState } from 'react'
import AddGuestModal from '../components/AddGuestModal/AddGuestModal'
import './Schedule.css'

const Schedule = ({
	schedule,
	users,
	onAddGuest,
	onArchiveDay,
	archivedSchedule,
	currentUser,
}) => {
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().split('T')[0]
	)
	const [isModalOpen, setModalOpen] = useState(false)
	const [activeTab, setActiveTab] = useState('schedule') // 'schedule' or 'archive'

	// Check the user's role. A normal user should not be able to edit the schedule.
	const canEdit =
		currentUser?.role === 'Администратор' || currentUser?.role === 'Менеджер'

	const dailySchedule = schedule[selectedDate] || []
	const archivedDailySchedule = archivedSchedule
		? archivedSchedule[selectedDate] || []
		: []

	const handleAddGuestSubmit = guestData => {
		onAddGuest({ ...guestData, date: selectedDate })
		setModalOpen(false)
	}

	return (
		<div className='schedule-page'>
			<h1>Расписание</h1>

			<div className='schedule-controls'>
				<div className='tabs'>
					<button
						className={activeTab === 'schedule' ? 'active' : ''}
						onClick={() => setActiveTab('schedule')}
					>
						Расписание
					</button>
					<button
						className={activeTab === 'archive' ? 'active' : ''}
						onClick={() => setActiveTab('archive')}
					>
						Архив
					</button>
				</div>
				<div className='date-controls'>
					<input
						type='date'
						value={selectedDate}
						onChange={e => setSelectedDate(e.target.value)}
					/>
				</div>
			</div>

			{activeTab === 'schedule' && (
				<>
					{canEdit && (
						<div className='schedule-actions'>
							<button onClick={() => setModalOpen(true)}>
								+ Добавить гостя
							</button>
							<button
								className='archive-day-btn'
								onClick={() => onArchiveDay(selectedDate)}
							>
								Архивировать день
							</button>
						</div>
					)}

					<div className='schedule-grid'>
						{users
							.filter(u => u.role === 'Пользователь')
							.map(user => {
								const userSchedule = dailySchedule.find(
									s => s.user === user.name
								)
								return (
									<div key={user.id} className='user-schedule-column'>
										<h3>{user.name}</h3>
										{userSchedule ? (
											userSchedule.guests.map(guest => (
												<div key={guest.id} className='guest-card'>
													<p>{guest.name}</p>
													<p>{guest.time}</p>
													<p>{guest.price} P</p>
												</div>
											))
										) : (
											<p className='no-entries'>Нет записей</p>
										)}
									</div>
								)
							})}
					</div>
				</>
			)}

			{activeTab === 'archive' && (
				<div className='archive-grid'>
					{archivedDailySchedule.length > 0 ? (
						archivedDailySchedule.map(userSchedule => (
							<div
								key={userSchedule.user}
								className='user-schedule-column archived'
							>
								<h3>{userSchedule.user}</h3>
								{userSchedule.guests.map(guest => (
									<div key={guest.id} className='guest-card'>
										<p>{guest.name}</p>
										<p>{guest.time}</p>
										<p>{guest.price} P</p>
									</div>
								))}
							</div>
						))
					) : (
						<p className='no-entries'>Архив за этот день пуст.</p>
					)}
				</div>
			)}

			{canEdit && isModalOpen && (
				<AddGuestModal
					users={users.filter(u => u.role === 'Пользователь')}
					onClose={() => setModalOpen(false)}
					onAddGuest={handleAddGuestSubmit}
					defaultDate={selectedDate}
				/>
			)}
		</div>
	)
}

Schedule.propTypes = {
	schedule: PropTypes.object.isRequired,
	users: PropTypes.array.isRequired,
	onAddGuest: PropTypes.func,
	onArchiveDay: PropTypes.func,
	archivedSchedule: PropTypes.object,
	currentUser: PropTypes.object.isRequired,
}

export default Schedule

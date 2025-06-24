import PropTypes from 'prop-types'
import React, { useState } from 'react'
import './AddGuestModal.css'

const AddGuestModal = ({ onClose, onAddGuest, users, defaultDate }) => {
	const [selectedUser, setSelectedUser] = useState(users[0]?.name || '')
	const [time, setTime] = useState('')
	const [guestName, setGuestName] = useState('')
	const [price, setPrice] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		if (!selectedUser || !guestName || !time || !price) {
			alert('Пожалуйста, заполните все обязательные поля.')
			return
		}

		onAddGuest({
			user: selectedUser,
			guest: {
				name: guestName,
				time,
				price: Number(price),
			},
			date: defaultDate,
		})
	}

	return (
		<div className='modal-overlay' onClick={onClose}>
			<div className='modal-content' onClick={e => e.stopPropagation()}>
				<div className='modal-header'>
					<h2>Добавить гостя</h2>
					<button onClick={onClose} className='close-button'>
						&times;
					</button>
				</div>
				<form onSubmit={handleSubmit} className='modal-body'>
					<div className='input-group'>
						<label>Выберите пользователя</label>
						<select
							value={selectedUser}
							onChange={e => setSelectedUser(e.target.value)}
							required
						>
							<option value='' disabled>
								-- Выберите пользователя --
							</option>
							{users.map(user => (
								<option key={user.id} value={user.name}>
									{user.name}
								</option>
							))}
						</select>
					</div>

					<div className='input-group'>
						<label>Время (например, 10:00 - 12:00)</label>
						<input
							type='text'
							value={time}
							onChange={e => setTime(e.target.value)}
							placeholder='10:00 - 12:00'
							required
						/>
					</div>

					<div className='input-group'>
						<label>Имя гостя</label>
						<input
							type='text'
							value={guestName}
							onChange={e => setGuestName(e.target.value)}
							placeholder='Имя гостя'
							required
						/>
					</div>

					<div className='input-group'>
						<label>Стоимость (P)</label>
						<input
							type='number'
							value={price}
							onChange={e => setPrice(e.target.value)}
							placeholder='5000'
							required
						/>
					</div>

					<div className='modal-footer'>
						<button type='button' onClick={onClose} className='btn-cancel'>
							Отмена
						</button>
						<button type='submit' className='btn-submit'>
							Добавить
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

AddGuestModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	onAddGuest: PropTypes.func.isRequired,
	users: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
		})
	).isRequired,
	defaultDate: PropTypes.string.isRequired,
}

export default AddGuestModal

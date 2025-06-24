import PropTypes from 'prop-types'
import React, { useState } from 'react'
import './AddUserModal.css'

const AddUserModal = ({ onClose, onAddUser }) => {
	const [name, setName] = useState('')
	const [role, setRole] = useState('Пользователь')

	const handleSubmit = e => {
		e.preventDefault()
		// Basic validation
		if (!name) {
			alert('Имя не может быть пустым')
			return
		}
		onAddUser({ name, role })
	}

	return (
		<div className='modal-backdrop'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h2>Добавить пользователя</h2>
					<button onClick={onClose} className='close-btn'>
						&times;
					</button>
				</div>
				<div className='modal-body'>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='name'>Имя</label>
							<input
								type='text'
								id='name'
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder='Введите имя пользователя'
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='role'>Роль</label>
							<select
								id='role'
								value={role}
								onChange={e => setRole(e.target.value)}
							>
								<option value='Пользователь'>Пользователь</option>
								<option value='Администратор'>Администратор</option>
							</select>
						</div>
						{/* The login/password fields are just for show based on the screenshot */}
						<div className='form-group'>
							<label>Логин</label>
							<input type='text' value='user-2u2f2fs' readOnly />
						</div>
						<div className='form-group'>
							<label>Пароль</label>
							<input type='text' value='OfYndzyqS7h' readOnly />
						</div>
						<button type='button' className='generate-btn'>
							Сгенерировать новые данные для входа
						</button>
						<div className='modal-footer'>
							<button type='button' onClick={onClose} className='btn-cancel'>
								Отмена
							</button>
							<button type='submit' className='btn-add'>
								Добавить
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

AddUserModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	onAddUser: PropTypes.func.isRequired,
}

export default AddUserModal

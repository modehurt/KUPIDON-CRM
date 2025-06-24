import PropTypes from 'prop-types'
import React, { useState } from 'react'
import './AddTaskModal.css'

const AddTaskModal = ({ onClose, onAddTask, users }) => {
	const [title, setTitle] = useState('')
	const [goal, setGoal] = useState('')
	const [participants, setParticipants] = useState([])
	const [prize, setPrize] = useState('')

	const handleParticipantChange = e => {
		const { value, checked } = e.target
		if (checked) {
			setParticipants([...participants, value])
		} else {
			setParticipants(participants.filter(p => p !== value))
		}
	}

	const handleSubmit = e => {
		e.preventDefault()
		onAddTask({
			title,
			goal,
			participants: participants.length,
			prize,
		})
	}

	return (
		<div className='modal-backdrop'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h2>Добавить задание</h2>
					<p>Создайте новое задание для участников</p>
					<button onClick={onClose} className='close-btn'>
						&times;
					</button>
				</div>
				<div className='modal-body'>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label>Название</label>
							<input
								type='text'
								value={title}
								onChange={e => setTitle(e.target.value)}
							/>
						</div>
						<div className='form-group'>
							<label>Цель</label>
							<textarea
								value={goal}
								onChange={e => setGoal(e.target.value)}
							></textarea>
						</div>
						<div className='form-group'>
							<label>Участники</label>
							<div className='participants-list'>
								{users.map(user => (
									<label key={user.id}>
										<input
											type='checkbox'
											value={user.name}
											onChange={handleParticipantChange}
										/>
										{user.name}
									</label>
								))}
							</div>
						</div>
						<div className='form-group'>
							<label>Приз</label>
							<input
								type='text'
								value={prize}
								onChange={e => setPrize(e.target.value)}
							/>
						</div>
						<div className='modal-footer'>
							<button type='submit' className='btn-add'>
								Создать задание
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

AddTaskModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	onAddTask: PropTypes.func.isRequired,
	users: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number,
			name: PropTypes.string,
		})
	).isRequired,
}

export default AddTaskModal

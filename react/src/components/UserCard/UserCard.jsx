import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import './UserCard.css'

const UserCard = ({ user, onAddExpenseClick }) => {
	return (
		<div className='user-card-wrapper'>
			<Link to={`/users/${user.id}`} className='user-card-link'>
				<div className='user-card'>
					<div className='user-card-header'>
						<h3>{user.name}</h3>
						<span className={`status ${user.status.toLowerCase()}`}>
							{user.status}
						</span>
					</div>
					<div className='user-card-body'>
						<p>
							Часов: <span>{user.hours.toFixed(1)}</span>
						</p>
						<p>
							Оборот: <span>{user.turnover.toLocaleString('ru-RU')} ₽</span>
						</p>
						<p>
							Расходы: <span>{user.expenses.toLocaleString('ru-RU')} ₽</span>
						</p>
						<p>
							Прибыль: <span>{user.profit.toLocaleString('ru-RU')} ₽</span>
						</p>
					</div>
				</div>
			</Link>
			<div className='user-card-footer'>
				<button onClick={() => onAddExpenseClick(user)}>
					Добавить расходы
				</button>
			</div>
		</div>
	)
}

UserCard.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired,
		hours: PropTypes.number.isRequired,
		turnover: PropTypes.number.isRequired,
		expenses: PropTypes.number.isRequired,
		profit: PropTypes.number.isRequired,
	}).isRequired,
	onAddExpenseClick: PropTypes.func.isRequired,
}

export default UserCard

import PropTypes from 'prop-types'
import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const adminLinks = [
	{ path: '/users', icon: '👥', text: 'Юзеры' },
	{ path: '/lookup', icon: '🔍', text: 'Пробивка' },
	{ path: '/statistics', icon: '📊', text: 'Статистика' },
	{ path: '/schedule', icon: '📅', text: 'Расписание' },
	{ path: '/chats', icon: '💬', text: 'Чаты' },
	{ path: '/tasks', icon: '✅', text: 'Задания' },
]

const managerLinks = [
	{ path: '/lookup', icon: '🔍', text: 'Пробивка' },
	{ path: '/schedule', icon: '📅', text: 'Расписание' },
	{ path: '/chats', icon: '💬', text: 'Чаты' },
	{ path: '/tasks', icon: '✅', text: 'Задания' },
]

const userLinks = [
	{ path: '/schedule', icon: '📅', text: 'Расписание' },
	{ path: '/challenge', icon: '🏆', text: 'Челлендж' },
	{ path: '/rating', icon: '⭐', text: 'Рейтинг' },
]

const getLinksByRole = role => {
	switch (role) {
		case 'Администратор':
			return adminLinks
		case 'Менеджер':
			return managerLinks
		case 'Пользователь':
			return userLinks
		default:
			return []
	}
}

const Sidebar = ({ currentUser, onLogout }) => {
	const links = getLinksByRole(currentUser.role)

	return (
		<aside className='sidebar'>
			<div className='sidebar-header'>
				<h3>KUPIDON CRM</h3>
				<div className='user-profile'>
					<span className='user-status-dot'></span>
					<div className='user-info'>
						<span className='user-name'>{currentUser.name}</span>
						<span className='user-role'>{currentUser.role}</span>
					</div>
				</div>
			</div>

			<nav className='sidebar-nav'>
				<ul>
					{links.map(link => (
						<li key={link.path}>
							<NavLink
								to={link.path}
								className={({ isActive }) => (isActive ? 'active' : '')}
							>
								<span className='nav-icon'>{link.icon}</span>{' '}
								{link.text.toUpperCase()}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>

			<div className='sidebar-footer'>
				<button onClick={onLogout} className='logout-button'>
					Выйти
				</button>
			</div>
		</aside>
	)
}

Sidebar.propTypes = {
	currentUser: PropTypes.shape({
		name: PropTypes.string.isRequired,
		role: PropTypes.string.isRequired,
	}).isRequired,
	onLogout: PropTypes.func.isRequired,
}

export default Sidebar

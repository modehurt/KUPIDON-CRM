import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import './UserDetail.css'

// This would typically come from props or a global state
const mockChartData = [
	{ name: '15.06', Оборот: 7000, Прибыль: 3500 },
	{ name: '16.06', Оборот: 12000, Прибыль: 7000 },
	{ name: '17.06', Оборот: 9000, Прибыль: 5000 },
	{ name: '18.06', Оборот: 14000, Прибыль: 4500 },
	{ name: '19.06', Оборот: 8000, Прибыль: 3800 },
]

const UserDetail = ({ users, schedule }) => {
	const { userId } = useParams()
	const user = users.find(u => u.id === parseInt(userId))

	if (!user) {
		return <div>Пользователь не найден.</div>
	}

	// You can calculate real stats here like we did on the main page
	const turnover = 49235
	const profit = 43839
	const hours = 23
	const expenses = 5396

	return (
		<div className='user-detail-page'>
			<div className='user-detail-header'>
				<Link to='/users' className='back-link'>
					← Назад
				</Link>
				<h2>
					{user.name}{' '}
					<span className={`status ${user.status.toLowerCase()}`}>
						{user.status}
					</span>
				</h2>
			</div>

			<div className='login-details-card'>
				<h3>Данные для входа</h3>
				<div className='detail-row'>
					<span>Логин:</span>
					<span>
						{user.name.toLowerCase()} <button>📋</button>
					</span>
				</div>
				<div className='detail-row'>
					<span>Пароль:</span>
					<span>
						●●●●●●●● <button>👁️</button>
					</span>
				</div>
			</div>

			<div className='user-main-content'>
				<div className='user-stats-summary'>
					<h3>Статистика</h3>
					<div className='summary-card'>
						Оборот<span>{turnover.toLocaleString('ru-RU')} P</span>
					</div>
					<div className='summary-card'>
						Прибыль<span>{profit.toLocaleString('ru-RU')} P</span>
					</div>
					<div className='summary-card'>
						Часы<span>{hours} ч</span>
					</div>
					<div className='summary-card'>
						Расходы<span>{expenses.toLocaleString('ru-RU')} P</span>
					</div>
					<button className='add-expense-btn-detail'>+</button>
				</div>
				<div className='user-chart-container'>
					<h3>График</h3>
					<ResponsiveContainer width='100%' height={300}>
						<LineChart data={mockChartData}>
							<CartesianGrid strokeDasharray='3 3' stroke='#333' />
							<XAxis dataKey='name' stroke='#888' />
							<YAxis stroke='#888' />
							<Tooltip
								contentStyle={{
									backgroundColor: '#1a1a2e',
									border: '1px solid #333',
								}}
							/>
							<Legend />
							<Line type='monotone' dataKey='Оборот' stroke='#8884d8' />
							<Line type='monotone' dataKey='Прибыль' stroke='#82ca9d' />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	)
}

export default UserDetail

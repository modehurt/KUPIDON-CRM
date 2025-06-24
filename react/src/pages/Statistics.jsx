import React, { useState } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import './Statistics.css'

const calculateHours = timeRange => {
	if (!timeRange) return 0
	const [start, end] = timeRange.split(' - ')
	const startDate = new Date(`1970-01-01T${start}:00`)
	const endDate = new Date(`1970-01-01T${end}:00`)
	const difference = endDate.getTime() - startDate.getTime()
	return difference / (1000 * 60 * 60)
}

const Statistics = ({ users, schedule }) => {
	const [activeTab, setActiveTab] = useState('Общая')

	// General Stats Calculation
	const totalTurnover = Object.values(schedule)
		.flat()
		.reduce(
			(acc, day) =>
				acc + day.guests.reduce((sum, guest) => sum + guest.price, 0),
			0
		)
	const totalExpenses = users.reduce((acc, user) => acc + user.expenses, 0)
	const totalProfit = totalTurnover - totalExpenses
	const totalHours = Object.values(schedule)
		.flat()
		.reduce(
			(acc, day) =>
				acc +
				day.guests.reduce((sum, guest) => sum + calculateHours(guest.time), 0),
			0
		)

	// Per-User Stats Calculation
	const userStats = users.map(user => {
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
		return { name: user.name, turnover, profit, hours, expenses: user.expenses }
	})

	// Chart Data Preparation (by hour for the first date in schedule for simplicity)
	const firstDate = Object.keys(schedule)[0]
	const hourlyData = Array.from({ length: 24 }, (_, i) => ({
		hour: `${i}:00`,
		Оборот: 0,
	}))

	if (schedule[firstDate]) {
		schedule[firstDate].forEach(userDay => {
			userDay.guests.forEach(guest => {
				const startHour = parseInt(guest.time.split(':')[0], 10)
				// For simplicity, attributing the whole price to the start hour
				hourlyData[startHour].Оборот += guest.price
			})
		})
	}

	return (
		<div className='statistics-page'>
			<h1>Статистика</h1>
			<div className='tabs'>
				<button
					className={`tab-btn ${activeTab === 'Общая' ? 'active' : ''}`}
					onClick={() => setActiveTab('Общая')}
				>
					Общая
				</button>
				<button
					className={`tab-btn ${activeTab === 'По юзерам' ? 'active' : ''}`}
					onClick={() => setActiveTab('По юзерам')}
				>
					По юзерам
				</button>
			</div>

			{activeTab === 'Общая' && (
				<div className='stats-content'>
					<div className='stats-cards'>
						<div className='stat-card'>
							<h4>Оборот</h4>
							<p>{totalTurnover.toLocaleString('ru-RU')} ₽</p>
						</div>
						<div className='stat-card'>
							<h4>Прибыль</h4>
							<p>{totalProfit.toLocaleString('ru-RU')} ₽</p>
						</div>
						<div className='stat-card'>
							<h4>Часы</h4>
							<p>{totalHours.toFixed(1)}</p>
						</div>
						<div className='stat-card'>
							<h4>Расходы</h4>
							<p>{totalExpenses.toLocaleString('ru-RU')} ₽</p>
						</div>
					</div>
					<div className='chart-container'>
						<ResponsiveContainer width='100%' height={400}>
							<BarChart data={hourlyData}>
								<CartesianGrid strokeDasharray='3 3' stroke='#333' />
								<XAxis dataKey='hour' stroke='#888' />
								<YAxis stroke='#888' />
								<Tooltip
									contentStyle={{
										backgroundColor: '#1a1a2e',
										border: '1px solid #333',
									}}
								/>
								<Legend />
								<Bar dataKey='Оборот' fill='#8884d8' />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			)}

			{activeTab === 'По юзерам' && (
				<div className='stats-content user-stats-grid'>
					{userStats.map(stat => (
						<div key={stat.name} className='user-stat-card'>
							<h3>{stat.name}</h3>
							<p>
								Оборот: <span>{stat.turnover.toLocaleString('ru-RU')} ₽</span>
							</p>
							<p>
								Прибыль: <span>{stat.profit.toLocaleString('ru-RU')} ₽</span>
							</p>
							<p>
								Часы: <span>{stat.hours.toFixed(1)}</span>
							</p>
							<p>
								Расходы: <span>{stat.expenses.toLocaleString('ru-RU')} ₽</span>
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Statistics

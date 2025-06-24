import React, { useState } from 'react'
import AddTaskModal from '../components/AddTaskModal/AddTaskModal'
import './Tasks.css'

const initialTasks = [
	{ id: 1, title: 'Челлендж на прибыль', participants: 3, progress: 65 },
	{ id: 2, title: 'Конкурс отзывов', participants: 2, progress: 30 },
	{ id: 3, title: 'Марафон продаж', participants: 1, progress: 90 },
]

const Tasks = ({ users }) => {
	const [activeTab, setActiveTab] = useState('Активные')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [tasks, setTasks] = useState(initialTasks)
	const [archivedTasks, setArchivedTasks] = useState([])

	const handleAddTask = task => {
		setTasks([
			...tasks,
			{ id: tasks.length + 1 + archivedTasks.length, ...task, progress: 0 },
		])
		setIsModalOpen(false)
	}

	const handleArchiveTask = taskId => {
		const taskToArchive = tasks.find(t => t.id === taskId)
		if (taskToArchive) {
			setTasks(tasks.filter(t => t.id !== taskId))
			setArchivedTasks([...archivedTasks, taskToArchive])
		}
	}

	return (
		<div className='tasks-page'>
			<div className='tasks-header'>
				<h1>Задания</h1>
				<button className='add-task-btn' onClick={() => setIsModalOpen(true)}>
					Добавить
				</button>
			</div>
			<div className='tabs'>
				<button
					className={`tab-btn ${activeTab === 'Активные' ? 'active' : ''}`}
					onClick={() => setActiveTab('Активные')}
				>
					Активные
				</button>
				<button
					className={`tab-btn ${activeTab === 'Архив' ? 'active' : ''}`}
					onClick={() => setActiveTab('Архив')}
				>
					Архив
				</button>
			</div>

			{activeTab === 'Активные' && (
				<div className='tasks-list'>
					{tasks.map(task => (
						<div key={task.id} className='task-item'>
							<div className='task-info'>
								<h3>{task.title}</h3>
								<span>Участников: {task.participants}</span>
							</div>
							<div className='task-progress'>
								<div className='progress-bar-container'>
									<div
										className='progress-bar'
										style={{ width: `${task.progress}%` }}
									></div>
								</div>
								<span>{task.progress}%</span>
							</div>
							<button
								className='archive-btn'
								onClick={() => handleArchiveTask(task.id)}
							>
								Архивировать
							</button>
						</div>
					))}
				</div>
			)}

			{activeTab === 'Архив' && (
				<div className='tasks-list'>
					{archivedTasks.length > 0 ? (
						archivedTasks.map(task => (
							<div key={task.id} className='task-item archived'>
								<div className='task-info'>
									<h3>{task.title}</h3>
									<span>Участников: {task.participants}</span>
								</div>
								<span>Завершено</span>
							</div>
						))
					) : (
						<p>Архивных заданий нет.</p>
					)}
				</div>
			)}

			{isModalOpen && (
				<AddTaskModal
					onClose={() => setIsModalOpen(false)}
					onAddTask={handleAddTask}
					users={users}
				/>
			)}
		</div>
	)
}

export default Tasks

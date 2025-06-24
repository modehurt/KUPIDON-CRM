import React, { useState } from 'react'
import './Lookup.css'

const Lookup = () => {
	const [activeTab, setActiveTab] = useState('Поиск')
	const [searchQuery, setSearchQuery] = useState('')
	const [lastSearch, setLastSearch] = useState(null)
	const [archivedLookups, setArchivedLookups] = useState([])

	const handleSearch = e => {
		e.preventDefault()
		if (!searchQuery) return
		const result = {
			id: Date.now(),
			query: searchQuery,
			// In a real app, you'd have actual results
			resultData: `Найдены результаты для "${searchQuery}"`,
		}
		setLastSearch(result)
	}

	const handleArchiveSearch = () => {
		if (lastSearch) {
			setArchivedLookups([lastSearch, ...archivedLookups])
			setLastSearch(null)
			setSearchQuery('')
		}
	}

	return (
		<div className='lookup-page'>
			<h1>Пробивка</h1>
			<div className='tabs'>
				<button
					className={`tab-btn ${activeTab === 'Поиск' ? 'active' : ''}`}
					onClick={() => setActiveTab('Поиск')}
				>
					Поиск
				</button>
				<button
					className={`tab-btn ${
						activeTab === 'Архив запросов' ? 'active' : ''
					}`}
					onClick={() => setActiveTab('Архив запросов')}
				>
					Архив запросов
				</button>
			</div>

			{activeTab === 'Поиск' && (
				<div className='lookup-content'>
					<form className='search-form' onSubmit={handleSearch}>
						<input
							type='text'
							placeholder='Номер и ID'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
						<button type='submit'>🔍</button>
					</form>
					{lastSearch && (
						<div className='search-result'>
							<p>{lastSearch.resultData}</p>
							<button onClick={handleArchiveSearch}>Архивировать</button>
						</div>
					)}
				</div>
			)}

			{activeTab === 'Архив запросов' && (
				<div className='lookup-content'>
					{archivedLookups.length > 0 ? (
						<div className='archive-list'>
							{archivedLookups.map(item => (
								<div key={item.id} className='archive-item'>
									<p>
										<strong>Запрос:</strong> {item.query}
									</p>
									<p>
										<strong>Результат:</strong> {item.resultData}
									</p>
								</div>
							))}
						</div>
					) : (
						<p>Архив запросов пуст.</p>
					)}
				</div>
			)}
		</div>
	)
}

export default Lookup

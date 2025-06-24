import React, { useState } from 'react'
import './Chats.css'

const conversations = [
	{
		id: 1,
		name: 'Александр',
		lastMessage: 'Конечно! На какое время вы хот...',
		unread: 0,
		tag: 'Анна',
	},
	{
		id: 2,
		name: 'Мария',
		lastMessage: 'Добрый день! У вас есть свобод...',
		unread: 1,
		tag: 'Анна',
	},
	{
		id: 3,
		name: 'Алексей',
		lastMessage: 'Здравствуйте, можно узнать о в...',
		unread: 1,
		tag: 'Фарм',
	},
]

const Chats = () => {
	const [activeConversation, setActiveConversation] = useState(conversations[0])

	return (
		<div className='chats-page'>
			<div className='dialogs-list'>
				<div className='chats-header'>
					<h1>Чаты</h1>
					<button className='filter-btn'>▼</button>
				</div>
				{conversations.map(conv => (
					<div
						key={conv.id}
						className={`dialog-item ${
							activeConversation.id === conv.id ? 'active' : ''
						}`}
						onClick={() => setActiveConversation(conv)}
					>
						<div className='dialog-info'>
							<p className='dialog-name'>
								{conv.name} <span className='dialog-tag'>{conv.tag}</span>
							</p>
							<p className='dialog-last-message'>{conv.lastMessage}</p>
						</div>
						{conv.unread > 0 && (
							<div className='unread-count'>{conv.unread}</div>
						)}
					</div>
				))}
			</div>
			<div className='message-view'>
				<div className='message-header'>
					<h3>{activeConversation.name}</h3>
					<p>+7 (999) 123-45-67</p>
				</div>
				<div className='message-body'>
					{/* Mock message display */}
					<div className='message-bubble received'>
						<p>{activeConversation.lastMessage}</p>
						<span>14:30</span>
					</div>
					<div className='message-bubble sent'>
						<p>
							Здравствуйте! Да, конечно. Есть свободные окна в 15:00 и 18:00.
							Какое время вам подходит?
						</p>
						<span>14:35</span>
					</div>
				</div>
				<div className='message-input-area'>
					<input type='text' placeholder='Напишите сообщение...' />
					<button>Отправить</button>
				</div>
			</div>
		</div>
	)
}

export default Chats

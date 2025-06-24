export const initialUsers = [
	{
		id: 1,
		name: 'Анна',
		role: 'Пользователь',
		hours: 5,
		turnover: 15000,
		expenses: 1500,
		status: 'Свободна',
		login: 'anna',
		password: 'password1',
	},
	{
		id: 2,
		name: 'Мария',
		role: 'Пользователь',
		hours: 3,
		turnover: 9000,
		expenses: 1500,
		status: 'Ждет гостя',
		login: 'maria',
		password: 'password2',
	},
	{
		id: 3,
		name: 'Елена',
		role: 'Пользователь',
		hours: 6,
		turnover: 18000,
		expenses: 1500,
		status: 'Занята',
		login: 'elena',
		password: 'password3',
	},
	{
		id: 4,
		name: 'Администратор',
		role: 'Администратор',
		status: 'Онлайн',
		login: 'admin',
		password: 'admin',
	},
	{
		id: 5,
		name: 'Менеджер',
		role: 'Менеджер',
		status: 'Онлайн',
		login: 'manager',
		password: 'manager',
	},
]

export const initialTasks = [
	{
		id: 1,
		title: 'Челлендж на прибыль',
		description: 'Набрать 50 000Р прибыли за неделю',
		reward: '5 000Р Бонус',
		progress: 65,
		status: 'активно',
	},
	{
		id: 2,
		title: 'Конкурс отзывов',
		description: 'Собрать 10 положительных отзывов',
		reward: 'Дополнительный выходной',
		progress: 30,
		status: 'активно',
	},
]

export const initialSchedule = {
	'21.06.2025': [
		{
			user: 'Анна',
			guests: [
				{ id: 1, time: '10:00 - 12:00', client: 'Клиент 1', price: 5000 },
			],
		},
		{
			user: 'Мария',
			guests: [
				{ id: 2, time: '14:00 - 16:00', client: 'Клиент 2', price: 3500 },
			],
		},
		{
			user: 'Елена',
			guests: [
				{ id: 3, time: '18:00 - 20:00', client: 'Клиент 3', price: 4000 },
			],
		},
	],
}

import React, { useState } from 'react'
import './Login.css'

const Login = ({ onLogin, error }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		onLogin(username, password)
	}

	return (
		<div className='login-container'>
			<div className='login-box'>
				<div className='login-header'>
					<div className='lock-icon'>🔒</div>
					<h1>KUPIDON CRM</h1>
					<p>Войдите в систему, используя ваши данные</p>
				</div>
				<form onSubmit={handleSubmit} className='login-form'>
					<div className='input-group'>
						<label htmlFor='login'>Логин</label>
						<input
							type='text'
							id='login'
							placeholder='Введите ваш логин'
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
					</div>
					<div className='input-group'>
						<label htmlFor='password'>Пароль</label>
						<input
							type='password'
							id='password'
							placeholder='Введите ваш пароль'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					{error && <p className='error-message'>{error}</p>}
					<button type='submit' className='login-button'>
						Войти
					</button>
				</form>
			</div>
		</div>
	)
}

export default Login

import PropTypes from 'prop-types'
import React, { useState } from 'react'
import './AddExpenseModal.css'

const AddExpenseModal = ({ onClose, onAddExpense, userName }) => {
	const [amount, setAmount] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		const expenseAmount = parseFloat(amount)
		if (isNaN(expenseAmount) || expenseAmount <= 0) {
			alert('Пожалуйста, введите корректную сумму.')
			return
		}
		onAddExpense(expenseAmount)
	}

	return (
		<div className='modal-backdrop'>
			<div className='modal-content'>
				<div className='modal-header'>
					<h2>Добавить расход для {userName}</h2>
					<button onClick={onClose} className='close-btn'>
						&times;
					</button>
				</div>
				<div className='modal-body'>
					<form onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='expense-amount'>Сумма расхода (₽)</label>
							<input
								type='number'
								id='expense-amount'
								value={amount}
								onChange={e => setAmount(e.target.value)}
								placeholder='Введите сумму'
								autoFocus
							/>
						</div>
						<div className='modal-footer'>
							<button type='button' onClick={onClose} className='btn-cancel'>
								Отмена
							</button>
							<button type='submit' className='btn-add'>
								Добавить
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

AddExpenseModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	onAddExpense: PropTypes.func.isRequired,
	userName: PropTypes.string.isRequired,
}

export default AddExpenseModal

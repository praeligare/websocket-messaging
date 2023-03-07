import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
	const navigate = useNavigate();
	const [name, setName] = useState('');

	const logOn = () => {
		if (name !== '') navigate(`/chat/${name}`)
		else alert("We need a name!")
	}

	return (
		<main className='simple-wrapper'>
			<p className='simple-heading'>Hey there</p>
			<p id='name-label' className='simple-subhead'>
				What's your name?
			</p>

			<div className='simple-section'>
				<input aria-labelledby='name-label' type='text' autoComplete='name' placeholder='Your username' value={name} onChange={(event) => setName(event.target.value)} onkeyPress={(event) => { if (event.key === 'Enter') logOn()}} />
			</div>

			<div className='simple-section'>
				<button onClick={logOn}>Start chatting</button>
			</div>
		</main>
	);
};

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const KickedPage = () => {
	const navigate = useNavigate();
	const { state } = useLocation();

	return (
		<main className='simple-wrapper'>
			<p className='simple-heading'>Ono.</p>
			<p className='simple-subhead'>
				You were kicked for {state?.kickReason ?? "mysterious reasons"}.
			</p>

			<div className='simple-selection'>
				<button onClick={() => navigate("/")}>Go back</button>
			</div>
		</main>
	);
};


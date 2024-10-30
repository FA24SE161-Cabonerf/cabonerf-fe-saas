import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
	const navigate = useNavigate();
	return <div onClick={() => navigate('/dashboard')}>BackButton</div>;
}

export default React.memo(BackButton);

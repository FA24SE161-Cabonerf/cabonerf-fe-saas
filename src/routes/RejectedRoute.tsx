import { AppContext } from '@/contexts/app.context';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function RejectedRoute() {
	const {
		app: { isAuthenticated },
	} = useContext(AppContext);

	return isAuthenticated === false ? <Outlet /> : <Navigate to="/" />;
}

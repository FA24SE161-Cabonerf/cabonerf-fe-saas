import Home from '@/pages/Home';
import LoginPage from '@/pages/Login';
import { createBrowserRouter } from 'react-router-dom';

export default function useRouteElements() {
	const routers = createBrowserRouter([
		{
			path: '/',
			element: <Home />,
		},
		{
			path: '/login',
			element: <LoginPage />,
		},
	]);

	return routers;
}

import AuthenticationLayout from '@/layouts/AuthenticationLayout';
import Home from '@/pages/Home';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register/RegisterPage';
import { createBrowserRouter } from 'react-router-dom';

export default function useRouteElements() {
	const routers = createBrowserRouter([
		{
			path: '/',
			element: <Home />,
		},
		{
			path: '/login',
			element: (
				<AuthenticationLayout>
					<LoginPage />
				</AuthenticationLayout>
			),
		},
		{
			path: '/register',
			element: (
				<AuthenticationLayout>
					<RegisterPage />
				</AuthenticationLayout>
			),
		},
	]);

	return routers;
}

import AuthenticationLayout from '@/layouts/AuthenticationLayout';
import MainLayout from '@/layouts/MainLayout';
import DashboardPage from '@/pages/Home';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register/RegisterPage';
import ProtectedRoute from '@/routes/ProtectedRoute';
import RejectedRoute from '@/routes/RejectedRoute';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export default function useRouteElements() {
	const routers = createBrowserRouter([
		{
			path: '',
			element: <ProtectedRoute />,
			children: [
				{
					path: '',
					element: <MainLayout />,
					children: [
						{
							path: '',
							element: <Navigate to="/dashboard" />,
						},
						{
							index: true,
							path: '/dashboard',
							element: <DashboardPage />,
						},
					],
				},
			],
		},
		{
			path: '',
			element: <RejectedRoute />,
			children: [
				{
					path: '',
					element: <AuthenticationLayout />,
					children: [
						{
							path: '/login',
							element: <LoginPage />,
						},
						{
							path: '/register',
							element: <RegisterPage />,
						},
					],
				},
			],
		},
	]);

	return routers;
}

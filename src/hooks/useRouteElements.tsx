import AuthenticationLayout from '@/layouts/AuthenticationLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import SettingLayout from '@/layouts/SettingLayout';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import LoginPage from '@/pages/Login';
import Profile from '@/pages/Profile';
import RegisterPage from '@/pages/Register';
import ProtectedRoute from '@/routes/ProtectedRoute';
import RejectedRoute from '@/routes/RejectedRoute';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export default function useRouteElements() {
	const routers = createBrowserRouter([
		{
			path: '/',
			element: <ProtectedRoute />,
			children: [
				{
					path: '',
					element: <DashboardLayout />,
					children: [
						{
							path: '',
							element: <Navigate to="dashboard" />,
						},
						{
							path: 'dashboard',
							element: <DashboardPage />,
						},
					],
				},
				{
					path: 'settings',
					element: <SettingLayout />,
					children: [
						{
							path: '',
							element: <Navigate to="profile" />,
						},
						{
							path: 'profile',
							element: <Profile />,
						},
					],
				},
			],
		},
		{
			path: '/',
			element: <RejectedRoute />,
			children: [
				{
					path: '',
					element: <AuthenticationLayout />,
					children: [
						{
							path: 'login',
							element: <LoginPage />,
						},
						{
							path: 'register',
							element: <RegisterPage />,
						},
					],
				},
			],
		},
	]);

	return routers;
}

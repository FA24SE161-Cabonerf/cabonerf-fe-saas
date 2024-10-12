import AuthenticationLayout from '@/layouts/AuthenticationLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import SettingLayout from '@/layouts/SettingLayout';
import Chat from '@/pages/Chat';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import LoginPage from '@/pages/Login';
import Profile from '@/pages/Profile';
import Playground from '@/pages/Playground';
import RegisterPage from '@/pages/Register';
import VerifyEmailPage from '@/pages/VerifyEmail';
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
				{
					path: 'chat',
					element: <Chat />,
				},
				{
					path: 'playground',
					element: <Playground />,
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
		{
			path: '/verify-email-token',
			element: <VerifyEmailPage />,
		},
	]);

	return routers;
}

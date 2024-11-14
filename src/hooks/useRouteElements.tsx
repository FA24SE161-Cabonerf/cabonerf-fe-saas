import AuthenticationLayout from '@/layouts/AuthenticationLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import SettingLayout from '@/layouts/SettingLayout';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import LoginPage from '@/pages/Login';
import Playground from '@/pages/Playground';
import ContextMenuProvider from '@/pages/Playground/contexts/contextmenu.context';
import { PlaygroundProvider } from '@/pages/Playground/contexts/playground.context';
import Sheetbar from '@/pages/Playground/contexts/sheetbar.context';
import Profile from '@/pages/Profile';
import RegisterPage from '@/pages/Register';
import VerifyEmailPage from '@/pages/VerifyEmail';
import ProtectedRoute from '@/routes/ProtectedRoute';
import RejectedRoute from '@/routes/RejectedRoute';
import { ReactFlowProvider } from '@xyflow/react';
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
					path: 'playground/:pid/:wid',
					element: (
						<ReactFlowProvider>
							<ContextMenuProvider>
								<PlaygroundProvider>
									<Sheetbar>
										<Playground />
									</Sheetbar>
								</PlaygroundProvider>
							</ContextMenuProvider>
						</ReactFlowProvider>
					),
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

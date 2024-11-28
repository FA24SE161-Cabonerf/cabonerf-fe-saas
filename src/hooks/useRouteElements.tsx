import AuthenticationLayout from '@/layouts/AuthenticationLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import LoginPage from '@/pages/Login';
import ObjectLibrariesPage from '@/pages/ObjectLibraries/ObjectLibrariesPage';
import OrganizationPage from '@/pages/Organization/OrganizationPage';
import Playground from '@/pages/Playground';
import ContextMenuProvider from '@/pages/Playground/contexts/contextmenu.context';
import { PlaygroundProvider } from '@/pages/Playground/contexts/playground.context';
import Sheetbar from '@/pages/Playground/contexts/sheetbar.context';
import ProfilePage from '@/pages/Profile';
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
							index: true,
							element: <DashboardPage />,
						},
						{
							path: 'setting',
							element: <ProfilePage />,
						},
						{
							path: 'organization',
							element: <OrganizationPage />,
						},
						{
							path: 'object-libraries',
							element: <ObjectLibrariesPage />,
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

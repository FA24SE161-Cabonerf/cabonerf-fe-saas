import AuthenticationFooter from '@/layouts/AuthenticationLayout/components/AuthenticationFooter/AuthenticationFooter';
import AuthenticationHeader from '@/layouts/AuthenticationLayout/components/AuthenticationHeader/AuthenticationHeader';
import { Outlet } from 'react-router-dom';

export default function AuthenticationLayout() {
	return (
		<main className="mx-auto max-w-[582px]">
			<AuthenticationHeader />
			<div className="my-10">
				<Outlet />
			</div>
			<AuthenticationFooter />
		</main>
	);
}

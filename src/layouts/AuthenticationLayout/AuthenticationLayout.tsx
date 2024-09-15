import AuthenticationFooter from '@/layouts/AuthenticationLayout/components/AuthenticationFooter/AuthenticationFooter';
import AuthenticationHeader from '@/layouts/AuthenticationLayout/components/AuthenticationHeader/AuthenticationHeader';
import React from 'react';

type tProps = {
	children: React.ReactNode;
};

export default function AuthenticationLayout({ children }: tProps) {
	return (
		<main className="mx-auto max-w-[582px]">
			<AuthenticationHeader />
			<div className="my-10">{children}</div>
			<AuthenticationFooter />
		</main>
	);
}

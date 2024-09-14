import AuthenticationFooter from '@/components/AuthenticationFooter';
import AuthenticationHeader from '@/components/AuthenticationHeader';
import React from 'react';

type tProps = {
	children: React.ReactNode;
};

export default function AuthenticationLayout({ children }: tProps) {
	return (
		<main className="mx-auto max-w-[582px]">
			<AuthenticationHeader />
			<div className="my-20">{children}</div>
			<AuthenticationFooter />
		</main>
	);
}

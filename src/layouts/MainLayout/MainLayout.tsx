import MainHeader from '@/layouts/MainLayout/components/MainHeader';

type tProps = {
	children: React.ReactNode;
};

export default function MainLayout({ children }: tProps) {
	return (
		<div className="bg-backgroundBehide">
			<MainHeader />
			{children}
		</div>
	);
}

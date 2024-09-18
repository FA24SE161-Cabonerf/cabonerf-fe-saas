import MainHeader from '@/layouts/CommonLayout/components/MainHeader';

type tProps = {
	sidebar: React.ReactNode;
	content: React.ReactNode;
};

export default function CommonLayout({ content, sidebar }: tProps) {
	return (
		<div className="flex h-screen bg-backgroundBehide">
			{/* Header */}
			<MainHeader />
			{/* Main */}
			<div className="mt-[54px] h-[calc(100vh-54px)] flex-1">
				<div className="flex h-full overflow-hidden pb-2 pr-2">
					{/* Sidebar */}
					{sidebar}

					{/* Main content */}
					<div className="h-full w-full overflow-scroll rounded-[8px] border-[1px] border-gray-200 bg-white">
						{content}
					</div>
				</div>
			</div>
		</div>
	);
}

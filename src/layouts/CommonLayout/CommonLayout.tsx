import MainHeader from '@/layouts/CommonLayout/components/MainHeader';
type tProps = {
	sidebar: React.ReactNode;
	content: React.ReactNode;
};

export default function CommonLayout({ content, sidebar }: tProps) {
	return (
		<div className="flex h-screen bg-backgroundBehide">
			{/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
				<div className="flex flex-col items-center justify-center rounded-lg bg-white p-10 shadow-lg">
					<h2 className="text-2xl font-medium">Welcome, please verify your email.</h2>
					<div className="mt-5 text-sm">
						We sent an email to <Badge variant="outline">example@gmail.com</Badge> . Once verified, you will
						be able to access your account.
					</div>

					<div className="mt-8 flex w-[70%] flex-wrap justify-center gap-3">
						<Link
							to="https://mail.google.com/mail/u/0/#inbox"
							target="_blank"
							className="flex items-center justify-center space-x-1 rounded-[4px] border px-3 py-1.5"
						>
							<GmailIcon />
							<span>Open Gmail</span>
						</Link>
						<Link
							to="https://mail.google.com/mail/u/0/#inbox"
							target="_blank"
							className="flex items-center justify-center space-x-1 rounded-[4px] border px-3 py-1.5"
						>
							<OutLookIcon />
							<span>Open Outlook</span>
						</Link>
					</div>

					<p className="mt-8 text-sm">
						If you do not see it. You may need to <span className="font-medium">check your spam </span>
						folder or <span className="font-medium underline">Resend the mail</span>
					</p>
				</div>
			</div> */}

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

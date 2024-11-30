export default function SkeletonCard() {
	return (
		<div className="mt-1 flex w-[290px] animate-pulse flex-col rounded-[18px] border-[1px] border-gray-200 p-[6px] shadow">
			{/* Logo Section */}
			<div className="flex h-[140px] items-center justify-center rounded-[12px] bg-[#f7f7f7]">
				<div className="rounded-[38px] border-[0.5px] border-[#edebea] p-3">
					<div className="rounded-[28px] border-[0.5px] border-[#e6e3e2] p-2.5">
						<div className="rounded-[20px] border-[0.7px] border-[#e9e6e5] p-3">
							<div className="h-11 w-11 rounded-full bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>

			{/* Text and Info Section */}
			<div className="mt-2 flex min-h-[110px] flex-col items-start justify-between space-y-3 px-2">
				{/* Title and Method */}
				<div className="space-y-2">
					<div className="h-5 w-3/4 rounded-md bg-gray-300"></div>
					<div className="h-4 w-1/2 rounded-md bg-gray-300"></div>
				</div>

				{/* Owner and Date */}
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center space-x-1">
						<div className="h-5 w-5 rounded-full bg-gray-300"></div>
						<div className="h-4 w-16 rounded-md bg-gray-300"></div>
						<div className="h-3 w-3 rounded-full bg-gray-300"></div>
						<div className="h-4 w-20 rounded-md bg-gray-300"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

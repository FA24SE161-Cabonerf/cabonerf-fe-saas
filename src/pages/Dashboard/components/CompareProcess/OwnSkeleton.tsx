import { Skeleton } from '@/components/ui/skeleton';

const OwnSkeleton = () => (
	<div className="flex w-full gap-3">
		{/* Left Panel */}
		<div className="mb-2 flex h-full max-h-full w-[28%] flex-col space-y-3">
			{Array(5)
				.fill(0)
				.map((_, index) => (
					<Skeleton key={index} className="h-[250px] rounded-md bg-stone-100 p-3" />
				))}
		</div>

		{/* Middle Panel */}
		<div className="w-[44%] gap-3">
			<div className="flex w-full justify-between gap-3">
				<Skeleton className="h-[140px] w-full rounded-md bg-stone-100 p-3" />
				<Skeleton className="h-[140px] w-full rounded-md bg-stone-100 p-3" />
			</div>
			<Skeleton className="mt-3 h-full w-full rounded-md bg-stone-100 p-3" />
		</div>

		<div className="mb-2 flex h-full max-h-full w-[28%] flex-col space-y-3">
			{Array(5)
				.fill(0)
				.map((_, index) => (
					<Skeleton key={index} className="h-[250px] rounded-md bg-stone-100 p-3" />
				))}
		</div>
	</div>
);
export default OwnSkeleton;

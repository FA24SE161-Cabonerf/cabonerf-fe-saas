import ExcelIcon from '@/common/icons/ExcelIcon';

type Props = {
	isShareMenu: boolean;
};

export default function MenuExport({ isShareMenu }: Props) {
	return (
		<div
			className={`w-full transform overflow-hidden border-gray-100 px-3 duration-300 ${
				isShareMenu ? 'h-[230px] rounded-t-2xl border-b-[0.5px] bg-zinc-100 py-4' : 'h-0'
			}`}
		>
			<div className="flex h-full gap-4">
				<div className="flex h-full w-full flex-col items-center justify-center rounded-md border-[0.5px] border-gray-200 bg-white duration-100 hover:outline hover:outline-2 hover:outline-black/80">
					<ExcelIcon />
					<h3 className="mt-4 text-base">Export</h3>
					<span className="max-w-28 text-center text-xs">Exporting your data to Excel</span>
				</div>
				<div className="flex h-full w-full flex-col items-center justify-center rounded-md border-[0.5px] border-gray-200 bg-white duration-100 hover:outline hover:outline-2 hover:outline-black/80">
					<ExcelIcon />
					<h3 className="mt-4 text-base">Export</h3>
					<span className="max-w-28 text-center text-xs">Exporting your data to Excel</span>
				</div>
			</div>
		</div>
	);
}

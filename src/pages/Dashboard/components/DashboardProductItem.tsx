import logo from '@/assets/logos/rounded-logo.png';

export default function DashboardProductItem() {
	return (
		<div className="min-h-[100px] min-w-[250px] rounded-md shadow">
			<div className="p-5">
				<img src={logo} className="w-6" />

				<div className="mt-3 font-semibold">name</div>
			</div>
		</div>
	);
}

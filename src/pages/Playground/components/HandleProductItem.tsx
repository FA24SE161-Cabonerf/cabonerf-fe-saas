import { Exchange, Unit } from '@/@types/exchange.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';
import { Unplug } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
	data: Exchange;
	isReverse?: boolean;
};

function HandleProductItem({ data, isReverse = false }: Props) {
	const [valueProduct, setValueProduct] = useState<string>(String(data.value));
	const [nameProduct, setNameProduct] = useState<string>(data.name);
	const [unitProduct, setUnitProduct] = useState<Unit>(data.unit);
	const [isUpdate, setIsUpdate] = useState<boolean>(false);

	const { data: unit } = useQuery({
		queryKey: ['unit-group', data.unit.unitGroup.id],
		queryFn: ({ queryKey }) => ExchangeApis.prototype.getUnitsByUnitGroupId({ id: queryKey[1] }),
	});

	useEffect(() => {
		setNameProduct(data.name);
		setUnitProduct(data.unit);
		setValueProduct(String(data.value));
	}, [data.name, data.unit, data.value]);

	useEffect(() => {
		setIsUpdate(data.value !== Number(valueProduct) || nameProduct !== data.name || unitProduct.id !== data.unit.id);
	}, [data.name, data.unit.id, data.value, nameProduct, unitProduct.id, valueProduct]);

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setNameProduct(value);
	};

	const handleChangeValueProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const newValue = value === '' ? '0' : value;

		const sanitizedValue = newValue.replace(/^0+(?=\d)/, '');

		if (/^\d+(\.\d+)?$/.test(sanitizedValue) || sanitizedValue === '0') {
			setValueProduct(sanitizedValue);
		}
	};

	const handleChangeUnit = ({ unit }: { unit: Unit }) => {
		const calculatedValue = data.value * (unit.conversionFactor / data.unit.conversionFactor);

		setValueProduct(String(calculatedValue));
		setUnitProduct(unit);
	};

	return (
		<div
			className={clsx(`relative border-b-[0.5px] border-r-[0.5px] border-t-[0.5px] py-[1px] pl-3 pr-2`, {
				'rounded-r-xl border-[0.5px] border-l-0': isReverse === false,
				'rounded-l-xl border-[0.5px] border-r-0': isReverse === true,
			})}
		>
			{isUpdate && <div>UPDATE DI</div>}

			<Handle
				className={clsx(`absolute h-[70%] w-[5px] rounded-none border-none bg-gray-200`, {
					'left-[2px] rounded-br rounded-tr': isReverse === false,
					'right-[2px] rounded-bl rounded-tl': isReverse === true,
				})}
				id={data.id}
				position={isReverse ? Position.Right : Position.Left}
				type={isReverse ? 'source' : 'target'}
			/>
			{/* Exchange Name */}
			<div
				className={clsx(`flex items-center justify-between`, {
					'flex-row-reverse': isReverse,
				})}
			>
				<div className="flex w-[80%] flex-col space-y-0">
					<input
						type="text"
						value={nameProduct}
						onChange={handleChangeName}
						className="w-full rounded-[2px] px-1 text-[11px] outline-none transition-all focus:bg-white"
					/>
					<div className="flex w-full items-center space-x-2">
						<input
							value={valueProduct}
							onChange={handleChangeValueProduct}
							type="text"
							className="w-[40%] rounded-[2px] px-1 text-[11px] outline-none transition-all focus:bg-white"
						/>
						<DropdownMenu>
							<DropdownMenuTrigger className="w-fit rounded p-0.5 text-[11px] font-semibold hover:bg-gray-50">
								{unitProduct.name}
							</DropdownMenuTrigger>

							<DropdownMenuContent className="w-[270px] rounded-md border border-gray-200 p-0 shadow-lg">
								<div className="relative h-[300px] overflow-y-auto scroll-smooth bg-white">
									<div className="sticky top-0 z-20 grid grid-cols-12 rounded-t-md border-b border-gray-200 bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
										<div className="col-span-4">Unit</div>
										<div className="col-span-5">Value</div>
										<div className="col-span-3 text-right">Default</div>
									</div>
									<div className="p-2">
										{unit?.data.data.map((item, index) => (
											<DropdownMenuItem
												onClick={() => handleChangeUnit({ unit: item })}
												key={index}
												className="grid cursor-pointer grid-cols-12 items-center rounded-sm px-2 py-1 text-sm text-gray-600 transition-all duration-150 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none"
												aria-label={`Select unit ${item.name}`}
											>
												<div className="col-span-4 font-medium text-gray-700">{item.name}</div>
												<div className="col-span-5 text-gray-600">= {item.conversionFactor}</div>
												<div className="col-span-3 text-right text-gray-500">kg</div>
											</DropdownMenuItem>
										))}
									</div>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<button className="flex items-center justify-center rounded p-0.5 transition duration-150 ease-in-out hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500">
					<Unplug size={10} color="red" />
				</button>
			</div>
		</div>
	);
}

export default React.memo(HandleProductItem);

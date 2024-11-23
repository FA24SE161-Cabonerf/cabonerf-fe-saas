import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { Exchange, Unit } from '@/@types/exchange.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import { UnitApis } from '@/apis/unit.apis';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { Handle, Position, useConnection } from '@xyflow/react';
import clsx from 'clsx';
import { ChevronLeft, Unplug } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

type Props = {
	data: Exchange;
	isReverse?: boolean;
};

function HandleProductItem({ data, isReverse = false }: Props) {
	const { fromNode, fromHandle, toNode, toHandle } = useConnection();
	const [valueProduct, setValueProduct] = useState<string>(String(data.value));
	const [nameProduct, setNameProduct] = useState<string>(data.name);
	const [unitProduct, setUnitProduct] = useState<Unit>(data.unit);
	const [isUpdate, setIsUpdate] = useState<boolean>(false);
	const [defaultUnitGroup, setDefaultUnitGroup] = useState<string>(data.unit.unitGroup.id);

	const isValidUnitGroup = useMemo(() => {
		if (!fromNode?.data || !toNode?.data || !fromHandle?.id || !toHandle?.id) {
			return false;
		}

		const { exchanges: sourceExchanges } = fromNode.data as CabonerfNodeData;
		const { exchanges: targetExchanges } = toNode.data as CabonerfNodeData;

		const sourceExchange = sourceExchanges?.find(({ id }) => id === fromHandle.id);
		const targetExchange = targetExchanges?.find(({ id }) => id === toHandle.id);

		if (!sourceExchange || !targetExchange) {
			return false;
		}

		const sameUnitGroup = sourceExchange.unit?.unitGroup?.id === targetExchange.unit?.unitGroup?.id;
		const sameName = sourceExchange.name === targetExchange.name;

		return sameUnitGroup && sameName;
	}, [fromNode, fromHandle, toNode, toHandle]);

	const { data: unit, isFetching: isFetchingUnit } = useQuery({
		queryKey: ['unit-group', defaultUnitGroup],
		queryFn: ({ queryKey }) => ExchangeApis.prototype.getUnitsByUnitGroupId({ id: queryKey[1] }),
	});

	const { data: unitGroup } = useQuery({
		queryKey: ['unit-groups'],
		queryFn: UnitApis.prototype.getAllUnitGroup,
		staleTime: 1_000 * 60 * 60,
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
			className={clsx(`relative border-b-[0.5px] border-t-[0.5px] py-[1px] pl-3 pr-2`, {
				'rounded-r-xl border-[0.5px] border-l-0': isReverse === false,
				'rounded-l-xl border-[0.5px] border-r-0': isReverse === true,
			})}
		>
			{isUpdate && <div>UPDATE DI</div>}

			<Handle
				isConnectableEnd={isValidUnitGroup}
				className={clsx(`overf absolute rounded-full`, {
					'-left-[1px] size-[9px] border-[2px] border-green-500 bg-white ring-[3px] ring-[#f4f3f3]': isReverse === false,
					'-right-[2px] size-[9px] border-[2px] border-green-500 bg-green-500 ring-[3px] ring-[#f4f3f3]': isReverse === true,
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
						id={`name${data.id}`}
						name="nameproduct"
						type="text"
						onBlur={() => console.log('Blur')}
						value={nameProduct}
						onChange={handleChangeName}
						className="w-full rounded-[2px] px-1 text-[11px] outline-none transition-all focus:bg-white"
					/>
					<div className="flex w-full items-center space-x-1">
						<input
							id={`value${data.id}`}
							name="value"
							value={valueProduct}
							onChange={handleChangeValueProduct}
							type="text"
							className="w-[40%] rounded-[2px] px-1 text-[11px] outline-none transition-all focus:bg-white"
						/>
						<DropdownMenu>
							<DropdownMenuTrigger className="w-fit rounded p-0.5 px-2 text-[11px] font-semibold hover:bg-gray-50">
								{unitProduct.name}
							</DropdownMenuTrigger>

							<DropdownMenuContent className="w-[290px] rounded-md border border-gray-200 p-0 shadow-lg">
								<div className="relative scroll-smooth bg-white">
									<div className="sticky top-0 z-20 grid grid-cols-12 rounded-t-md border-b border-gray-200 bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
										<div className="col-span-4">Unit</div>
										<div className="col-span-5">Value</div>
										<div className="col-span-3 text-right">Default</div>
									</div>
									<div className="h-[300px] overflow-y-auto p-2">
										{unit?.data.data.map((item, index) => (
											<DropdownMenuItem
												onClick={() => handleChangeUnit({ unit: item })}
												key={index}
												className="grid cursor-pointer grid-cols-12 items-center rounded-sm px-2 py-1 text-[12px] text-gray-600 transition-all duration-150 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none"
												aria-label={`Select unit ${item.name}`}
											>
												<div className="col-span-5 font-medium text-gray-700">{item.name}</div>
												<div className="col-span-4 text-gray-600">= {item.conversionFactor}</div>
												<div className="col-span-3 text-right text-gray-500">kg</div>
											</DropdownMenuItem>
										))}
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger className="mx-auto mb-1 flex items-center justify-between rounded px-3 py-1 hover:bg-[#f0f0f0]">
											<ChevronLeft size={15} />
											<div className="text-[13px]">Select unit group</div>
										</DropdownMenuTrigger>

										<DropdownMenuContent side="left">
											<DropdownMenuLabel className="text-[13px]">Select unit group</DropdownMenuLabel>
											{unitGroup?.data.data.map((unit_group) => (
												<DropdownMenuItem key={unit_group.id} onClick={() => setDefaultUnitGroup(unit_group.id)}>
													<div className="col-span-4 font-medium text-gray-700">{unit_group.name}</div>
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
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

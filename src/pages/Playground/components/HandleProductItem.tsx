import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { Exchange, Unit } from '@/@types/exchange.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import { UnitApis } from '@/apis/unit.apis';
import ErrorSooner from '@/components/ErrorSooner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { isUnprocessableEntity } from '@/utils/error';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Handle, Node, Position, useConnection, useReactFlow } from '@xyflow/react';
import clsx from 'clsx';
import { ChevronLeft, Unplug } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = {
	data: Exchange;
	isReverse?: boolean;
	processId: string;
	library: boolean;
	bgColor: string;
};

function HandleProductItem({ processId, data, library, isReverse = false, bgColor }: Props) {
	const { setNodes } = useReactFlow<Node<CabonerfNodeData>>();

	const { fromNode, fromHandle, toNode, toHandle } = useConnection();

	const [isUpdate, setIsUpdate] = useState<boolean>(false);

	const [unitExchange, setUnitExchange] = useState<Unit>(data.unit);
	const [valueExchange, setValueExchange] = useState<string>(String(data.value));
	const [nameProduct, setNameProduct] = useState<string>(data.name);

	const handleItemRef = useRef<HTMLDivElement>(null);

	const [defaultUnitGroup, setDefaultUnitGroup] = useState<string>(data.unit.unitGroup.id);

	useEffect(() => {
		setIsUpdate(data.value !== Number(valueExchange) || nameProduct !== data.name || unitExchange.id !== data.unit.id);
	}, [data.name, data.unit.id, data.value, nameProduct, unitExchange.id, valueExchange]);

	useEffect(() => {
		if (data.unit || data.name || data.value) {
			setValueExchange(String(data.value));
			setNameProduct(data.name);
			setUnitExchange(data.unit);
		}
	}, [data.unit, data.name, data.value]);

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setNameProduct(value);
	};
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

	const { data: unit } = useQuery({
		queryKey: ['unit-group', defaultUnitGroup],
		queryFn: ({ queryKey }) => ExchangeApis.prototype.getUnitsByUnitGroupId({ id: queryKey[1] }),
	});

	const updateProductExchangeMutate = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: { processId: string; unitId: string; value: number; name: string } }) =>
			ExchangeApis.prototype.updateProductExchange(id, payload),
	});

	const { data: unitGroup } = useQuery({
		queryKey: ['unit-groups'],
		queryFn: UnitApis.prototype.getAllUnitGroup,
		staleTime: 1_000 * 60 * 60,
	});

	const handleChangeValueExchange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		const newValue = value === '' ? '0' : value;

		const sanitizedValue = newValue.replace(/^0+(?=\d)/, '');

		if (/^\d*(\.\d*)?$/.test(sanitizedValue)) {
			setValueExchange(sanitizedValue);
		}
	};

	const handleChangeUnit = ({ unit }: { unit: Unit }) => {
		// Use initialValue as the base for recalculations
		const calculatedValue = data.value * (unit.conversionFactor / data.unit.conversionFactor);

		setValueExchange(String(calculatedValue));
		setUnitExchange(unit);

		const updatedProductItem: { processId: string; unitId: string; value: number; name: string } = {
			processId: processId,
			name: nameProduct,
			unitId: unit.id,
			value: Number(calculatedValue),
		};

		updateProductExchangeMutate.mutate(
			{
				id: data.id,
				payload: updatedProductItem,
			},
			{
				onSuccess: (data) => {
					const newProcess = data.data.data; //{processId: string, exchange: Exchange}[]
					const newExchangesMap = new Map(newProcess.map((ex) => [ex.processId, ex.exchange]));

					setNodes((nodes) => {
						return nodes.map((node) => {
							if (newExchangesMap.has(node.id)) {
								const newExchange = newExchangesMap.get(node.id);

								const updateExchange = (node.data.exchanges as Exchange[]).map((ex) => {
									if (ex.id === newExchange?.id) {
										return newExchange;
									}
									return ex;
								});

								const _newProcess = {
									...node,
									data: {
										...node.data,
										exchanges: updateExchange,
									},
								};
								return _newProcess;
							}
							return node;
						});
					});
				},
				onError: (err) => {
					if (isUnprocessableEntity<{ data: null; message: string; status: string }>(err)) {
						setUnitExchange(data.unit);
						toast(<ErrorSooner message={err.response?.data.message ?? ''} />, {
							className: 'rounded-2xl p-1.5 ',
							style: {
								border: `1px solid #dedede`,
								backgroundColor: `#fff`,
							},
						});
					}
				},
			}
		);
	};

	const handleBlur = (event: React.FocusEvent<HTMLDivElement, Element>) => {
		if (handleItemRef.current && handleItemRef.current.contains(event.relatedTarget)) {
			return;
		}

		if (isUpdate) {
			const updatedProductItem: { processId: string; unitId: string; value: number; name: string } = {
				processId: processId,
				name: nameProduct,
				unitId: unitExchange.id,
				value: Number(valueExchange),
			};

			updateProductExchangeMutate.mutate(
				{
					id: data.id,
					payload: updatedProductItem,
				},
				{
					onSuccess: (data) => {
						const newProcess = data.data.data; //{processId: string, exchange: Exchange}[]
						const newExchangesMap = new Map(newProcess.map((ex) => [ex.processId, ex.exchange]));

						setNodes((nodes) => {
							return nodes.map((node) => {
								if (newExchangesMap.has(node.id)) {
									const newExchange = newExchangesMap.get(node.id);

									const updateExchange = (node.data.exchanges as Exchange[]).map((ex) => {
										if (ex.id === newExchange?.id) {
											return newExchange;
										}
										return ex;
									});

									const _newProcess = {
										...node,
										data: {
											...node.data,
											exchanges: updateExchange,
										},
									};
									return _newProcess;
								}
								return node;
							});
						});
					},
					onError: (err) => {
						if (isUnprocessableEntity<{ data: null; message: string; status: string }>(err)) {
							setNameProduct(data.name);
							toast(<ErrorSooner message={err.response?.data.message ?? ''} />, {
								className: 'rounded-2xl p-1.5 ',
								style: {
									border: `1px solid #dedede`,
									backgroundColor: `#fff`,
								},
							});
						}
					},
				}
			);
			return;
		}
	};

	return (
		<div
			className={clsx(`relative bg-gray-100 bg-opacity-20 py-[2px] pl-3 pr-2`, {
				'rounded-r-xl': isReverse === false,
				'rounded-l-xl': isReverse === true,
			})}
		>
			{updateProductExchangeMutate.isPending && (
				<div
					className={clsx(`absolute inset-0 flex items-center justify-center bg-gray-200 opacity-45`, {
						'rounded-r-[11px]': isReverse === false,
						'rounded-l-[11px]': isReverse === true,
					})}
				>
					<ReloadIcon className="h-4 w-4 animate-spin text-gray-800" />
				</div>
			)}

			<Handle
				isConnectableEnd={isValidUnitGroup}
				className={clsx(`overf absolute size-[6px] rounded-full ring-[2px] ring-[#f4f3f3]`)}
				style={{
					border: `2px solid ${bgColor}`,
					backgroundColor: isReverse ? bgColor : '#fff',
					boxShadow: `0 0 0 3px ${isReverse}`,
				}}
				id={data.id}
				position={isReverse ? Position.Right : Position.Left}
				type={isReverse ? 'source' : 'target'}
			/>
			{/* Exchange Name */}
			<div
				ref={handleItemRef}
				className={clsx(`flex items-center justify-between`, {
					'flex-row-reverse': isReverse,
				})}
			>
				<div className="flex w-[80%] flex-col space-y-0">
					<input
						id={`name${data.id}`}
						type="text"
						onBlur={handleBlur}
						value={nameProduct}
						disabled={library}
						onChange={handleChangeName}
						className="w-full rounded-[2px] bg-transparent px-1 text-[11px] font-medium text-white outline-none transition-all focus:bg-white focus:text-black disabled:bg-transparent"
					/>
					<div className="flex w-full items-center space-x-1">
						<input
							type="text"
							id={`value${data.id}`}
							value={valueExchange}
							disabled={library}
							onChange={handleChangeValueExchange}
							onBlur={handleBlur}
							className="w-[40%] rounded-[2px] bg-transparent px-1 text-[11px] font-medium text-white outline-none transition-all focus:bg-white focus:text-black disabled:bg-transparent"
						/>
						<DropdownMenu>
							<DropdownMenuTrigger
								disabled={library}
								className="w-fit rounded p-0.5 px-2 text-[11px] font-semibold text-white hover:bg-gray-50 hover:bg-opacity-10 focus:outline-none disabled:bg-transparent"
							>
								{unitExchange.name}
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
												key={index}
												onClick={() => handleChangeUnit({ unit: item })}
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
										<DropdownMenuTrigger className="mx-auto mb-1 flex items-center justify-between rounded px-3 py-1 text-black hover:bg-[#f0f0f0]">
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
				<button className="flex items-center justify-center rounded p-0.5 transition duration-150 ease-in-out hover:bg-gray-100 hover:bg-opacity-20 focus:outline-none">
					<Unplug size={10} color="white" />
				</button>
			</div>
		</div>
	);
}

export default React.memo(HandleProductItem);

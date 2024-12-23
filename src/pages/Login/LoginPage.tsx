import { CommonResponse } from '@/@types/common.type';
import { eDispatchType } from '@/@types/dispatch.type';
import { authenticationApis } from '@/apis/authentication.apis';
import { OrganizeApis } from '@/apis/organiza.apis';
import ButtonSubmitForm from '@/components/ButtonSubmitForm';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TAB_TITLES from '@/constants/tab.titles';
import { AppContext } from '@/contexts/app.context';
import { loginSchema, tLoginSchema } from '@/schemas/validation/login.schema';
import { isUnauthorization } from '@/utils/error';
import { saveCurrentOrganizationToLocalStorage } from '@/utils/local_storage';
import { disableCopyPaste } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const navigate = useNavigate();
	const { dispatch } = useContext(AppContext);
	const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

	const form = useForm<tLoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: 'qminh.workmode@gmail.com',
			password: '0886751110@Minh',
		},
		mode: 'onSubmit',
	});

	useEffect(() => {
		document.title = TAB_TITLES.LOGIN;
	}, []);

	const loginMutation = useMutation({
		mutationFn: authenticationApis.login,
	});

	const organizations = useQuery({
		queryKey: ['organizations'],
		queryFn: OrganizeApis.prototype.getOrganizationsByUser,
		enabled: false,
		staleTime: 60 * 1000 * 60,
	});

	const onSubmit: SubmitHandler<tLoginSchema> = (data) => {
		toast.promise(
			new Promise((resolve, reject) => {
				loginMutation.mutate(data, {
					onSuccess: async (success) => {
						const { user } = success.data.data;

						const refetchResult = await organizations.refetch();

						const orgData = refetchResult.data?.data.data;

						const defaultOrg = orgData?.find((item) => item.default === true);

						if (defaultOrg) {
							saveCurrentOrganizationToLocalStorage({ orgId: defaultOrg.id, orgName: defaultOrg.name });

							navigate(`/dashboard/${defaultOrg.id}`);
						} else {
							console.error('No default organization found');
						}

						// Dispatch login state
						dispatch({
							type: eDispatchType.LOGIN,
							payload: {
								isAuthenticated: true,
								userProfile: user,
								currentOrganization: {
									orgId: defaultOrg?.id as string,
									orgName: defaultOrg?.name as string,
								},
							},
						});

						resolve(true);
					},
					onError: (error) => {
						if (isUnauthorization<CommonResponse<tLoginSchema>>(error)) {
							const formError = error.response?.data.data;

							if (formError) {
								Object.keys(formError).forEach((key) => {
									reject(formError[key as keyof tLoginSchema] as string);
								});
							}
						} else {
							reject(error.message);
						}
					},
				});
			}),
			{
				loading: 'Establishing a secure connection...',
				success: (
					<p>
						Welcome to <b>Cabonerf</b>.
					</p>
				),
				error: (msg) => <p>{msg}</p>,
			},
			{ position: 'top-center' }
		);
	};

	const toggleShowPassword = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
		event.preventDefault();
		setIsVisiblePassword((prev) => !prev);
	};

	return (
		<div className="">
			{/* Title */}
			<div className="pb-10 pt-24">
				<h1 className="text-center text-4xl font-semibold">Let's Begin LCA</h1>
			</div>

			<div className="mx-auto max-w-[60%]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-0">
									<FormControl>
										<Input
											className="h-14 rounded-[6px] text-base font-light placeholder:text-base placeholder:font-light placeholder:tracking-[0.015em]"
											placeholder="Email address*"
											{...field}
										/>
									</FormControl>

									<div className="mt-[1px] min-h-[1.5rem]">
										{form.formState.errors.email?.message && (
											<span className="text-xs text-red-600">{form.formState.errors.email?.message}</span>
										)}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="space-y-0">
									<FormControl>
										<div className="relative">
											<Input
												type={isVisiblePassword ? 'text' : 'password'}
												className="h-14 rounded-[6px] text-base font-light placeholder:text-base placeholder:font-light placeholder:tracking-[0.015em]"
												placeholder="Password*"
												onCopy={disableCopyPaste}
												onPaste={disableCopyPaste}
												{...field}
											/>
											<span
												onClick={toggleShowPassword}
												className="absolute inset-y-0 right-2 m-0 flex items-center p-0 text-sm text-gray-500"
											>
												{isVisiblePassword ? (
													<TooltipWrapper delayDuration={200} tooltipContent="Hide" className="rounded-sm">
														<Eye />
													</TooltipWrapper>
												) : (
													<TooltipWrapper tooltipContent="Show" className="rounde-sm" delayDuration={200}>
														<EyeOff />
													</TooltipWrapper>
												)}
											</span>
										</div>
									</FormControl>
									<div className="mt-[1px] min-h-[1.5rem]">
										{form.formState.errors.password?.message && (
											<span className="text-xs text-red-600">{form.formState.errors.password?.message}</span>
										)}
									</div>
								</FormItem>
							)}
						/>
						<ButtonSubmitForm
							className="h-12 w-full rounded-[6px] text-base font-normal"
							isPending={loginMutation.isPending}
							title="Login"
							pendingTitle="Logging in..."
						/>
					</form>

					<div className="my-4 text-center text-sm font-normal">
						Don't have an account ?
						<Link className="ml-2 text-primary-green" to="/register">
							Create one
						</Link>
					</div>

					{/* <div className="my-5 flex items-center">
						<div className="flex-grow border-t border-gray-300"></div>
						<span className="mx-4 text-xs text-gray-500">OR</span>
						<div className="flex-grow border-t border-gray-300"></div>
					</div>

					<Button variant="outline" className="flex h-14 w-full items-center justify-center space-x-2 rounded-[6px]">
						<GoogleIcon className="h-6 w-6" />
						<span className="text-base font-normal">Continue with google</span>
					</Button> */}
				</Form>
			</div>
		</div>
	);
}

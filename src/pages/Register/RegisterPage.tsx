import { CommonResponse } from '@/@types/common.type';
import { eDispatchType } from '@/@types/dispatch.type';
import { authenticationApis } from '@/apis/authentication.apis';
import GoogleIcon from '@/common/icons/GoogleIcon';
import ButtonSubmitForm from '@/components/ButtonSubmitForm';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TAB_TITLES from '@/constants/tab.titles';
import { AppContext } from '@/contexts/app.context';
import { registerSchema, tRegisterSchema } from '@/schemas/validation/register.schema';
import { isUnprocessableEntity } from '@/utils/error';
import { disableCopyPaste } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
	const { dispatch } = useContext(AppContext);
	const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

	const form = useForm<tRegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
			fullName: '',
		},
	});

	useEffect(() => {
		document.title = TAB_TITLES.REGISTER;
	}, []);

	const registerMutation = useMutation({
		mutationFn: authenticationApis.register,
	});

	const onSubmit: SubmitHandler<tRegisterSchema> = (data) => {
		toast.promise(
			new Promise((resolve, reject) => {
				registerMutation.mutate(data, {
					onSuccess: (success) => {
						const { user } = success.data.data;

						dispatch({
							type: eDispatchType.REGISTER,
							payload: {
								isAuthenticated: true,
								userProfile: user,
							},
						});
						resolve(true);
					},
					onError: (error) => {
						if (isUnprocessableEntity<CommonResponse<tRegisterSchema>>(error)) {
							const formError = error.response?.data.data;

							if (formError) {
								Object.keys(formError).forEach((key) => {
									form.setError(key as keyof tRegisterSchema, {
										message: formError[key as keyof tRegisterSchema],
										type: 'Server',
									});
									reject(formError[key as keyof tRegisterSchema] as string);
								});
							}
						} else {
							reject(error.message);
						}
					},
				});
			}),
			{
				loading: 'Creating your account, please wait...',
				success: (
					<p>
						Welcome to <b>Cabonerf</b>.
					</p>
				),
				error: (msg) => {
					return <p>{msg}</p>;
				},
			},
			{ position: 'top-center' }
		);
	};

	const toggleShowPassword = () => {
		setIsVisiblePassword((prev) => !prev);
	};

	return (
		<div className="">
			{/* Title */}
			<div className="pb-10 pt-24">
				<h1 className="text-center text-4xl font-semibold">Create an account</h1>
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
											<span className="text-xs text-red-600">{form.formState.errors.email.message}</span>
										)}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem className="space-y-0">
									<FormControl>
										<Input
											className="h-14 rounded-[6px] text-base font-light placeholder:text-base placeholder:font-light placeholder:tracking-[0.015em]"
											placeholder="Full name*"
											{...field}
										/>
									</FormControl>

									<div className="mt-[1px] min-h-[1.5rem]">
										{form.formState.errors.fullName?.message && (
											<span className="text-xs text-red-600">{form.formState.errors.fullName.message}</span>
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
											<button
												onClick={toggleShowPassword}
												type="button"
												className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500"
											>
												{isVisiblePassword ? <Eye /> : <EyeOff />}
											</button>
										</div>
									</FormControl>

									<div className="mt-[1px] min-h-[1.5rem]">
										{form.formState.errors.password?.message && (
											<span className="text-xs text-red-600">{form.formState.errors.password.message}</span>
										)}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem className="space-y-0">
									<FormControl>
										<Input
											type="password"
											className="h-14 rounded-[6px] text-base font-light placeholder:text-base placeholder:font-light placeholder:tracking-[0.015em]"
											placeholder="Confirm password*"
											onCopy={disableCopyPaste}
											onPaste={disableCopyPaste}
											{...field}
										/>
									</FormControl>

									<div className="mt-[1px] min-h-[1.5rem]">
										{form.formState.errors.confirmPassword?.message && (
											<span className="text-xs text-red-600">{form.formState.errors.confirmPassword.message}</span>
										)}
									</div>
								</FormItem>
							)}
						/>

						<ButtonSubmitForm
							isPending={registerMutation.isPending}
							title="Register"
							className="h-12 w-full rounded-[6px] text-base font-normal"
							pendingTitle="Registering..."
						/>
					</form>

					<div className="my-4 text-center text-sm font-normal">
						Already have an account ?
						<Link className="ml-2 text-primary-green" to="/login">
							Login
						</Link>
					</div>

					<div className="my-5 flex items-center">
						<div className="flex-grow border-t border-gray-300"></div>
						<span className="mx-4 text-xs text-gray-500">OR</span>
						<div className="flex-grow border-t border-gray-300"></div>
					</div>

					<Button variant="outline" className="flex h-14 w-full items-center justify-center space-x-2 rounded-[6px]">
						<GoogleIcon className="h-6 w-6" />
						<span className="text-base font-normal">Continue with google</span>
					</Button>
				</Form>
			</div>
		</div>
	);
}

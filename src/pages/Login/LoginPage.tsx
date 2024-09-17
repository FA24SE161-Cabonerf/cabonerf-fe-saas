import GoogleIcon from '@/common/icons/google-icon';
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TAB_TITLES from '@/constants/tab.titles';
import { loginSchema, tLoginSchema } from '@/schemas/validation/login.schema';
import { disableCopyPaste } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
export default function LoginPage() {
	const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

	const form = useForm<tLoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		document.title = TAB_TITLES.LOGIN;
	}, []);

	const onSubmit: SubmitHandler<tLoginSchema> = (data) => {
		console.log(import.meta.env.VITE_BASE_URL);
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
											<span className="text-xs text-red-600">
												{form.formState.errors.email?.message}
											</span>
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
													<TooltipWrapper
														delayDuration={200}
														tooltipContent="Hide"
														className="rounded-sm"
													>
														<Eye />
													</TooltipWrapper>
												) : (
													<TooltipWrapper
														tooltipContent="Show"
														className="rounde-sm"
														delayDuration={200}
													>
														<EyeOff />
													</TooltipWrapper>
												)}
											</span>
										</div>
									</FormControl>
									<div className="mt-[1px] min-h-[1.5rem]">
										{form.formState.errors.password?.message && (
											<span className="text-xs text-red-600">
												{form.formState.errors.password?.message}
											</span>
										)}
									</div>
								</FormItem>
							)}
						/>
						<Button className="mt-3 h-14 w-full rounded-[6px] text-base font-normal" type="submit">
							Login
						</Button>
					</form>

					<div className="my-4 text-center text-sm font-normal">
						Don't have an account ?
						<Link className="ml-2 text-primary-green" to="/register">
							Create one
						</Link>
					</div>

					<div className="my-5 flex items-center">
						<div className="flex-grow border-t border-gray-300"></div>
						<span className="mx-4 text-xs text-gray-500">OR</span>
						<div className="flex-grow border-t border-gray-300"></div>
					</div>

					<Button
						variant="outline"
						className="flex h-14 w-full items-center justify-center space-x-2 rounded-[6px]"
					>
						<GoogleIcon className="h-6 w-6" />
						<span className="text-base font-normal">Continue with google</span>
					</Button>
				</Form>
			</div>
		</div>
	);
}

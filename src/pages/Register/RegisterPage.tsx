import GoogleIcon from '@/common/icons/google-icon';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TAB_TITLES from '@/constants/tab.titles';
import { registerSchema, tRegisterSchema } from '@/schemas/validation/register.schema';
import { disableCopyPaste } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
	const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

	const form = useForm<tRegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			confirm_password: '',
			full_name: '',
		},
	});

	useEffect(() => {
		document.title = TAB_TITLES.REGISTER;
	}, []);

	const onSubmit: SubmitHandler<tRegisterSchema> = (data) => {
		console.log(data);
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
											<span className="text-xs text-red-600">
												{form.formState.errors.email.message}
											</span>
										)}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="full_name"
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
										{form.formState.errors.full_name?.message && (
											<span className="text-xs text-red-600">
												{form.formState.errors.full_name.message}
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
											<span className="text-xs text-red-600">
												{form.formState.errors.password.message}
											</span>
										)}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirm_password"
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
										{form.formState.errors.confirm_password?.message && (
											<span className="text-xs text-red-600">
												{form.formState.errors.confirm_password.message}
											</span>
										)}
									</div>
								</FormItem>
							)}
						/>
						<Button className="mt-3 h-14 w-full rounded-[6px] text-base font-normal" type="submit">
							Register
						</Button>
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

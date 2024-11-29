import { eDispatchType } from '@/@types/dispatch.type';
import { User } from '@/@types/user.type';
import { authenticationApis } from '@/apis/authentication.apis';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app.context';
import ProfileHeader from '@/pages/Profile/components/ProfileHeader';
import { changePasswordSchema, userUpdateSchema, UserUpdateSchema } from '@/schemas/validation/userUpdate.schema';
import { getUserProfileFromLocalStorage, insertUserToLocalStorage } from '@/utils/local_storage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import _ from 'lodash';
import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function ProfilePage() {
	const {
		app: { userProfile },
		dispatch,
	} = useContext(AppContext);

	useEffect(() => {
		document.title = 'Profile settings - Cabonerf';
	}, []);

	const changePassForm = useForm<z.infer<typeof changePasswordSchema>>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			newPassword: '',
			newPasswordConfirm: '',
			oldPassword: '',
		},
	});

	const form = useForm<UserUpdateSchema>({
		resolver: zodResolver(userUpdateSchema),
		defaultValues: {
			bio: userProfile?.bio ? userProfile?.bio : '',
			fullName: userProfile?.fullName ?? '',
			phone: userProfile?.phone ?? '',
		},
	});

	const updateProfileMutation = useMutation({
		mutationFn: authenticationApis.updateProfile,
	});

	useEffect(() => {}, []);

	const onSubmit = (values: UserUpdateSchema) => {
		const sanitized = _.omitBy(values, (value) => value === '');
		console.log(sanitized);
		updateProfileMutation.mutate(sanitized, {
			onSuccess: (data) => {
				const oldProfile = getUserProfileFromLocalStorage();

				const newProfile = {
					...oldProfile,
					bio: data.data.data.bio ?? oldProfile?.bio ?? '',
					fullName: data.data.data.fullName ?? oldProfile?.fullName ?? '',
					phone: data.data.data.phone ?? oldProfile?.phone ?? '',
				};

				insertUserToLocalStorage(newProfile as User);
				dispatch({ type: eDispatchType.UPDATE_PROFILE, payload: newProfile as User });
				toast.success(data.data.message);
			},
			onError: () => {
				toast.error('Error');
			},
		});
	};

	const onChangePass: SubmitHandler<z.infer<typeof changePasswordSchema>> = (data) => {
		console.log(data);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.7, ease: 'easeOut' }}
			className="flex h-full flex-col"
		>
			<Dialog modal={true}>
				<ProfileHeader />
				<Separator className="mb-6 shadow-sm" />
				<div className="mx-auto">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormDescription className="text-xs">The name associated with this account</FormDescription>
										<FormControl>
											<Input className="w-[400px]" placeholder="shadcn" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormItem>
								<FormLabel>Email address</FormLabel>
								<FormDescription className="text-xs">The email address associated with this account</FormDescription>
								<FormControl>
									<Input
										className="w-[400px] border-gray-400 bg-gray-200"
										value={userProfile?.email}
										placeholder="shadcn"
										disabled
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone number</FormLabel>
										<FormDescription className="text-xs">The phone number associated with this account</FormDescription>
										<FormControl>
											<Input className="w-[400px]" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bio</FormLabel>
										<FormDescription className="text-xs">Provide a brief introduction for this account.</FormDescription>
										<FormControl>
											<Input className="w-[400px]" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormItem>
								<FormLabel>Verify status</FormLabel>
								<FormDescription className="text-xs">
									The current verification status of this account: <span className="font-bold text-green-600">Verified</span>
								</FormDescription>
							</FormItem>
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormDescription className="text-xs">The password associated with this account</FormDescription>

								<DialogTrigger asChild>
									<Button type="button" variant={'outline'}>
										Change password
									</Button>
								</DialogTrigger>

								<FormMessage />
							</FormItem>
							<Button type="submit" disabled={updateProfileMutation.isPending} className="h-fit rounded-sm px-3 py-1.5">
								{updateProfileMutation.isPending ? 'Saving...' : 'Save'}
							</Button>
						</form>
					</Form>
				</div>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change password</DialogTitle>
					</DialogHeader>
					<Form {...changePassForm}>
						<form onSubmit={changePassForm.handleSubmit(onChangePass)} className="space-y-8">
							<FormField
								control={changePassForm.control}
								name="oldPassword"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="Enter your old password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={changePassForm.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="Enter your new password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={changePassForm.control}
								name="newPasswordConfirm"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="Enter your new confirm password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button onClick={(e) => e.stopPropagation()} type="submit">
								Submit
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}

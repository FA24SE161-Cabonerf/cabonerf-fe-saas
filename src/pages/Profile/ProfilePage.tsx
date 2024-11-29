import { CommonResponse } from '@/@types/common.type';
import { eDispatchType } from '@/@types/dispatch.type';
import { User } from '@/@types/user.type';
import { authenticationApis } from '@/apis/authentication.apis';
import MyAvatar from '@/components/MyAvatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app.context';
import InputFile from '@/pages/Profile/components/InputFile';
import ProfileHeader from '@/pages/Profile/components/ProfileHeader';
import { changePasswordSchema, userUpdateSchema, UserUpdateSchema } from '@/schemas/validation/userUpdate.schema';
import { isUnprocessableEntity } from '@/utils/error';
import { getUserProfileFromLocalStorage, insertUserToLocalStorage } from '@/utils/local_storage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function ProfilePage() {
	const {
		app: { userProfile },
		dispatch,
	} = useContext(AppContext);
	const [file, setFile] = useState<File>();

	useEffect(() => {
		document.title = 'Profile settings - Cabonerf';
	}, []);

	const previewImage = useMemo(() => {
		return file ? URL.createObjectURL(file) : '';
	}, [file]);

	const changePassForm = useForm<z.infer<typeof changePasswordSchema>>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			newPassword: '',
			newPasswordConfirm: '',
			oldPassword: '',
		},
	});

	const handleChangeFile = (file?: File) => {
		setFile(file);
	};

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

	const changePasswordMutation = useMutation({
		mutationFn: authenticationApis.changePassword,
	});

	const uploadFile = useMutation({
		mutationFn: authenticationApis.uploadFile,
	});

	useEffect(() => {}, []);

	const onSubmit = async (values: UserUpdateSchema) => {
		try {
			let avatarName = '';
			const sanitized = _.omitBy(values, (value) => value === '');

			if (file) {
				const form = new FormData();
				form.append('image', file);
				const uploadRes = await uploadFile.mutateAsync(form);
				avatarName = uploadRes.data.data.profilePictureUrl;
			}

			const res = await updateProfileMutation.mutateAsync(sanitized, {
				onError: () => {
					toast.error('Error');
				},
			});

			const oldProfile = getUserProfileFromLocalStorage();

			const newProfile = {
				...oldProfile,
				profilePictureUrl: avatarName ? avatarName : oldProfile?.profilePictureUrl,
				bio: res.data.data.bio ?? oldProfile?.bio ?? '',
				fullName: res.data.data.fullName ?? oldProfile?.fullName ?? '',
				phone: res.data.data.phone ?? oldProfile?.phone ?? '',
			};

			insertUserToLocalStorage(newProfile as User);
			dispatch({ type: eDispatchType.UPDATE_PROFILE, payload: newProfile as User });
			toast.success(res.data.message);
		} catch (error) {
			console.log(error);
		}
	};

	const onChangePass: SubmitHandler<z.infer<typeof changePasswordSchema>> = (data) => {
		changePasswordMutation.mutate(data, {
			onSuccess: (data) => {
				toast.success(data.data.message);
				changePassForm.setValue('newPassword', '');
				changePassForm.setValue('oldPassword', '');
				changePassForm.setValue('newPasswordConfirm', '');
			},
			onError: (error) => {
				if (isUnprocessableEntity<CommonResponse<z.infer<typeof changePasswordSchema>>>(error)) {
					const formError = error.response?.data.data;

					if (formError) {
						Object.keys(formError).forEach((key) => {
							changePassForm.setError(key as keyof z.infer<typeof changePasswordSchema>, {
								message: formError[key as keyof z.infer<typeof changePasswordSchema>],
							});
						});
					}
				}
			},
		});
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
					<div className="flex items-center space-x-4">
						<MyAvatar
							className="mb-2 h-14 w-14"
							fallBackContent="CN"
							urlAvatar={previewImage || (userProfile?.profilePictureUrl as string)}
						/>

						<InputFile onChange={handleChangeFile} />
					</div>
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
							<Button
								type="submit"
								disabled={updateProfileMutation.isPending || uploadFile.isPending}
								className="h-fit rounded-sm px-3 py-1.5"
							>
								{updateProfileMutation.isPending || uploadFile.isPending ? 'Saving...' : 'Save'}
							</Button>
						</form>
					</Form>
				</div>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change password</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<Form {...changePassForm}>
						<form onSubmit={changePassForm.handleSubmit(onChangePass)} className="space-y-8">
							<FormField
								control={changePassForm.control}
								name="oldPassword"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input type="password" placeholder="Enter your old password" {...field} />
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
											<Input type="password" placeholder="Enter your new password" {...field} />
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
											<Input type="password" placeholder="Enter your new confirm password" {...field} />
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

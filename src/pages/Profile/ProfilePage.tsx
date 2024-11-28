import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app.context';
import ProfileHeader from '@/pages/Profile/components/ProfileHeader';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	username: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),
});

export default function ProfilePage() {
	const {
		app: { userProfile },
	} = useContext(AppContext);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: userProfile?.fullName,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.7, ease: 'easeOut' }}
			className="flex h-full flex-col"
		>
			<ProfileHeader />
			<Separator className="mb-6" />
			<div className="mx-auto">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
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
								<Input className="w-[400px] border-gray-400 bg-gray-200" value={userProfile?.email} placeholder="shadcn" disabled />
							</FormControl>
							<FormMessage />
						</FormItem>
						<FormItem>
							<FormLabel>Verify status</FormLabel>
							<FormDescription className="text-xs">
								The current verification status of this account: <span className="font-bold text-green-600">Verified</span>
							</FormDescription>
						</FormItem>
						<FormItem>
							<FormLabel>Passowrd</FormLabel>
							<FormDescription className="text-xs">The password associated with this account</FormDescription>
							<Button type="button" variant={'outline'}>
								Change password
							</Button>

							<FormMessage />
						</FormItem>
						<Button type="submit" className="h-fit rounded-sm px-3 py-1.5">
							Save
						</Button>
					</form>
				</Form>
			</div>
		</motion.div>
	);
}

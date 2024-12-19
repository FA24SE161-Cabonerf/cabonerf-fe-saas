import { eDispatchType } from '@/@types/dispatch.type';
import { authenticationApis } from '@/apis/authentication.apis';
import MyAvatar from '@/components/MyAvatar';
import ToggleTheme from '@/components/ToggleTheme';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppContext } from '@/contexts/app.context';
import { getTokenFromLocalStorage, TOKEN_KEY_NAME } from '@/utils/local_storage';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ProfileDropdown() {
	const navigate = useNavigate();
	const {
		app: { userProfile },
		dispatch,
	} = useContext(AppContext);

	const logoutMutation = useMutation({
		mutationFn: authenticationApis.logout,
	});

	const logout = () => {
		toast.promise(
			new Promise((resolve, reject) => {
				logoutMutation.mutate(
					{
						refreshToken: getTokenFromLocalStorage(TOKEN_KEY_NAME.REFRESH_TOKEN) as string,
					},
					{
						onSuccess: () => {
							dispatch({ type: eDispatchType.LOGOUT });
							resolve('Logout success');
						},
						onError: (error) => {
							reject(error.message);
						},
					}
				);
			}),
			{
				loading: 'Logging out...',
				success: 'Logout success',
				error: (err) => <p>{err}</p>,
			},
			{
				success: {
					className: 'hidden',
				},
			}
		);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="rounded-full p-[2px] transition duration-200 ease-in-out hover:bg-stone-300">
				<MyAvatar fallBackContent="CN" urlAvatar={userProfile?.profilePictureUrl ?? ''} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="mr-1 w-56">
				<div className="flex flex-col px-2 py-[6px] text-sm">
					{/* Username */}
					<span className="font-medium tracking-wide">{userProfile?.fullName}</span>
					{/* Email */}
					<span className="text-[13px] font-light">{userProfile?.email}</span>
					{/* Change mode */}
					<ToggleTheme />
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/setting')}>
						Setting Profile
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={logout} disabled={logoutMutation.isPending} className="cursor-pointer">
					{logoutMutation.isPending && <ReloadIcon className="mr-2 h-[14px] w-[14px] animate-spin" />}
					Log out
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

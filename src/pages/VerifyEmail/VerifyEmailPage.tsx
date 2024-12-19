import { authenticationApis } from '@/apis/authentication.apis';
import useQueryParams from '@/hooks/useQueryParams';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function VerifyEmailPage() {
	const { token } = useQueryParams();

	const verifyEmailMutation = useMutation({
		mutationFn: authenticationApis.verifyEmail,
	});

	useEffect(() => {
		const controller = new AbortController();

		verifyEmailMutation.mutate(
			{ token },
			{
				onSuccess: (data) => {
					console.log('Success:', data);
				},
				onError: (error) => {
					if (error.name === 'AbortError') {
						console.log('Request was aborted');
					} else {
						console.log('Error:', error);
					}
				},
			}
		);

		// Cleanup function to abort the request when the component unmounts
		return () => {
			controller.abort();
		};
	}, [token, verifyEmailMutation]);

	return <div></div>;
}

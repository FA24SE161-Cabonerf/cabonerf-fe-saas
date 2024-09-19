import useQueryParams from '@/hooks/useQueryParams';

export default function VerifyEmailPage() {
	const { token } = useQueryParams();

	return <div>VerifyEmailPage</div>;
}

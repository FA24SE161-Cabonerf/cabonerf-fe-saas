import { OrganizeApis } from '@/apis/organiza.apis';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToDefaultOrganization = () => {
	const navigate = useNavigate();

	// Fetch organizations (hoặc thay bằng logic lấy từ Redux nếu cần)
	const organizationsQuery = useQuery({
		queryKey: ['organizations'],
		queryFn: OrganizeApis.prototype.getOrganizationsByUser,
		staleTime: 60 * 1000 * 60,
	});

	useEffect(() => {
		if (organizationsQuery.data) {
			const defaultOrg = organizationsQuery.data.data.data.find((org) => org.default === true);

			if (defaultOrg) {
				navigate(`/dashboard/${defaultOrg.id}`);
			} else {
				console.error('No default organization found.');
			}
		}
	}, [organizationsQuery.data, navigate]);

	// Hiển thị loader hoặc fallback UI trong lúc chờ dữ liệu
	return <p>Redirecting to your default organization...</p>;
};
export default RedirectToDefaultOrganization;

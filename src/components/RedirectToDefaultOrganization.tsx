import { OrganizeApis } from '@/apis/organiza.apis';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
	pathName: string;
};

const RedirectToDefaultOrganization = ({ pathName }: Props) => {
	const { search } = useLocation();
	const navigate = useNavigate();
	console.log(search);
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
				navigate(`/${pathName}/${defaultOrg.id}`);
			} else {
				console.error('No default organization found.');
			}
		}
	}, [organizationsQuery.data, navigate, pathName]);

	return <p></p>;
};
export default RedirectToDefaultOrganization;

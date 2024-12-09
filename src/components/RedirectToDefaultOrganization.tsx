import { OrganizeApis } from '@/apis/organiza.apis';
import { AppContext } from '@/contexts/app.context';
import { getCurrentOrganizationFromLocalStorage } from '@/utils/local_storage';
import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
	pathName: string;
};

const RedirectToDefaultOrganization = ({ pathName }: Props) => {
	const {
		app: { currentOrganization },
	} = useContext(AppContext);
	const navigate = useNavigate();

	// Fetch organizations (hoặc thay bằng logic lấy từ Redux nếu cần)
	const organizationsQuery = useQuery({
		queryKey: ['organizations'],
		queryFn: OrganizeApis.prototype.getOrganizationsByUser,
		staleTime: 60 * 1000 * 60,
	});

	const currentOrganizationid = getCurrentOrganizationFromLocalStorage();

	useEffect(() => {
		if (organizationsQuery.data) {
			const defaultOrg = organizationsQuery.data.data.data.find((org) => org.default === true);

			if (defaultOrg) {
				navigate(`/${pathName}/${currentOrganization?.orgId ?? currentOrganizationid?.orgId}`);
			} else {
				console.error('No default organization found.');
			}
		}
	}, [organizationsQuery.data, navigate, pathName, currentOrganization, currentOrganizationid?.orgId]);

	return <p></p>;
};
export default RedirectToDefaultOrganization;

import { CommonResponse } from '@/@types/common.type';
import { Organization, OrgMember } from '@/@types/organization.type';
import httpService from '@/services/http';

export class OrganizeApis {
	public async getOrganizationsByUser() {
		return httpService.get<
			CommonResponse<
				{
					id: string;
					name: string;
					logo: string;
					default: boolean;
				}[]
			>
		>('organizations');
	}

	public getOrganizationById(payload: { orgId: string }) {
		return httpService.get<CommonResponse<Organization>>(`organizations/${payload.orgId}`);
	}

	public getMemberOrganizationById(payload: { orgId: string }) {
		return httpService.get<CommonResponse<OrgMember[]>>(`organizations/${payload.orgId}/members`);
	}
}

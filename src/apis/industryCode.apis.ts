import { CommonResponse } from '@/@types/common.type';
import { IndustryCode } from '@/@types/organization.type';
import httpService from '@/services/http';

export class IndustryCodeApis {
	public getListIndustryCodeByOrganizationId(payload: { orgId: string }) {
		return httpService.get<CommonResponse<IndustryCode[]>>(`industry-code/${payload.orgId}`);
	}
}

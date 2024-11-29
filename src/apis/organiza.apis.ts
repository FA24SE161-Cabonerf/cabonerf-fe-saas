import { CommonResponse } from '@/@types/common.type';
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
}

import { CommonResponse } from '@/@types/common.type';
import { UnitGroup } from '@/@types/unit.type';
import { UNIT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

export class UnitApis {
	public async getAllUnitGroup() {
		return await httpService.get<CommonResponse<UnitGroup[]>>(UNIT.UNIT_GROUP);
	}
}

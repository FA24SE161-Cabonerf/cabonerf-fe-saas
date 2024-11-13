import { CommonResponse } from '@/@types/common.type';
import { EmissionsCompartment } from '@/@types/emissionCompartment.type';
import { EMISSIONS } from '@/constants/api.endpoint';
import httpService from '@/services/http.tsx';

class EmissionCompartmentApis {
	public getListEmissionCompartment() {
		return httpService.get<CommonResponse<EmissionsCompartment[]>>(EMISSIONS.EMISSIONS_COMPARTMENT);
	}
}
export default EmissionCompartmentApis;

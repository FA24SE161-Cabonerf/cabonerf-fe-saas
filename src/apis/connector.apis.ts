import { CommonResponse } from '@/@types/common.type';
import { CreateConnectorReqBody, CreateConnectorRes } from '@/@types/connector.type';
import { CONNECTOR } from '@/constants/api.endpoint';
import httpService from '@/services/http';

export default class ConnectorApis {
	public async createConnector(payload: CreateConnectorReqBody) {
		return (await httpService.post<CommonResponse<CreateConnectorRes>>(CONNECTOR.CONNECTOR, payload)).data.data;
	}
}

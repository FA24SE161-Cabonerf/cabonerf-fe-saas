import { Exchange } from '@/@types/exchange.type';

interface CreateConnectorReqBody {
	startProcessId: string; // source: đầu ra
	endProcessId: string; //target: đầu vào
	startExchangeId: string; // sourceHandle
	endExchangeId: string; // targetHandle
}

interface Connector {
	id: string;
	startProcessId: string;
	endProcessId: string;
	startExchangesId: string;
	endExchangesId: string;
}

interface CreateConnectorRes {
	connector: Connector;
	updatedProcess: {
		processId: string;
		exchange: Exchange;
	};
}

export type { CreateConnectorReqBody, CreateConnectorRes, Connector };

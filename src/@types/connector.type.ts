import { Exchange } from '@/@types/exchange.type';
import { Edge } from '@xyflow/react';

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
	connector: Edge;
	updatedProcess: {
		processId: string;
		exchange: Exchange;
	};
}

export type { CreateConnectorReqBody, CreateConnectorRes, Connector };

interface CreateCabonerfNodeReqBody {
	projectId: string;
	lifeCycleStageId: string;
	type: string;
	[key: string]: unknown;
}
interface CreateCabonerfNodeTextReqBody {
	projectId: string;
	position: {
		x: number;
		y: number;
	};
	type: string;
	fontSize: number;
}
export type { CreateCabonerfNodeReqBody, CreateCabonerfNodeTextReqBody };

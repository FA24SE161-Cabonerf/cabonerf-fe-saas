import { TIMES } from '@/constants/time';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
			staleTime: TIMES.MINUTE.THREE,
			retry: TIMES.COUNT.THREE,
		},
	},
});

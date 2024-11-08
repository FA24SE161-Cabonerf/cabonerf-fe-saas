import { TIMES } from '@/constants/time';
import AppProvider from '@/contexts/app.context';
import { ThemeProvider } from '@/contexts/theme.context';
import useRouteElements from '@/hooks/useRouteElements';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ReactFlowProvider } from '@xyflow/react';
import { Toaster as ToastShadcnUI } from '@/components/ui/sonner';
import ContextMenuProvider from '@/pages/Playground/contexts/contextmenu.context';
import Sheetbar from '@/pages/Playground/contexts/sheetbar.context';

const queryClient = new QueryClient({
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

function App() {
	const routers = useRouteElements();

	return (
		<QueryClientProvider client={queryClient}>
			<AppProvider>
				<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
					<ReactFlowProvider>
						<ContextMenuProvider>
							<Sheetbar>
								<RouterProvider router={routers} />
								<Toaster />
								<ToastShadcnUI />
							</Sheetbar>
						</ContextMenuProvider>
					</ReactFlowProvider>
				</ThemeProvider>
			</AppProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;

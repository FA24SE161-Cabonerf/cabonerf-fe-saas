import { Toaster as ToastShadcnUI } from '@/components/ui/sonner';
import AppProvider from '@/contexts/app.context';
import { ThemeProvider } from '@/contexts/theme.context';
import useRouteElements from '@/hooks/useRouteElements';
import ContextMenuProvider from '@/pages/Playground/contexts/contextmenu.context';
import { PlaygroundProvider } from '@/pages/Playground/contexts/playground.context';
import Sheetbar from '@/pages/Playground/contexts/sheetbar.context';
import { queryClient } from '@/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactFlowProvider } from '@xyflow/react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';

function App() {
	const routers = useRouteElements();

	return (
		<QueryClientProvider client={queryClient}>
			<AppProvider>
				<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
					<ReactFlowProvider>
						<ContextMenuProvider>
							<PlaygroundProvider>
								<Sheetbar>
									<RouterProvider router={routers} />
									<Toaster />
									<ToastShadcnUI />
								</Sheetbar>
							</PlaygroundProvider>
						</ContextMenuProvider>
					</ReactFlowProvider>
				</ThemeProvider>
			</AppProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;

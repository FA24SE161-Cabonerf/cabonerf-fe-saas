import { Toaster as ToastShadcnUI } from '@/components/ui/sonner';
import AppProvider from '@/contexts/app.context';
import { ThemeProvider } from '@/contexts/theme.context';
import useRouteElements from '@/hooks/useRouteElements';
import { queryClient } from '@/queryClient';
import { logoSymbol } from '@/utils/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';

function App() {
	const routers = useRouteElements();
	console.log(logoSymbol);
	return (
		<QueryClientProvider client={queryClient}>
			<AppProvider>
				<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
					<RouterProvider router={routers} />
					<Toaster />
					<ToastShadcnUI duration={2000} />
				</ThemeProvider>
			</AppProvider>
		</QueryClientProvider>
	);
}

export default App;

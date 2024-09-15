import { ThemeProvider } from '@/contexts/theme.context';
import useRouteElements from '@/hooks/useRouteElements';
import { RouterProvider } from 'react-router-dom';

function App() {
	const routers = useRouteElements();

	return (
		<>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<RouterProvider router={routers} />
			</ThemeProvider>
		</>
	);
}

export default App;

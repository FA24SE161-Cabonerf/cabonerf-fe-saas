import useRouteElements from '@/hooks/useRouteElements';
import { RouterProvider } from 'react-router-dom';

function App() {
	const routers = useRouteElements();

	return (
		<>
			<RouterProvider router={routers} />
		</>
	);
}

export default App;

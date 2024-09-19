import TAB_TITLES from '@/constants/tab.titles';
import { useEffect } from 'react';

export default function DashboardPage() {
	useEffect(() => {
		document.title = TAB_TITLES.HOME;
	}, []);

	return <div className="p-2">Dashboard</div>;
}

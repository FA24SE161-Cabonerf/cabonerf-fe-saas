import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useState } from 'react';

export default function DashboardProject() {
	const [isOpenDialog, setIsOpenDialog] = useState<boolean>(true);
	return (
		<Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
			<DialogContent className="h-[80%] max-w-[80%]">123</DialogContent>
			<DialogOverlay className="bg-black/20 backdrop-blur-[2px]" />
		</Dialog>
	);
}

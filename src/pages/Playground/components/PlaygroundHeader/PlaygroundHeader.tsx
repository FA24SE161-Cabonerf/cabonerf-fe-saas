import { Button } from '@/components/ui/button';
import { ArrowLeft, History, Play, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PlaygroundHeader() {
	const navigate = useNavigate();

	const goBack = () => {
		navigate('/');
	};

	return (
		<div className="w-full bg-backgroundBehide">
			<div className="flex justify-between border-b">
				<div className="flex items-center px-4">
					<button className="group flex items-center space-x-1" onClick={goBack}>
						<ArrowLeft size={17} className="duration-200 group-hover:-translate-x-0.5" />
						<span className="text-sm">Back</span>
					</button>
				</div>

				<div className="flex items-center space-x-7 py-2 pr-4">
					<button className="">
						<History size={17} />
					</button>
					<button className="">
						<Share size={17} />
					</button>

					{/* Caculate Button */}
					<Button className="space-x-3 rounded-sm px-3.5 py-0.5 text-[13px] font-normal">
						<Play size={14} fill="white" color="white" /> <span>Calculate LCA</span>
					</Button>
				</div>
			</div>
		</div>
	);
}

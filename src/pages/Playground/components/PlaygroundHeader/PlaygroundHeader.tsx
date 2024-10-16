import { ArrowLeft, History, Share } from 'lucide-react';
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

				<div className="flex items-center space-x-7 py-4 pr-4">
					<button className="">
						<History size={17} />
					</button>
					<button className="">
						<Share size={17} />
					</button>

					{/* Caculate Button */}
				</div>
			</div>
		</div>
	);
}

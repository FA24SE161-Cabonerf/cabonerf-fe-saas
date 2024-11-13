import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
	children: React.ReactNode;
	data: unknown[];
	className?: string;
}

const ScrollableList = ({ children, data, className }: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isScrollable, setIsScrollable] = useState<boolean>(false);
	const [isScrolling, setIsScrolling] = useState<boolean>(true);

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			// Check if scroll is available
			setIsScrollable(container.scrollHeight > container.clientHeight);
		}
	}, [data]);

	useEffect(() => {
		const container = containerRef.current;

		const handleScroll = () => {
			if (container && container.scrollTop === 0) {
				setIsScrolling(true);
			} else {
				setIsScrolling(false);
			}
		};

		if (container && isScrollable) {
			container.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
		};
	}, [isScrollable]);

	return (
		<div ref={containerRef} style={{ position: 'relative', scrollBehavior: 'smooth' }} className={className}>
			{children}
			{isScrollable && isScrolling && <ChevronDown className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all" />}
		</div>
	);
};

export default ScrollableList;

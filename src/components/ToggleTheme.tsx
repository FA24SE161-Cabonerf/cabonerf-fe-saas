import { useTheme } from '@/hooks/useTheme';
import { Laptop, Moon, Sun } from 'lucide-react';

export default function ToggleTheme() {
	const { theme, setTheme } = useTheme();
	return (
		<div className="mt-2">
			<div className="flex w-fit rounded-[6px] bg-gray-200 p-[2px] dark:bg-black">
				{/* Light mode button */}
				<button
					onClick={() => setTheme('light')}
					className={`rounded-[5px] px-2 py-1.5 shadow-sm ${
						theme === 'light'
							? 'bg-white text-black'
							: 'bg-transparent text-gray-500 dark:bg-transparent dark:text-white'
					}`}
				>
					<Sun size={14} />
				</button>

				{/* Dark mode button */}
				<button
					onClick={() => setTheme('dark')}
					className={`rounded-[5px] px-2 py-1.5 ${
						theme === 'dark'
							? 'bg-gray-600 text-white'
							: 'bg-transparent text-gray-500 dark:bg-transparent dark:text-white'
					}`}
				>
					<Moon size={14} />
				</button>

				{/* System theme button */}
				<button
					onClick={() => setTheme('system')}
					className={`rounded-[5px] px-2 py-1.5 ${
						theme === 'system'
							? 'bg-gray-600 text-white'
							: 'bg-transparent text-gray-500 dark:bg-transparent dark:text-white'
					}`}
				>
					<Laptop size={14} />
				</button>
			</div>
		</div>
	);
}

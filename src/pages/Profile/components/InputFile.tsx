import { Fragment, useRef } from 'react';
import { toast } from 'sonner';

interface Props {
	onChange?: (file?: File) => void;
}

export default function InputFile({ onChange }: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileFromLocal = event.target.files?.[0];
		fileInputRef.current?.setAttribute('value', '');
		if (fileFromLocal && (fileFromLocal.size >= 1048576 || !fileFromLocal.type.includes('image'))) {
			toast.error(`Dụng lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG`, {
				position: 'top-center',
			});
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			onChange && onChange(fileFromLocal);
		}
	};
	const handleUpload = () => {
		fileInputRef.current?.click();
	};

	return (
		<Fragment>
			<input
				className="hidden"
				type="file"
				accept=".png"
				ref={fileInputRef}
				onChange={onFileChange}
				onClick={(event) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(event.target as any).value = null;
				}}
			/>
			<button
				className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
				type="button"
				onClick={handleUpload}
			>
				Upload file
			</button>
		</Fragment>
	);
}

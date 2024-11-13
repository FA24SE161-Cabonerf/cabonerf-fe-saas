export default function TextNode() {
	return (
		<div className="relative rounded border bg-white p-2">
			<div className="custom-drag-handle absolute -top-4 left-1/2 w-fit -translate-x-1/2 border">2</div>
			<div>TextNode</div>
		</div>
	);
}

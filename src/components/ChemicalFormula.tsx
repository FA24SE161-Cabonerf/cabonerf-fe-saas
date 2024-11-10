import katex from 'katex';
import 'katex/dist/katex.min.css';

type Props = {
	formula: string;
	className?: string;
};

const ChemicalFormula = ({ className, formula }: Props) => {
	// Check if the formula is valid before rendering
	const formulaHtml = formula && formula !== '-' ? katex.renderToString(formula, { throwOnError: false, strict: false }) : '';

	return <div className={className} dangerouslySetInnerHTML={{ __html: formulaHtml }} />;
};

export default ChemicalFormula;

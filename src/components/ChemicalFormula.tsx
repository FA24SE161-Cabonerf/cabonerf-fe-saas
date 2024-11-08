import katex from 'katex';
import 'katex/dist/katex.min.css';

type Props = {
	formula: string;
	className?: string;
};

const ChemicalFormula = ({ className, formula }: Props) => {
	const formulaHtml = katex.renderToString(formula === '-' ? '' : formula, { throwOnError: true, strict: false });

	return <div className={className} dangerouslySetInnerHTML={{ __html: formulaHtml }} />;
};

export default ChemicalFormula;

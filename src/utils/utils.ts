import { JWTPayload } from '@/@types/common.type';

export const logoSymbol = `                                                                                                                                                                                          
     ......                .+++-.                                                             .=***-
  .+#@@@@@@*-.             :@@@=.                                                           .+@@@@@=
.+@@@@@@@@@@@=.  ..::..    :@@@=..:..        .::..    .......::..      ..::..    -%%- .:-=-.-%@@#:..
+@@@#.    .=. .#@@@@@@@@=. :@@@@@@@@@@=. .+@@@@@@@@+. -@@@@@@@@@@=. .=%@@@@@@@-. *@@%====+-*@@@@@@@:
%@@@:.         .*=::-%@@@=.:@@@@+:-#@@@+.*@@@*--*@@@*.-@@@@*=+@@@@..=@@@=..=@@@*.*@@@*===:.-*@@@%++.
#@@@-.        .-#%@@@@@@@=.:@@@=.  -%@@@-%@@%.  .%@@%--@@@*. .=@@@:.#@@@@@@@@@@#.*@@@+      -@@@#.  
:@@@@*:..:#@=.=@@@*..+@@@=.:@@@%:..+@@@#:#@@@-..=@@@#.-@@@+. .=@@@:.+@@@-...:..  *@@@+      -@@@#.  
..*@@@@@@@@@%=:%@@@@@@@@@=.:@@@@@@@@@@*. :*@@@@@@@@*. -@@@+. .=@@@: .=@@@@@@@@#. *@@@+      -@@@#.  
  ..=#%@%#*:.  .+###+:###- .###=+###+:.   ..+####=.   :###=. .-###.   .-*#%#*-.  =##*-      :*##+.                                                                                                
                                                                                                    `;

export const disableCopyPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
	event.preventDefault();
};

export const getPayload = (token: string): JWTPayload => {
	const myPayload = token.split('.')[1];

	return JSON.parse(atob(myPayload));
};

export const formatDate = (inputDate: string): string => {
	const date = new Date(inputDate);
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
	return date.toLocaleDateString('en-US', options);
};

type CustomSVG = {
	svgString: string;
	properties: {
		width: number;
		height: number;
		fill: string;
		color: string;
	};
};

export const updateSVGAttributes = ({ svgString, properties }: CustomSVG) => {
	return svgString
		.replace(/width="\d+"/, `width="${properties.width}"`)
		.replace(/height="\d+"/, `height="${properties.height}"`)
		.replace(/fill="[^"]*"/, `fill="${properties.fill}"`)
		.replace(/stroke="[^"]*"/, `stroke="${properties.color}"`);
};

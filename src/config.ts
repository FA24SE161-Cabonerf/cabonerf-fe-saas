const environment = import.meta.env.VITE_ENV;

class Config {
	public BASE_URL: string | undefined;
	public GATEWAY_BASE_URL: string | undefined;
	constructor() {
		if (environment === 'production') {
			this.BASE_URL = import.meta.env.VITE_PRODUCTION_URL;
			this.GATEWAY_BASE_URL = import.meta.env.VITE_GATEWAY_PRODUCTION_URL;
		} else {
			this.BASE_URL = import.meta.env.VITE_DEV_URL;
			this.GATEWAY_BASE_URL = import.meta.env.VITE_GATEWAY_DEV_URL;
		}
	}
}

const config = new Config();
export default config;

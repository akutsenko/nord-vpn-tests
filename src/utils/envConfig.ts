import { getUiProject } from "./projectUtil";
import { getProxy } from "./proxyUtil";

type EnvironmentConfig = {
  ENVIRONMENT: string;
  IPFLAIR_API_KEY: string;
  BASE_WEB_URL: string;
  BASE_API_URL: string;
  CI: string;
  DOCKER: string;
  PROXY:
    | {
        server: string;
        username: string;
        password: string;
        country: string;
        city: string | undefined;
      }
    | undefined;
  UI_PROJECT: any;
};

const envConfig = (): EnvironmentConfig => {
  return {
    ENVIRONMENT: process.env.ENVIRONMENT ?? "test",
    IPFLAIR_API_KEY: process.env.IPFLAIR_API_KEY ?? "",
    BASE_WEB_URL: process.env.BASE_WEB_URL ?? "",
    BASE_API_URL: process.env.BASE_API_URL ?? "",
    CI: process.env.CI ?? "",
    DOCKER: process.env.DOCKER ?? "",
    PROXY: getProxy(process.env.PROXY_URL),
    UI_PROJECT: process.env.BROWSER
      ? getUiProject(process.env.BROWSER)
      : getUiProject("chromium"),
  };
};

export default envConfig;

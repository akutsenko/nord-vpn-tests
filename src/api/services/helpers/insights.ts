import { APIRequestContext, APIResponse, Page, test } from "@playwright/test";
import { apiDelete, apiGet, apiHead, apiPost, apiPut } from "pw-api-plugin";
import envConfig from "../../../utils/envConfig";
import { HttpMethods } from "../../utils/httpMethods";

export const INSIGHTS_RELATIVE_URL = "/v1/helpers/ips/insights";
export const UNSUPPORTED_HTTP_METHODS = [
  HttpMethods.POST,
  HttpMethods.PUT,
  HttpMethods.DELETE,
  HttpMethods.PATCH,
];
export const SUPPORTED_HTTP_METHODS = [HttpMethods.GET, HttpMethods.HEAD];

export const getInsights = async ({
  request,
  page,
}: {
  request: APIRequestContext;
  page: Page;
}): Promise<APIResponse> => {
  return getInsightsUsingHttpMethod({
    request,
    page,
    httpMethod: HttpMethods.GET,
  });
};

export const getInsightsUsingHttpMethod = async ({
  request,
  page,
  httpMethod,
}: {
  request: APIRequestContext;
  page: Page;
  httpMethod: HttpMethods;
}): Promise<APIResponse> => {
  const insightsFullUrl = `${envConfig().BASE_API_URL}/v1/helpers/ips/insights`;
  return await test.step(`user sends ${httpMethod} request to ${insightsFullUrl}`, async () => {
    switch (httpMethod) {
      case HttpMethods.GET: {
        return apiGet({ request, page }, insightsFullUrl);
      }
      case HttpMethods.POST: {
        return apiPost({ request, page }, insightsFullUrl, {
          data: {},
        });
      }
      case HttpMethods.PUT: {
        return apiPut({ request, page }, insightsFullUrl, {
          data: {},
        });
      }
      case HttpMethods.PATCH: {
        return apiPut({ request, page }, insightsFullUrl, {
          data: {},
        });
      }
      case HttpMethods.DELETE: {
        return apiDelete({ request, page }, insightsFullUrl);
      }
      case HttpMethods.HEAD: {
        return apiHead({ request, page }, insightsFullUrl);
      }
      default: {
        throw new Error(`Unsupported HTTP method: ${httpMethod}`);
      }
    }
  });
};

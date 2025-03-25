import { test, expect } from "@playwright/test";
import {
  INSIGHTS_RELATIVE_URL,
  SUPPORTED_HTTP_METHODS,
  UNSUPPORTED_HTTP_METHODS,
  getInsights,
  getInsightsUsingHttpMethod,
} from "../../api/services/helpers/insights";
import { getPublicIpInfo } from "../../api/utils/ip";
import Ajv from "ajv";
import envConfig from "../../utils/envConfig";

const INSIGHTS_SCHEMA_PATH = "../../api/schema-files/insightsSchema.json";
const INVALID_HEADERS = [
  "' OR 1=1 --",
  "<script>alert(1)</script>",
  "../../../etc/passwd",
  "X".repeat(10000),
];

for (const httpMethod of SUPPORTED_HTTP_METHODS) {
  test(
    `${INSIGHTS_RELATIVE_URL} response has correct schema for ${httpMethod} request`,
    {
      tag: ["@api", "@insights"],
    },
    async ({ request, page }) => {
      const insightsResponse = await getInsights({ request, page });
      expect(insightsResponse.status(), "Response status should be 200").toBe(
        200,
      );
      const insightsIpData = await insightsResponse.json();
      const ajv = new Ajv();
      const validate = ajv.compile(require(INSIGHTS_SCHEMA_PATH));
      const isValid = validate(insightsIpData);

      if (!isValid) {
        console.log(
          "SCHEMA ERRORS:",
          JSON.stringify(validate.errors),
          "\nRESPONSE BODY:",
          JSON.stringify(insightsIpData),
        );
      }
      expect(isValid, "response should have valid schema").toBe(true);
    },
  );
}

test(
  `${INSIGHTS_RELATIVE_URL} returns proper IP information`,
  {
    tag: ["@api", "@insights"],
  },
  async ({ request, page }) => {
    const expectedIpData = await getPublicIpInfo();
    const insightsResponse = await getInsights({ request, page });

    expect(insightsResponse.status(), "Response status should be 200").toBe(
      200,
    );
    const insightsIpData = await insightsResponse.json();
    const softExpect = expect.configure({ soft: true });

    softExpect(
      insightsIpData.ip,
      `'ip' value should equal to ${expectedIpData.ip}`,
    ).toEqual(expectedIpData.ip);
    softExpect(
      insightsIpData.city,
      `'city' value should equal to ${expectedIpData.city}`,
    ).toEqual(expectedIpData.city);
    softExpect(
      insightsIpData.country,
      `'country' value should equal to ${expectedIpData.country_name}`,
    ).toEqual(expectedIpData.country_name);
    softExpect(
      insightsIpData.country_code,
      `'country_code' value should equal to ${expectedIpData.country_code}`,
    ).toEqual(expectedIpData.country_code);
    softExpect(
      Math.floor(insightsIpData.latitude),
      `'latitude' value should be any mumber`,
    ).toEqual(expect.any(Number));
    softExpect(
      Math.floor(insightsIpData.longitude),
      `'longitude' value should be any number`,
    ).toEqual(expect.any(Number));
    softExpect(
      insightsIpData.isp,
      `'isp' value should equal to ${expectedIpData.isp}`,
    ).toEqual(expectedIpData.isp);
    softExpect(
      insightsIpData.isp_asn,
      `'isp_asn' value should equal to ${expectedIpData.asn}`,
    ).toEqual(expectedIpData.asn);
    softExpect(
      insightsIpData.state_code,
      `'state_code' value should equal to ${expectedIpData.region_code}`,
    ).toEqual(expectedIpData.region_code);
    softExpect(
      insightsIpData.zip_code,
      `'zip_code' value should be any string`,
    ).toEqual(expect.any(String));
    softExpect(
      insightsIpData.protected,
      `'protected' value should be any boolean`,
    ).toEqual(expect.any(Boolean));
  },
);

test.describe(
  "when geolocation is set in context",
  {
    tag: ["@api", "@insights"],
  },
  () => {
    const fakeCoordinates = {
      latitude: -47.123456789,
      longitude: 123.456789012,
    };

    test.use({
      geolocation: {
        latitude: fakeCoordinates.latitude,
        longitude: fakeCoordinates.longitude,
      },
    });

    test(`${INSIGHTS_RELATIVE_URL} doesn't return geolocation from client's context`, async ({
      page,
      request,
    }) => {
      const insightsResponse = await getInsights({ request, page });
      expect(insightsResponse.status(), "Response status should be 200").toBe(
        200,
      );
      const insightsIpData = await insightsResponse.json();
      const softExpect = expect.configure({ soft: true });

      softExpect(
        insightsIpData.latitude,
        `'latitude' value should NOT equal to ${fakeCoordinates.latitude}`,
      ).not.toEqual(fakeCoordinates.latitude);
      softExpect(
        insightsIpData.longitude,
        `'longitude' value should NOT equal to ${fakeCoordinates.longitude}`,
      ).not.toEqual(Math.floor(fakeCoordinates.longitude));
    });
  },
);

for (const httpMethod of UNSUPPORTED_HTTP_METHODS) {
  test(
    `${INSIGHTS_RELATIVE_URL} handles unsupported ${httpMethod} http method properly`,
    {
      tag: ["@api", "@insights"],
    },
    async ({ request, page }) => {
      const insightsResponse = await getInsightsUsingHttpMethod({
        request,
        page,
        httpMethod,
        options: { data: {} },
      });
      expect(insightsResponse.status(), "Response status should be 405").toBe(
        405,
      );
      expect(
        insightsResponse.statusText(),
        "Response status should be 'Method Not Allowed'",
      ).toBe("Method Not Allowed");
    },
  );
}

test.describe(
  "when runs through proxy",
  {
    tag: ["@api", "@insights"],
  },
  () => {
    const proxy = envConfig().PROXY;
    test.use({
      proxy,
    });

    test(
      `${INSIGHTS_RELATIVE_URL} returns IP data for appropriate proxy server`,
      {
        tag: ["@api", "@insights"],
      },
      async ({ request, page }) => {
        expect(proxy, "External proxy should be set up").not.toBeUndefined();
        const insightsResponse = await getInsights({
          request,
          page,
        });
        const insightsIpData = await insightsResponse.json();
        const softExpect = expect.configure({ soft: true });

        softExpect(
          insightsIpData.ip,
          `'ip' value should derive from proxy and equal to ${proxy?.server.split(":")[0]}`,
        ).toEqual(proxy?.server.split(":")[0]);
        softExpect(
          insightsIpData.city,
          `'city' value should derive from proxy and equal to ${proxy?.city}`,
        ).toEqual(proxy?.city);
        softExpect(
          insightsIpData.country,
          `'country' value should derive from proxy and equal to ${proxy?.country}`,
        ).toEqual(proxy?.country);
      },
    );
  },
);

//TODO: investigate option to start chromium with vpn extension + connect to some vpn server in fixture
// Then run GET "/v1/helpers/ips/insights" and check that IP data correspond to vpn server + 'protected' is true

test.describe(
  "when request has fuzz headers",
  {
    tag: ["@api", "@insights"],
  },
  () => {
    for (const header of INVALID_HEADERS) {
      test(`${INSIGHTS_RELATIVE_URL} handles ${header} header`, async ({
        request,
        page,
      }) => {
        const insightsResponse = await getInsights({
          request,
          page,
          options: { headers: { "X-Fuzz": header } },
        });
        expect(insightsResponse.status(), "Response status should be 200").toBe(
          200,
        );
        const insughtsResponseBody = await insightsResponse.json();
        expect(
          insughtsResponseBody.ip,
          `'ip' value should be any string`,
        ).toEqual(expect.any(String));
      });
    }
  },
);

// TODO: clarify the rate limit for service and if 429 should be returned. Rewrite test in performance tool
test(
  `${INSIGHTS_RELATIVE_URL} does not return 429 Too Many Requests for 100 concurrent requests`,
  {
    tag: ["@api", "@insights"],
  },
  async ({ request, page }) => {
    const CONCURRENT_REQUESTS = 100;
    const promises = [];

    // Queue all requests as close to simultaneously as possible
    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
      promises.push(getInsights({ request, page }));
    }

    const responses = await Promise.all(promises);
    const throtledResponses = responses.filter(
      (r) => r.status() === 429,
    ).length;
    expect(
      throtledResponses,
      `service should properly respond for each of ${CONCURRENT_REQUESTS} concurrent requests`,
    ).toEqual(0);
  },
);

test(
  `Response from ${INSIGHTS_RELATIVE_URL} hides server/internal headers`,
  {
    tag: ["@api", "@insights"],
  },
  async ({ request, page }) => {
    const insightsResponse = await getInsights({ request, page });
    const headers = insightsResponse.headers();
    const sensitiveHeaders = [
      "server",
      "x-powered-by",
      "x-aspnet-version",
      "x-internal-ip",
    ];

    sensitiveHeaders.forEach((header) => {
      expect
        .soft(headers[header], `Response should not contain '${header}' header`)
        .toBeUndefined();
    });
  },
);

test(
  `Mandatory security headers are set in response for ${INSIGHTS_RELATIVE_URL}`,
  {
    tag: ["@api", "@insights"],
  },
  async ({ request, page }) => {
    const insightsResponse = await getInsights({ request, page });
    const headers = insightsResponse.headers();
    const softExpect = expect.configure({ soft: true });

    softExpect(
      headers["x-content-type-options"],
      `response header 'x-content-type-options' should have value 'nosniff'`,
    ).toBe("nosniff");
    softExpect(
      headers["x-frame-options"],
      `response header 'x-frame-options' should have value 'deny'`,
    ).toBe("deny");
    softExpect(
      headers["strict-transport-security"],
      `response header 'strict-transport-security' should contain 'max-age' value`,
    ).toMatch(/max-age=\d+/i);
  },
);

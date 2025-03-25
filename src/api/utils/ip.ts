import { IPFlare, IPGeolocationResponse } from "ipflare";
import publicIp from "public-ip";
import envConfig from "../../utils/envConfig";
import test from "@playwright/test";

export enum HttpMethods {
  HEAD = "HEAD",
  FETCH = "FETCH",
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const getpublicIpAddress = async (): Promise<string> => {
  return await test.step(`user gets their public IP address using 'public-ip' tool`, async () => {
    return await publicIp.publicIpv4();
  });
};

export const getPublicIpInfo = async (): Promise<IPGeolocationResponse> => {
  const ipAddress = await getpublicIpAddress();
  return await test.step(`user gets expected info from 'ipflare' service for IP address ${ipAddress}`, async () => {
    const geolocator = new IPFlare({
      apiKey: envConfig().IPFLAIR_API_KEY,
    });
    return geolocator.lookup(ipAddress, {
      include: {
        asn: true,
        isp: true,
      },
    });
  });
};

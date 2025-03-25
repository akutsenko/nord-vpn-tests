export const getProxy = (proxyUrl: string | undefined) => {
  if (proxyUrl) {
    const url = new URL(proxyUrl);
    return {
      server: url.host,
      username: url.username,
      password: url.password,
      country: url.searchParams.get("country") ?? "",
      city: url.searchParams.get("city") ?? undefined,
    };
  } else {
    return undefined;
  }
};

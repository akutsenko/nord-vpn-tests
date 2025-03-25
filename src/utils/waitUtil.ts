import { getRandomNumberWithinRange } from "./numberUtil";

export const waitForRandomTimeoutWithinRange = async (
  minSeconds: number,
  maxSeconds: number,
): Promise<void> => {
  const timeoutInSeconds = getRandomNumberWithinRange(minSeconds, maxSeconds);
  await new Promise((resolve) => setTimeout(resolve, timeoutInSeconds * 1000));
};

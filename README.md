# nordvpn-e2e-tests

Automation framework to support API and UI E2E testing

## Prerequisites

Ensure you have node >=18 installed

By default, tests load environment variables from `.env.test`. To use a different file (e.g., `.env.dev`), specify the ENVIRONMENT variable when running tests:

```sh
ENVIRONMENT="dev" npx playwright test
```

There are 2 sensitive env variables(secrets). Their values should be stored as secrets on CI server and used in the pipeline(like it's done in `.github/workflows/playwright.yml`). Please reach out to recruiter to get them and paste their values into appropriate `.env.<ENVIRONMENT>` file

```sh
IPFLAIR_API_KEY="<some value>"
PROXY_URL="http://<username>:<password>@<ipAddress>:<port>/?country=<countryName>&city=<cityName>"
```

## Step 1 - Install Dependencies

Navigate into the root project directory where the `package.json` is located

Install the dependencies

```sh
npm ci
```

Install playwright with dependencies

```sh
npx playwright install --with-deps
```

## Step 2 - Run Tests Locally:

Run all tests (both UI and API):

```sh
npm run test
```

Run only P0 tests:

```sh
npm run test-p0
```

Run only API tests:

```sh
npm run test-api
```

Run only UI tests:

```sh
npm run test-ui
```

Run custom test set with custom configuration, e.g. to run tests with `@iam` tag in Firefox browser and take env variables from `.env.dev` file:

```sh
ENVIRONMENT="dev" BROWSER="firefox" npx playwright test --grep @iam
```

`Note:` Currently all API tests are always executed in chromium, this can be changed in `projects` section inside [playwright.config.ts](playwright.config.ts)

## Step 3 - View test results:

Run the tests report against localhost:

```sh
npm run test-report

OR

npx playwright show-report
```

## Step 4 - Run Tests in Docker container:

API tests require 2 secrets to be added to `.env.test` file before building docker image. Please refer to [Prerequisites](#prerequisites)

Navigate into the root project directory where the `Dockerfile` is located

```sh
docker build -t nordvpn/playwright-tests-main:latest .
```

This will generate new docker image `nordvpn/playwright-tests-main` with the `latest` tag.

Run the tests in Docker container:

```sh
docker run --rm --init --ipc=host \
    -v ./playwright-report:/app/playwright-report \
    -e TAGS="<enter your tags here separated by | symbol>" \
    -e BROWSER="firefox or chromium or webkit, defaults to chromium" \
    -e WORKERS=<number of workers, defaults to 3> \
    -e SHARD=<shardIndex/totalShards, defaults to 1/1> \
    nordvpn/playwright-tests-main:latest
```

e.g. to run tests with either of @iam or p0 tags in webkit browser using 2 workers(parallel threads):

```sh
docker run --rm --init --ipc=host \
    -v ./playwright-report:/app/playwright-report \
    -e TAGS="@iam|@p0" \
    -e BROWSER="webkit" \
    -e WORKERS=2 \
    nordvpn/playwright-tests-main:latest
```

The reports will be available in the `${PWD}/playwright-report` folder. You can launch them using [playwright](#step-3---view-test-results) or VSCode plugin

## Useful VSCode Plugins:

Run tests directly from VSCode - <https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright>

View the test report trace without the CLI - <https://marketplace.visualstudio.com/items?itemName=ryanrosello-og.playwright-vscode-trace-viewer>

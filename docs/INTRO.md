# DoubleUp SDK Docs

## Intro

DoubleUp is the premier gaming protocol. An SDK is being offered to build products on top of existing games. Each game will have it’s own section, the available calls, examples of how to use and error explanation, but first we will start with the DoubleUpClient.

## Dependencies

DoubleUp is built on Sui, thus the TS SDK for Sui will be required a direct dependency. Several types and instances are required from it. 

**Installing the dependency**:

 

```bash
pnpm i @mysten/sui
#or
npm i @mysten/sui
#or
yarn i @mysten/sui
```

It is recommended that you always use the latest client, since the TS SDK evolves and changes very fast. Using older versions might result in unexpected errors or typescript might fail to compile.

Installing the latest version requires adding `@latest` after `@mysten/sui` , for example:

```bash
pnpm i @mysten/sui@latest
```

### DoubleUpSDK package

To install the package just:

```bash
pnpm i doubleup
#or
npm i doubleup
#or
yarn i doubleup
```

## Client

The DoubleUpClient is a class that implements all the functionality of the SDK. When building on top of DoubleUp the first step is to create a new client.

This client should be imported across your app, whenever there is a need to call the functions that it exposes.

### Creating the client

In order to create the client only two arguments are required. The first argument is named `partnerNftListId` and it is meant for yet not implemented functionality thus for the moment the value should be just `"0x0"` and the second argument is `suiClient` which is of type `SuiGrpcClient` from `@mysten/sui/grpc` (Sui's JSON-RPC API is deprecated, so the SDK talks to fullnodes over gRPC).

Thus, assuming that you have the `@mysten/sui` dependency installed, you should first create a SuiGrpcClient, prior to instantiating a DoubleUpClient.

**Sample Code:**

The following code should be saved in a separate file, also you may wish to export the suiClient as well depending on your use case:

```tsx
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { DoubleUpClient } from "doubleup";

const suiMainnetClient = new SuiGrpcClient({
  network: "mainnet",
  baseUrl: "https://fullnode.mainnet.sui.io:443",
});

export const DBClient = new DoubleUpClient({
  partnerNftListId: "0x0",
  suiClient: suiMainnetClient,
});
```

If you have your own fullnode, or a specific fullnode that you want to use, note that it must serve the Sui fullnode gRPC(-web) API (plain JSON-RPC-only endpoints will not work):

```tsx
const fullnodeURL = "https://my.fullnode.url:443"
const suiClient = new SuiGrpcClient({
	network: "mainnet",
	baseUrl: fullnodeURL
});

export const DBClient = new DoubleUpClient({
  partnerNftListId: "0x0",
  suiClient,
}); 
```

> **Note:** kiosk-related functionality still uses a JSON-RPC client internally, because `@mysten/kiosk` does not support the gRPC client yet. By default the SDK creates one pointed at the public mainnet fullnode; you can pass your own `kioskClient` to the DoubleUpClient constructor to override this.

**Errors**

Errors are not expected at this stage, the only possible issue would be typescript complaining that the types are not correct for the `SuiClient` , it will say something along the lines of `There is no overload...` , this means that there is a mismatch between the versions of `@mysten/sui` that the SDK is using compared to the one you installed. Make sure you installed the latest both for the Sui TS SDK and the DoubleUpSDK. If the error persists please contact us on Telegram or Discord.

You may check the version of the TS SDK in the `package-lock.json` and install that version of the Sui TS SDK explicitly, until we update our SDK:

```bash
pnpm i @mysten/sui@1.13.0 
# This is an example find the exact version in the package-lock.json
```

## Next
Checkout the [Blackjack docs](blackjack/doc.md) to get started with one of the most popular games on DoubleUp.
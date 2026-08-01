import type { SuiGrpcClient } from "@mysten/sui/grpc";
import type { Signer } from "@mysten/sui/cryptography";
import type { Transaction } from "@mysten/sui/transactions";

// Shared helper for the test harness: executes a transaction and throws on
// on-chain failure, mirroring the old JSON-RPC status check.
export const signAndExecute = async (
  client: SuiGrpcClient,
  signer: Signer,
  transaction: Transaction
) => {
  const result = await client.signAndExecuteTransaction({
    signer,
    transaction,
    include: { effects: true, events: true, objectTypes: true },
  });

  const executed = result.Transaction ?? result.FailedTransaction;

  if (!executed.status.success) {
    throw new Error(JSON.stringify(executed.status.error));
  }

  // .digest, .effects.changedObjects, .events[].json, .objectTypes
  return executed;
};

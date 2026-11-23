import { definePlugin } from "nitro";

import { dbPool } from "@/db/pool";

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook("close", async () => {
    console.log("[SYSTEM] Initiating close sequence...");
    if (!dbPool.ending) {
      await dbPool.end();
    }
    console.log("[SYSTEM] Close sequence complete.");
    console.log("[SYSTEM] The server has successfully shutdown.");
  });
});

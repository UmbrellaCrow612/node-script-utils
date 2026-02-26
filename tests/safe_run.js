import { safeRun } from "../dist/index.js";

safeRun(
  () => {
    console.log("yo");
  },
  {
    exitFailCode: 1,
    exitOnFailed: true,
    onAfter: () => {
      console.log("after");
    },
    onBefore: () => {
      console.log("onBefore");
    },
    onFail: () => {
      console.log("onFail");
    },
    timeoutMs: 100,
  },
);

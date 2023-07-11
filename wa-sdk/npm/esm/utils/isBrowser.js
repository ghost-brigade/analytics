import * as dntShim from "../_dnt.shims.js";
export const isBrowser = () => typeof dntShim.dntGlobalThis !== "undefined";

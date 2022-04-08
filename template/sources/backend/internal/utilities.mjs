/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

// Import all classes
export * from "./utilities/api.mjs";
export * from "./utilities/file.mjs";
export * from "./utilities/type.mjs";
export * from "./utilities/validator.mjs";
export * from "./utilities/authority.mjs";

// Import all functions
export * from "./utilities/function.mjs";

// Extend classes
Date.prototype.getEpochDay = function () { return Math.floor(this.getTime() / (1000 * 60 * 60 * 24)); };
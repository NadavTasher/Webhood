/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

// Import all classes
export { API } from "./utilities/api.mjs";
export { File } from "./utilities/file.mjs";
export { Type } from "./utilities/type.mjs";
export { Validator } from "./utilities/validator.mjs";
export { Token, Authority } from "./utilities/authority.mjs";

// Import all functions
export {
	charset,
	execute,
	hash,
	hmac,
	join,
	random,
	render
} from "./utilities/function.mjs";

// Extend classes
Date.prototype.getEpochDay = function () { return Math.floor(this.getTime() / (1000 * 60 * 60 * 24)); };
/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import all subclasses
import { File } from "./utilities/file.mjs";
import { Hash } from "./utilities/hash.mjs";
import { Type } from "./utilities/type.mjs";
import { Charset } from "./utilities/charset.mjs";
import { Password } from "./utilities/password.mjs";
import { Validator } from "./utilities/validator.mjs";
import { Token, Authority } from "./utilities/authority.mjs";

// Export all subclasses
export {
    File,
    Hash,
    Type,
    Token,
    Charset,
    Password,
    Validator,
    Authority
};

// Extend classes
Date.prototype.getEpochDay = function () { return Math.floor(this.getTime() / (1000 * 60 * 60 * 24)); };
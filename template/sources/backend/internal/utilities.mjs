/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import all subclasses
import { File } from "./utilities/file.mjs";
import { Hash } from "./utilities/hash.mjs";
import { Type } from "./utilities/type.mjs";
import { Token } from "./utilities/token.mjs";
import { Charset } from "./utilities/charset.mjs";
import { Password } from "./utilities/password.mjs";
import { Validator } from "./utilities/validator.mjs";

// Export all subclasses
export {
    File,
    Hash,
    Type,
    Token,
    Charset,
    Password,
    Validator
};

// Extend classes
Date.prototype.getEpochDay = function () { return Math.floor(this.getTime() / (1000 * 60 * 60 * 24)); };
/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import readline
import REPL from "repl";

// Import utilities
import {
    File,
    Hash,
    Type,
    Token,
    Charset,
    Password,
    Validator
} from "./internal/utilities.mjs";

// Initialize REPL
let mREPL = REPL.start();

// Update context
mREPL.context.File = File;
mREPL.context.Hash = Hash;
mREPL.context.Type = Type;
mREPL.context.Token = Token;
mREPL.context.Charset = Charset;
mREPL.context.Password = Password;
mREPL.context.Validator = Validator;
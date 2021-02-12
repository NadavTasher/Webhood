/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import readline
import REPL from "repl";

// Import utilities
import { Utilities, Validator, Hash, Password, Authority, Database } from "./internal/utilities.mjs";

// Initialize REPL
let mREPL = REPL.start();

// Update context
mREPL.context.Utilities = Utilities;
mREPL.context.Validator = Validator;
mREPL.context.Hash = Hash;
mREPL.context.Password = Password;
mREPL.context.Authority = Authority;
mREPL.context.Database = Database;
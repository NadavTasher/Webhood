/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

// Import readline
import REPL from "repl";

// Import utilities
import * as utilities from "./internal/utilities.mjs";

// Initialize REPL
let mREPL = REPL.start();

// Update context with utilities
for (const [key, value] of Object.entries(utilities))
    mREPL.context[key] = value;
/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

// Import readline
import REPL from "repl";

// Import utilities
import {
    // Import functions
    charset,
	execute,
	hash,
	hmac,
	join,
	random,
	render,

    // Import classes
    API, 
    File, 
    Type, 
    Token, 
    Authority, 
    Validator
 } from "./internal/utilities.mjs";

// Initialize REPL
let mREPL = REPL.start();

// Update context with utilities
mREPL.context.charset = charset;
mREPL.context.execute = execute;
mREPL.context.hash = hash;
mREPL.context.hmac = hmac;
mREPL.context.join = join;
mREPL.context.random = random;
mREPL.context.render = render;

mREPL.context.API = API;
mREPL.context.File = File;
mREPL.context.Type = Type;
mREPL.context.Token = Token;
mREPL.context.Authority = Authority;
mREPL.context.Validator = Validator;
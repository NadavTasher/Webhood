/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Modules/
 **/

// Load the reCAPTCHA script

// Create a script tag
let scriptElement = document.createElement("script");
// Prepare the script tag
scriptElement.setAttribute("id", "script:recaptcha");
scriptElement.setAttribute("type", "text/javascript");
scriptElement.setAttribute("src", "https://www.google.com/recaptcha/api.js");
// Append to head
document.head.appendChild(scriptElement);
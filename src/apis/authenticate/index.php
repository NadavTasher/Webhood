<?php

// Include APIs
include_once __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "apis" . DIRECTORY_SEPARATOR . "APIs.php";

// Initialize the API
Authenticate::initialize();

// Handle the API call
Authenticate::handle();
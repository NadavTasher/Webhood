<?php

/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

/**
 * Authenticate API for user authentication.
 */
class Authenticate
{
    // Constant names
    public const API = "authenticate";

    // Cell names
    private const CELL_SALT = "salt";
    private const CELL_HASH = "hash";
    private const CELL_LOCK = "lock";

    // Constant lengths
    private const LENGTH_SALT = 128;
    private const LENGTH_NAME = 2;
    private const LENGTH_PASSWORD = 8;

    // Constant locks
    private const LOCK_VALIDATE = false;
    private const LOCK_SIGNIN = false;
    private const LOCK_SIGNUP = false;

    // Authority object
    private static Authority $authority;

    /**
     * Handles authentication requests with action and parameters.
     * @param string $action Action
     * @param array $parameters Parameters
     * @return mixed Result
     */
    public static function handle($action, $parameters)
    {
        // Make sure the authority is initiated.
        self::$authority = new Authority(self::API);

        // Check action
        if ($action === "validate") {
            // Validate locks
            if (self::LOCK_VALIDATE)
                throw new Error("Validation not allowed");

            // Validate parameters
            if (!isset($parameters->token) || !is_string($parameters->token))
                throw new Error("Parameter error");

            // Validate token
            return self::validate($parameters->token);
        } else if ($action === "signIn") {
            // Validate locks
            if (self::LOCK_SIGNIN)
                throw new Error("Sign-In not allowed");

            // Validate parameters
            if (!isset($parameters->name) || !isset($parameters->password) || !is_string($parameters->name) || !is_string($parameters->password))
                throw new Error("Parameter error");

            // Sign the user in
            return self::signIn($parameters->name, $parameters->password);
        } else if ($action === "signUp") {
            // Validate locks
            if (self::LOCK_SIGNUP)
                throw new Error("Sign-Up not allowed");

            // Validate parameters
            if (!isset($parameters->name) || !isset($parameters->password) || !is_string($parameters->name) || !is_string($parameters->password))
                throw new Error("Parameter error");

            // Sign the user up
            return self::signUp($parameters->name, $parameters->password);
        }
        // Throw error
        throw new Error("Unhandled hook");
    }

    /**
     * Authenticates using a bearer token.
     * @param string $token Token
     * @return string User ID
     */
    public static function validate($token)
    {
        // Validate using authority
        return self::$authority->validate($token);
    }

    /**
     * Signs up a new user.
     * @param string $name Name
     * @param string $password Password
     * @return string User ID
     */
    public static function signUp($name, $password)
    {
        // Validate name
        if (strlen($name) < self::LENGTH_NAME)
            throw new Error("Name too short");
        // Validate password
        if (strlen($password) < self::LENGTH_PASSWORD)
            throw new Error("Password too short");
        // Create user ID
        $userID = $name;
        // Make sure the user does not exist
        if (Database::checkEntry(self::API, $userID))
            throw new Error("User already exists");
        // Insert a new entry
        Database::insertEntry(self::API, $userID);
        // Generate salt and hash
        $salt = Base::random(self::LENGTH_SALT);
        $hash = hash("sha256", $password . $salt);
        $time = strval(0);
        // Create user cells
        Database::insertCell(self::API, $userID, self::CELL_SALT);
        Database::insertCell(self::API, $userID, self::CELL_HASH);
        Database::insertCell(self::API, $userID, self::CELL_LOCK);
        // Set user information
        Database::writeCell(self::API, $userID, self::CELL_SALT, $salt);
        Database::writeCell(self::API, $userID, self::CELL_HASH, $hash);
        Database::writeCell(self::API, $userID, self::CELL_LOCK, $time);
        // Return a success result
        return $userID;
    }

    /**
     * Signs in an existing user.
     * @param string $name Name
     * @param string $password Password
     * @return string Token
     */
    public static function signIn($name, $password)
    {
        // Create user ID
        $userID = $name;
        // Make sure the user exists
        if (!Database::checkEntry(self::API, $userID))
            throw new Error("User does not exist");
        // Get keystore values
        $lock = Database::readCell(self::API, $userID, self::CELL_LOCK);
        $salt = Database::readCell(self::API, $userID, self::CELL_SALT);
        $hash = Database::readCell(self::API, $userID, self::CELL_HASH);
        // Make sure the user is not locked
        if (intval($lock) > time())
            throw new Error("User is locked");
        // Check password match
        if (hash("sha256", $password . $salt) === $hash) {
            // Issue a new token
            return self::$authority->issue($userID);
        } else {
            // Calculate new lock time
            $time = strval(time() + 10);
            // Lock the user
            Database::writeCell(self::API, $userID, self::CELL_LOCK, $time);
            // Throw an error
            throw new Error("Wrong password");
        }
    }
}
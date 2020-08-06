<?php

/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

/**
 * Base API for issuing and validating tokens.
 */
class Authority
{
    // Constants
    public const TABLE = "configuration";
    public const ENTRY = "authority";

    // Constants
    private const LENGTH = 512;
    private const VALIDITY = 31 * 24 * 60 * 60;
    private const SEPARATOR = ":";

    // Authority secret
    private string $secret;

    /**
     * Authority constructor.
     * @param string $name Name
     */
    public function __construct($name)
    {
        // Make sure authority entry exists
        if (!Database::checkEntry(self::TABLE, self::ENTRY)) {
            // Create entry
            Database::insertEntry(self::TABLE, self::ENTRY);
        }

        // Make sure secret exists
        if (!Database::checkCell(self::TABLE, self::ENTRY, $name)) {
            // Create secret cell
            Database::insertCell(self::TABLE, self::ENTRY, $name);

            // Write secret
            Database::writeCell(self::TABLE, self::ENTRY, $name, Base::random(64));
        }

        // Read secret
        $this->secret = Database::readCell(self::TABLE, self::ENTRY, $name);
    }

    /**
     * Creates a token.
     * @param string | stdClass | array $data Data
     * @param float | int $validity Validity time
     * @return string Token
     */
    public function issue($data, $validity = self::VALIDITY)
    {
        // Create token object
        $tokenObject = new stdClass();
        $tokenObject->data = $data;
        $tokenObject->expiry = time() + intval($validity);
        // Create token string
        $tokenString = bin2hex(json_encode($tokenObject));
        // Calculate signature
        $tokenSignature = hash_hmac("sha256", $tokenString, $this->secret);
        // Create parts
        $tokenSlices = [$tokenString, $tokenSignature];
        // Return compiled token
        return implode(self::SEPARATOR, $tokenSlices);
    }

    /**
     * Validates a token.
     * @param string $token Token
     * @return string | stdClass | array Data
     */
    public function validate($token)
    {
        // Separate string
        $tokenSlices = explode(self::SEPARATOR, $token);
        // Validate content count
        if (count($tokenSlices) !== 2)
            throw new Error("Invalid token format");
        // Store parts
        $tokenString = $tokenSlices[0];
        $tokenSignature = $tokenSlices[1];
        // Validate signature
        if (hash_hmac("sha256", $tokenString, $this->secret) !== $tokenSignature)
            throw new Error("Invalid token signature");
        // Parse token object
        $tokenObject = json_decode(hex2bin($tokenString));
        // Validate structure
        if (!isset($tokenObject->data) || !isset($tokenObject->expiry))
            throw new Error("Invalid token structure");
        // Validate expiry
        if (time() > $tokenObject->expiry)
            throw new Error("Invalid token expiry");
        // Return token
        return $tokenObject->data;
    }
}
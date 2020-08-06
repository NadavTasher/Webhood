<?php

/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

class Token
{

    // Token delimiter
    private const DELIMITER = ":";

    /**
     * Issues a token.
     * @param mixed $value Value
     * @return string Token
     */
    public static function issue($value)
    {
        // Create token string
        $tokenString = bin2hex(json_encode($value));

        // Calculate signature
        $tokenSignature = hash_hmac("sha256", $tokenString, getenv("KEY"));

        // Return compiled token
        return $tokenString . self::DELIMITER . $tokenSignature;
    }

    /**
     * Validates a token.
     * @param string $token Token
     * @return mixed Value
     */
    public static function validate($token)
    {
        // Slice token
        $tokenSlices = explode(self::DELIMITER, $token);

        // Validate content count
        if (count($tokenSlices) !== 2)
            throw new Error("Invalid token format");

        // Validate signature
        if (hash_hmac("sha256", $tokenSlices[0], getenv("KEY")) !== $tokenSlices[1])
            throw new Error("Invalid token signature");

        // Return token
        return json_decode(hex2bin($tokenSlices[0]));
    }
}
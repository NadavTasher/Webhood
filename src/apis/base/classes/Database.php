<?php

/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

/**
 * Base API for storage communication.
 */
class Database
{
    /**
     * Executes a remote database operation.
     * @param string $action Action
     * @param array $parameters Parameters
     * @return mixed Result
     */
    private static function call($action, $parameters)
    {
        // Fetch environment variables
        $url = getenv("DATABASE_URL");
        $scope = getenv("DATABASE_SCOPE");
        $password = getenv("DATABASE_PASSWORD");

        // Append the scope parameter
        $parameters["scope"] = $scope;

        // Append password parameter if needed
        if ($password)
            $parameters["password"] = $password;

        // Call the API
        return Base::call($url, $action, $parameters);
    }

    /**
     * Inserts a database table entry.
     * @param string $table Table
     * @param string $entry Entry
     * @return mixed Result
     */
    public static function insertEntry($table, $entry)
    {
        // Execute call
        return self::call("insertEntry", [
            "table" => $table,
            "entry" => $entry
        ]);
    }

    /**
     * Removes a database table entry.
     * @param string $table Table
     * @param string $entry Entry
     * @return mixed Result
     */
    public static function removeEntry($table, $entry)
    {
        // Execute call
        return self::call("removeEntry", [
            "table" => $table,
            "entry" => $entry
        ]);
    }

    /**
     * Check whether a database table entry exists.
     * @param string $table Table
     * @param string $entry Entry
     * @return mixed Result
     */
    public static function checkEntry($table, $entry)
    {
        // Execute call
        return self::call("checkEntry", [
            "table" => $table,
            "entry" => $entry
        ]);
    }

    /**
     * Inserts a database table cell.
     * @param string $table Table
     * @param string $entry Entry
     * @param string $cell Cell
     * @return mixed Result
     */
    public static function insertCell($table, $entry, $cell)
    {
        // Execute call
        return self::call("insertCell", [
            "table" => $table,
            "entry" => $entry,
            "cell" => $cell
        ]);
    }

    /**
     * Removes a database table cell.
     * @param string $table Table
     * @param string $entry Entry
     * @param string $cell Cell
     * @return mixed Result
     */
    public static function removeCell($table, $entry, $cell)
    {
        // Execute call
        return self::call("removeCell", [
            "table" => $table,
            "entry" => $entry,
            "cell" => $cell
        ]);
    }

    /**
     * Check whether a database table cell exists.
     * @param string $table Table
     * @param string $entry Entry
     * @param string $cell Cell
     * @return mixed Result
     */
    public static function checkCell($table, $entry, $cell)
    {
        // Execute call
        return self::call("checkCell", [
            "table" => $table,
            "entry" => $entry,
            "cell" => $cell
        ]);
    }

    /**
     * Reads a database table cell.
     * @param string $table Table
     * @param string $entry Entry
     * @param string $cell Cell
     * @return mixed Result
     */
    public static function readCell($table, $entry, $cell)
    {
        // Execute call
        return self::call("readCell", [
            "table" => $table,
            "entry" => $entry,
            "cell" => $cell
        ]);
    }

    /**
     * Writes a database table cell.
     * @param string $table Table
     * @param string $entry Entry
     * @param string $cell Cell
     * @param string $value Value
     * @return mixed Result
     */
    public static function writeCell($table, $entry, $cell, $value)
    {
        // Execute call
        return self::call("writeCell", [
            "table" => $table,
            "entry" => $entry,
            "cell" => $cell,
            "value" => $value
        ]);
    }
}
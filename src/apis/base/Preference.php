<?php

/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

/**
 * Base API for configuring variables.
 */
class Preference
{
    // Constants
    public const API = "preference";

    // Preference name
    private string $name;

    /**
     * Preference constructor.
     * @param string $name Preference name
     */
    public function __construct($name)
    {
        $this->name = $name;
    }

    /**
     * Sets the preference value.
     * @param mixed $value Value
     */
    public function set($value = null)
    {
        // Create the path
        $path = Base::file($this->name, self::API);
        // Check if the value is null
        if ($value === null) {
            // Remove the value
            unlink($path);
        } else {
            // Update the value
            file_put_contents($path, json_encode($value));
        }
    }

    /**
     * Gets the preference value.
     * @param mixed $default Default value
     * @return mixed Value
     */
    public function get($default = null)
    {
        // Create the path
        $path = Base::file($this->name, self::API);
        // Check if the value exists
        if (file_exists($path) && is_file($path)) {
            // Read and return value
            return json_decode(file_get_contents($path));
        } else {
            return $default;
        }
    }
}
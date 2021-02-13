/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Extend classes
Date.prototype.getEpochDay = function () { return Math.floor(this.getTime() / (1000 * 60 * 60 * 24)); };
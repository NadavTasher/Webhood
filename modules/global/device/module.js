/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Modules/
 **/

/**
 * Checks if the device is a mobile device.
 * @return {boolean}
 */
export function isMobile() {
    return window.screen.height > window.screen.width;
}

/**
 * Checks if the device is a desktop device.
 * @return {boolean}
 */
export function isDesktop() {
    return window.screen.height < window.screen.width;
}

/**
 * Checks if the device is a mobile safari device.
 * @return {boolean}
 */
export function isMobileSafari() {
    return Device.isAgent("iphone", "ipad", "ipod");
}

/**
 * Checks if the device is a mobile android device.
 * @return {boolean}
 */
export function isMobileAndroid() {
    return Device.isAgent("android");
}

/**
 * Checks if the user-agent(s) specified exist.
 * @param name Name
 * @return {boolean}
 */
export function isAgent(name) {
    return (Array.from(arguments).map((device) => window.navigator.userAgent.toLowerCase().includes(device))).includes(true);
}
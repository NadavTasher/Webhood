import os
import json
import redis
import functools

# Create a generic redis connection
DATABASE = redis.Redis(unix_socket_path="/run/redis.sock", decode_responses=True)

DEFAULT = object()

try:
    # Python 3 mapping
    from collections.abc import MutableMapping, Mapping
except:
    # Python 2 mapping
    from collections import MutableMapping, Mapping


class AdvancedMutableMapping(MutableMapping):

    def setdefaults(self, *dictionaries, **values):
        # Update values to include all dicts
        for dictionary in dictionaries:
            values.update(dictionary)

        # Loop over all items and set the default value
        for key, value in values.items():
            self.setdefault(key, value)


class RedisMapping(AdvancedMutableMapping):

    def __init__(self, name, redis):
        # Set the internal name and redis
        self._name = name
        self._redis = redis

    def __getitem__(self, key):
        # Fetch the item
        self._redis.json().get(key, self._name)

        # Resolve item path
        item_path = self._item_path(key)

        # Lock the item for modifications
        with self._lock(item_path):
            return self._internal_get(key)

    def __setitem__(self, key, value):
        # Resolve item path
        item_path = self._item_path(key)

        # Lock the item for modifications
        with self._lock(item_path):
            return self._internal_set(key, value)

    def __delitem__(self, key):
        # Resolve item path
        item_path = self._item_path(key)

        # Lock the item for modifications
        with self._lock(item_path):
            return self._internal_delete(key)

    def __contains__(self, key):
        # Resolve item path
        item_path = self._item_path(key)

        # Check if paths exist
        with self._lock(item_path):
            return self._internal_has(item_path)

    def __iter__(self):
        # List all of the items in the path
        for item_path in self._internal_iterate():
            # Read the key contents and decode
            with self._lock(item_path):
                key_contents = self._decode(self._key_storage.readlink(os.path.join(item_path, FILE_KEY)))

            # Yield the key contents
            yield key_contents

    def __len__(self):
        # Count all key files
        return len(list(self._internal_iterate()))

    def __repr__(self):
        # Format the data like a dictionary
        return "{%s}" % ", ".join("%r: %r" % item for item in self.items())

    def __eq__(self, other):
        # Make sure the other object is a mapping
        if not isinstance(other, Mapping):
            return False

        # Make sure all keys exist
        if set(self.keys()) != set(other.keys()):
            return False

        # Make sure all the values equal
        for key in self:
            if self[key] != other[key]:
                return False

        # Comparison succeeded
        return True

    def pop(self, key, default=DEFAULT):
        try:
            # Resolve item path
            item_path = self._item_path(key)

            # Check if paths exist
            with self._lock(item_path):
                # Fetch the value
                value = self._internal_get(key)

                # Check if the value is a keystore
                if isinstance(value, Mapping):
                    value = value.copy()

                # Delete the item
                self._internal_delete(key)

            # Return the value
            return value
        except KeyError:
            # Check if a default is defined
            if default != DEFAULT:
                return default

            # Reraise exception
            raise

    def popitem(self):
        # Convert self to list
        keys = list(self)

        # If the list is empty, raise
        if not keys:
            raise KeyError()

        # Pop a key from the list
        key = keys.pop()

        # Return the key and the value
        return key, self.pop(key)

    def copy(self):
        # Create initial bunch
        output = dict()

        # Loop over keys
        for key in self:
            # Fetch value of key
            value = self[key]

            # Check if value is a keystore
            if isinstance(value, Mapping):
                value = value.copy()

            # Update the bunch
            output[key] = value

        # Return the created output
        return output

    def clear(self):
        # Loop over keys
        for key in self:
            # Delete the item
            del self[key]

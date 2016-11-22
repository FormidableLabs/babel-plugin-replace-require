"use strict";

module.exports.trim = (val) => {
  let indent = null;

  return val
    .split("\n")
    // Capture indent
    .map((line) => {
      // First non-whitespace character is offset.
      if (indent === null) {
        const match = /^[ ]+/.exec(line);
        if (match) {
          indent = match[0];
        } else {
          // Remove leading newlines
          return null;
        }
      }

      return line;
    })
    // Remove leading empty lines
    .filter((line) => line !== null)
    // Remove indent
    .map((line) => line.replace(new RegExp(`^${indent}`), ""))
    // Back to string
    .join("\n");
};

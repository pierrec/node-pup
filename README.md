# Pipe and Unpipe streams

## Overview

As of node 0.8.x, there is no way to unpipe streams. This module attemps to fill the gap by providing a `pipe(source, destination[, options])` and `unpipe(source, destination)` functions working in tandem, to do piping and unpiping of streams.

## Usage

Install with

    npm install pup

Two functions are provided:

* `pipe(source, destination[, options])` : to be used to setup a pipe from source to destination. Same signature as the Stream#pipe method.
* `unpipe(source, destination)` : remove the pipe between source and destination. If there are many of those, only the first one is removed. Return `true` on successful removal, `false` otherwise.


## Example

``` javascript
var fs = require('fs')
var pup = require('pup')

var source = fs.readFileStream('test')
var wrong_destination = fs.readWriteStream('test2')
var destination = fs.readWriteStream('test.bak')

// Pipe to one destination
source.pause()
pup.pipe(source, wrong_destination)

// Then remove it and pipe to another
pup.unpipe(source, wrong_destination)
pup.pipe(source, destination)

// Copy the file test.js, which should only end up in test.bak
source.resume()
```

## Restrictions

This is a bit of a hack that relies on the assumption that there is the same `cleanup()` listener setup by the Stream#pipe method for the `end` event on the source and on the destination.


## License

MIT
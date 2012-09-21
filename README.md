# Pipe and Unpipe streams

## Overview

As of node 0.8.x, there is no way to unpipe streams. This module attemps to fill the gap by providing a `pipe(source, destination)` and `unpipe(source, destination)` functions working in tandem, to do piping and unpiping of streams.
This is a bit of a hack that relies on the assumption that there is a `cleanup()` listener for the `end` event on the source and destionation.

## Usage

Install with

    npm install pup

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
source.resume()
pup.pipe(source, destination)
```

## License

MIT
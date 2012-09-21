var fs = require('fs')
var pup = require('./index')

var source = fs.createReadStream('test.js')

source.on('end', function () {
	try {
		fs.unlinkSync('test2')
	} catch (e) {}
	try {
		fs.unlinkSync('test.bak')
	} catch (e) {}
})

var wrong_destination = fs.createWriteStream('test2')
var destination = fs.createWriteStream('test.bak')

// Pipe to one destination
source.pause()
pup.pipe(source, wrong_destination)

// Then remove it and pipe to another
pup.unpipe(source, wrong_destination)
source.resume()
pup.pipe(source, destination)
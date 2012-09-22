/**
  Provide a pipe function to be used instead of the Stream#pipe method.
  Provide an unpipe function.
 */

exports.pipe = pipe
exports.unpipe = unpipe

// source | dest
function pipe (source, dest, options) {
  // Standard Stream#pipe
  source.pipe(dest, options)

  // Keep track of the pipes and the associated cleanup functions
  source._pipes = source._pipes || []
  source._pipes.push(dest, last(source), last(dest))
}

function unpipe (source, dest) {
  // Find the destination in the saved pipes
  var pipes = source._pipes || []
  for (var i = 0, n = pipes.length; i < n ; i += 3) {
    if (pipes[i] === dest) {
      // Tidy up
      pipes[i+1]()
      pipes[i+2]()
      // Remove the reference to the destination
      pipes.splice(i, 3)
      if (pipes.length === 0) source._pipes = null

      return true
    }
  }
  // Destination not found
  return false
}

function last (s) {
  var arr = s.listeners('end')
  return arr[ arr.length-1 ]
}
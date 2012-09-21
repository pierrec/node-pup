/**
  Provide a pipe function to be used instead of the Stream#pipe method.
  Provide an unpipe function.
 */

exports.pipe = pipe
exports.unpipe = unpipe

// source | dest
function pipe (source, dest) {
  // Keep track of the pipes
  source._pipes = source._pipes || []
  source._pipes.push(dest)

  // Standard Stream#pipe
  source.pipe(dest)
}

function unpipe (source, dest) {
  // Find the destination in the saved pipes
  var pipes = source._pipes || []
  for (var idx = 0, n = pipes.length; idx < n ; idx++) {
    if (pipes[idx] === dest) break
  }
  // Destination not found
  if (idx === n) return false

  // Look for the cleanup listener for the destination
  var list = source.listeners('end')

  for (var i = 0, n = list.length; i < n; i++) {
    if ( list[i].name === 'cleanup' && --idx < 0 ) {
      // Tidy up
      list[i]()
      // Remove the reference to the destination
      pipes.splice(idx, 1)
      if (pipes.length === 0) source._pipes = null

      return true
    }
  }
  // This should not happen
  return false
}
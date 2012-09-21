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

  // Look for the cleanup listener for the given destination
  var sourceList = source.listeners('end')

  for (var i = 0, n = sourceList.length; i < n; i++) {
    if ( sourceList[i].name === 'cleanup' && --idx < 0 ) {
      // Check the same exists on the destination
      var destList = dest.listeners('end')

      for (var j = 0, m = destList.length; j < m; j++) {
        if ( destList[j] === sourceList[i] ) {
          // Tidy up
          sourceList[i]()
          // Remove the reference to the destination
          pipes.splice(idx, 1)
          if (pipes.length === 0) source._pipes = null

          return true
        }
      }

      return false
    }
  }
  // This should not happen
  return false
}
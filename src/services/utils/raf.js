import { now } from 'lodash'

const root = typeof window === 'undefined' ? global : window
const vendors = ['moz', 'webkit']
const suffix = 'AnimationFrame'
let funcRaf = root['request' + suffix]
let caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for (let i = 0; !funcRaf && i < vendors.length; i++) {
  funcRaf = root[vendors[i] + 'Request' + suffix]
  caf =
    root[vendors[i] + 'Cancel' + suffix] ||
    root[vendors[i] + 'CancelRequest' + suffix]
}

if (!funcRaf || !caf) {
  let last = 0
  let id = 0
  let queue = []
  const frameDuration = 1000 / 60

  funcRaf = function(callback) {
    if (queue.length === 0) {
      const _now = now()
      const next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        const cp = queue.slice(0)
        queue.length = 0
        for (let i = 0; i < cp.length; i++) {
          if (!cp[i].cancelled) {
            try {
              cp[i].callback(last)
            } catch (e) {
              setTimeout(function() {
                throw e
              }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }
  caf = function(handle) {
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

function raf(fn) {
  return funcRaf.call(root, fn)
}

function cancel() {
  caf.apply(root, arguments)
}

function polyfill(object) {
  if (!object) {
    object = root
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

export { raf, cancel, polyfill }
// module.exports = function ( fn ) {
//   // Wrap in a new function to prevent
//   // `cancel` potentially being assigned
//   // to the native rAF function
//   return raf.call( root, fn )
// }
// module.exports.cancel = function () {
//   caf.apply( root, arguments )
// }
// module.exports.polyfill = function ( object ) {
//   if ( !object ) {
//     object = root;
//   }
//   object.requestAnimationFrame = raf
//   object.cancelAnimationFrame = caf
// }

// // Some versions of FF have rAF but not cAF
// if ( !raf || !caf ) {
//   var last = 0
//     , id = 0
//     , queue = []
//     , frameDuration = 1000 / 60

//   raf = function ( callback ) {
//     if ( queue.length === 0 ) {
//       var _now = now()
//         , next = Math.max( 0, frameDuration - ( _now - last ) )
//       last = next + _now
//       setTimeout( function () {
//         var cp = queue.slice( 0 )
//         // Clear queue here to prevent
//         // callbacks from appending listeners
//         // to the current frame's queue
//         queue.length = 0
//         for ( var i = 0; i < cp.length; i++ ) {
//           if ( !cp[ i ].cancelled ) {
//             try {
//               cp[ i ].callback( last )
//             } catch ( e ) {
//               setTimeout( function () { throw e }, 0 )
//             }
//           }
//         }
//       }, Math.round( next ) )
//     }
//     queue.push( {
//       handle: ++id,
//       callback: callback,
//       cancelled: false
//     } )
//     return id
//   }

//   caf = function ( handle ) {
//     for ( var i = 0; i < queue.length; i++ ) {
//       if ( queue[ i ].handle === handle ) {
//         queue[ i ].cancelled = true
//       }
//     }
//   }
// }

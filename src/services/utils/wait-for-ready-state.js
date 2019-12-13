export default async function waitForReadyState() {
  if (typeof document !== 'undefined' && document.readyState !== 'complete') {
    await new Promise(resolve => {
      const cb = () => {
        window.requestAnimationFrame(resolve)
        window.removeEventListener('load', cb)
      }
      window.addEventListener('load', cb)
    })
  }
}

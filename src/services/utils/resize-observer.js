import { raf } from './raf'
import ObserverEvent from './observer-event'

const ResizeObserver = (el = window, observerFn) => {
  const observer = ObserverEvent(
    el,
    'resize',
    () => {
      raf(observerFn)
    },
    { passive: true }
  )

  return {
    destroy: observer.destroy
  }
}

export default ResizeObserver

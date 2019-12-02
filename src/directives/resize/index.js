import { debounce } from 'lodash'

function inserted(el, binding) {
  const cb = debounce(binding.value, 500)
  const opts = binding.options || { passive: true }

  window.addEventListener('resize', cb, opts)
  el._onResize = {
    callback: cb,
    options: opts
  }

  if (!binding.modifiers || !binding.modifiers.quiet) {
    cb()
  }
}

function unbind(el) {
  if (!el._onResize) return
  const _el$_onResize = el._onResize
  const { callback, options } = _el$_onResize
  window.removeEventListener('resize', callback, options)
  delete el._onResize
}

const Resize = {
  inserted,
  unbind,
  name: 'resize'
}

export default Resize

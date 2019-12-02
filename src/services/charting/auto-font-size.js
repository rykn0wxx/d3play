export default function autoFontSize(containerSelection) {
  return function(textSelection) {
    const bbox = textSelection.node().getBBox()
    const cbbox = containerSelection.node().getBoundingClientRect()
    const scale = Math.min(cbbox.width / bbox.width, cbbox.height / bbox.height)
    console.log(bbox, cbbox)
    textSelection.style('font-size', `${scale}px`)
  }
}

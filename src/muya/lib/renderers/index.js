const rendererCache = new Map()
/**
 *
 * @param {string} name the renderer name: katex, sequence, plantuml, flowchart, mermaid, vega-lite
 */
const loadRenderer = async (name) => {
  if (!rendererCache.has(name)) {
    let m
    let mindmap
    switch (name) {
      case 'sequence':
        m = await import('../parser/render/sequence')
        rendererCache.set(name, m.default)
        break
      case 'plantuml':
        m = await import('../parser/render/plantuml')
        rendererCache.set(name, m.default)
        break
      case 'flowchart':
        m = await import('flowchart.js')
        rendererCache.set(name, m.default)
        break
      case 'mermaid':
        // m = await import('mermaid/dist/mermaid.core.js')
        m = await import('mermaid/dist/mermaid.core.mjs')

        mindmap = await import('@mermaid-js/mermaid-mindmap/dist/mermaid-mindmap.core.mjs')
        rendererCache.set(`${name}_mindmap`, mindmap.default)
        await m.default.registerExternalDiagrams([mindmap.default], { lazyLoad: false })

        rendererCache.set(name, m.default)
        break
      case 'vega-lite':
        m = await import('vega-embed')
        rendererCache.set(name, m.default)
        break
      default:
        throw new Error(`Unknown diagram name ${name}`)
    }
  }

  return rendererCache.get(name)
}

export default loadRenderer

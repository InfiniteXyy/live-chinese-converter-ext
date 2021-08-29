import Browser from 'webextension-polyfill'
import { converString } from '~/logic'
import { ConvertionType } from '~/types'

let liveObserver: MutationObserver | null = null

Browser.runtime.onMessage.addListener(({ data }) => {
  switch (data.type) {
    case 'trigger-global': {
      triggerConvert(document.body, data.payload.type)
      break
    }
    case 'set-bilibili-subtitle': {
      if (liveObserver) liveObserver.disconnect()
      if (data.payload.enabled) {
        liveObserver = new MutationObserver((records) => {
          records.forEach((record) => {
            if (record.target instanceof HTMLElement) {
              triggerConvert(record.target, data.payload.type)
            }
          })
        })
        liveObserver.observe(document.querySelector('[class$="subtitle-group"]')!, {
          subtree: true,
          childList: true,
          attributes: false,
        })
        triggerConvert(document.querySelector('[class$="subtitle-group"]')!, data.payload.type)
      }
      break
    }
  }
})

function triggerConvert(container: HTMLElement, type: ConvertionType) {
  if (container) {
    function traverse(node: ChildNode) {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue) node.nodeValue = converString(node.nodeValue, type)
      else node.childNodes.forEach(traverse)
    }
    traverse(container)
  }
}

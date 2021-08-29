/* eslint-disable no-console */
import Browser from 'webextension-polyfill'
import { converString } from '~/logic'
import { ConvertionType } from '~/types'

console.info('[vitesse-webext] Hello world from content script')

Browser.runtime.onMessage.addListener(({ data }) => {
  switch (data.type) {
    case 'trigger-global': {
      triggerGlobalConvert(data.payload.type)
      break
    }
    case 'set-bilibili-subtitle': {
      if (data.payload.enabled) {
        liveObserver.observe(document.querySelector('.subtitle-group')!, {
          subtree: true,
          childList: true,
          attributes: false,
        })
        triggerConvert(document.querySelector('.subtitle-group')!, data.payload.type)
      } else {
        liveObserver.disconnect()
      }
      break
    }
  }
})

const liveObserver = new MutationObserver((records) => {
  records.forEach((record) => {
    if (record.target instanceof HTMLElement) {
      triggerConvert(record.target, 'traditional')
    }
  })
})

function triggerGlobalConvert(type: ConvertionType) {
  triggerConvert(document.body, type)
}

function triggerConvert(container: HTMLElement, type: ConvertionType) {
  if (container) {
    function traverse(node: ChildNode) {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue) node.nodeValue = converString(node.nodeValue, type)
      else node.childNodes.forEach(traverse)
    }
    traverse(container)
  }
}

import { useEffect, useRef, useState } from 'preact/hooks'
import browser from 'webextension-polyfill'
import { Logo } from '~/components/Logo'
import { ConvertionType } from '~/types'

const sendMessage = async (data: unknown) => {
  const tab = (await browser.tabs.query({ active: true, currentWindow: true }))[0]
  if (!tab || !tab.id) return
  await browser.tabs.sendMessage(tab.id, { data })
}

export function Popup() {
  const firstRender = useRef(true)
  const [isTraditional, setTraditional] = useState(false)
  const [bilibiliChecked, setBilibiliTracked] = useState<ConvertionType | null>(null)

  useEffect(() => {
    if (firstRender.current) return
    console.log({ isTraditional })
    sendMessage({ type: 'trigger-global', payload: { type: isTraditional ? 'simplified' : 'traditional' } })
  }, [isTraditional])

  useEffect(() => {
    if (firstRender.current) return
    sendMessage({
      type: 'set-bilibili-subtitle',
      payload: { enabled: bilibiliChecked !== null, type: bilibiliChecked },
    })
  }, [bilibiliChecked])

  useEffect(() => {
    firstRender.current = false
  }, [])

  return (
    <main class="w-[300px] px-4 py-5 text-center text-gray-700">
      <Logo />
      <div>简繁切换</div>
      <button
        class="mt-2 font-medium bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded-lg transition"
        onClick={() => setTraditional(!isTraditional)}
      >
        全局刷新为： <b>{!isTraditional ? '繁体' : '简体'}</b>
      </button>
      <div>
        <label class="block">
          <input
            type="checkbox"
            checked={bilibiliChecked === 'simplified'}
            onClick={() => setBilibiliTracked(bilibiliChecked == 'simplified' ? null : 'simplified')}
          />
          打开 B 站字幕，自动切换繁体
        </label>
        <label class="block">
          <input
            type="checkbox"
            checked={bilibiliChecked === 'traditional'}
            onClick={() => setBilibiliTracked(bilibiliChecked == 'traditional' ? null : 'traditional')}
          />
          打开 B 站字幕，自动切换简体
        </label>
      </div>
    </main>
  )
}

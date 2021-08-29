import { SimplifiedLib, TraditionalLib } from './constant.json'

function testIsChinese(str: string) {
  return /[\u4E00-\u9FA5]/.test(str)
}

export function converString(str: string, type: 'traditional' | 'simplified') {
  const fromLib = type === 'simplified' ? TraditionalLib : SimplifiedLib
  const toLib = type === 'simplified' ? SimplifiedLib : TraditionalLib
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (testIsChinese(char)) {
      const targetIndex = fromLib.indexOf(char)
      if (targetIndex !== -1)
        result += toLib[targetIndex]
      else result += char
    }
    else {
      result += char
    }
  }
  return result
}

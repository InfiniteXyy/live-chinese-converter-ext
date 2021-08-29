import { render, h } from 'preact'
import { Popup } from './Popup'
import '../styles'

const container = document.getElementById('app')!
render(h(Popup, null), container)

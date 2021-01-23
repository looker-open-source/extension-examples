import * as React from "react"
import * as ReactDom from "react-dom"
import { App } from "./App"

var link = document.createElement("link")
link.href = "https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
link.rel = "stylesheet"
document.head.appendChild(link)

window.addEventListener("DOMContentLoaded", event => {
  var root = document.createElement("div")
  document.body.appendChild(root)
  ReactDom.render(<App />, root)
})

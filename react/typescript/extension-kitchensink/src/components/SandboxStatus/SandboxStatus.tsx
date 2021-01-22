/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, { useEffect, useState } from "react"
import { Paragraph } from "@looker/components"
import { SandboxStatusProps } from "./types"

export const SandboxStatus: React.FC<SandboxStatusProps> = () => {
  const [sandboxStatus, setSandboxStatus] = useState("")

  useEffect(() => {
    try {
      const parentWindow:any = (window as any).parent
      // Attempt to get data from the parent window. This
      // will fail in a sandboxed environment and in most
      // cases we want this to fail.
      parentWindow.looker?.version
      setSandboxStatus("NOT")
    }catch(err) {
      setSandboxStatus("")
    }
  }, [])

  return (
      <Paragraph my="medium">This extension is <b>{sandboxStatus}</b> sandboxed.</Paragraph>
  )
}

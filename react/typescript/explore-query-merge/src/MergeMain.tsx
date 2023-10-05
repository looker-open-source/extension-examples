// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useContext, useEffect, useState} from 'react'
import { ComponentsProvider, Space, Span, SpaceVertical, Form, Link, Button, ButtonTransparent, Slider, MessageBar, Card, CardContent, Paragraph, Heading, Grid, Drawer} from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'
import {getHostname, getQID, Range} from './utils/helpers'
import { MergeInputs } from './components/MergeInputs'
import {DrawerContent} from './components/DrawerContent'

export const MergeMain: React.FC = () => {
  const { core40SDK } = useContext(ExtensionContext)
  const [message, setMessage] = useState('')
  const [merge, setMerge] = useState<MergeTypes>()
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')
  const [inputs, setInputs] = useState(2)

  interface MergeTypes {
    hostname: Array<string | null>,
    qID: Array<string | null>
  }

  useEffect(() => {
    const getMe = async () => {
      try {
        const me = await core40SDK.ok(core40SDK.me())
        setMessage(`Hello, ${me.display_name}`)
      } catch (error) {
        console.error(error)
        setMessage('An error occurred while getting information about me!')
      }
    }
    getMe()
  }, [])

  useEffect(() => {
    if(merge) createMergeQuery(merge)
  },[merge])

  const extractMergeInfo = (url: string) => {
    if(url) {  
      const hostname = getHostname(url)
      const qID = getQID(url)
      return [hostname, qID]
    } else {
      throw new Error('No url supplied.')
    }
  }

  const handleClearForm = (e: any) => {
    e.preventDefault();
    setUrl('')
    setMerge(undefined)
    if(error) setError('');
    // only grab unique inputs
    const uniqueInputs = new Set(document.getElementsByTagName('INPUT') as any as Array<HTMLElement>)
    uniqueInputs.forEach((elem) => (elem as HTMLInputElement).value = '')
  }

  const handleClick = (e:any) => {
    const hostnames = new Array<string | null>()
    const qIDs = new Array<string | null>()
    e.preventDefault();
    const mergeRange = Range(inputs)
    const merges = mergeRange.map((merge) => (document.getElementsByName(`merge${merge}`)[0] as HTMLInputElement).value)
    merges.forEach((m:string) => {
      const [hostname, qID] = extractMergeInfo(m)
      if(hostname) hostnames.push(hostname)
      if(qID) qIDs.push(qID)
    })
   setMerge({hostname:hostnames,qID:qIDs});
  }

  const createMergeQuery = (merge: MergeTypes) => {
    // this should be handled by form input but if not
    if(merge?.qID?.length <= 1) setError('At least two explore query urls need to be specified')
    if(merge?.qID.includes("URL_ERROR")) setError('There was an error parsing the query id from the url. Check the explore query urls and try again.')
    if(merge.hostname.every((val, i, arr: Array<string | null>) => val === arr[0])) {
      const url = `${merge.hostname[0]}merge?qids%5B%5D=${merge.qID.join('&qids%5B%5D=')}`
      console.log(url)
      setUrl(url)
    } else {
      setError('The hostnames of the inputted explore queries dont match. Please check that both urls come from the same Looker instance.')
    }
  }

  return (
    <ComponentsProvider>
      <div style={{maxWidth:'100%', display: 'flex', paddingLeft: '18rem', paddingRight: '18rem', paddingTop: '4rem'}}>
      <SpaceVertical gap="u16">
      <Space style={{justifyContent: 'center'}}>
        <Span fontSize="xxxxlarge">
          {message}, welcome to Merge Explore Query!
        </Span>
        <Span fontSize="small">where queries become one.</Span>
      </Space>
      <Grid columns={2}>
      <Card raised style={{maxWidth:'95%'}}>
        <CardContent>
          <Heading fontSize="xxxlarge">What is Merge Explore Query?</Heading>
          <Heading as="h4" fontSize="small">
            The Merge Explore Query Extension was inspired by <Link href="https://www.merge.monster/" target="_blank">this</Link> site, and provides a UI
            to merge explore queries together.
          </Heading>
          <Paragraph fontSize="xsmall" color="text1">
            Explore Merge
          </Paragraph>
        </CardContent>
      </Card>
      <Card raised style={{maxWidth:'95%'}}>
        <CardContent>
          <Heading fontSize="xxxlarge">How to use Merge Explore Query?</Heading>
          <Heading as="h4" fontSize="small">
            Using Merge Explore Query, please select firstly the amount of queries you'd like to merge. Then input the explore urls with the first input being the base explore.
            After submitting the merge query url will be outputted for you below.
          </Heading>
          <Drawer content={<DrawerContent />}>
            <Paragraph fontSize="xsmall" color="text1">
              Please See <ButtonTransparent>Pre-Reqs</ButtonTransparent> before using.
            </Paragraph>
          </Drawer>
        </CardContent>
      </Card>
      </Grid>
      {error && <MessageBar intent="warn">Error with merged queries: {error}</MessageBar>}
      <Form>
        <SpaceVertical gap="u12">
        <Space between id="mergeInputs">
          <MergeInputs inputs={inputs} />
        </Space>
        {!url && !error 
          ?
          <Space>
          <Button onClick={(e) => handleClick(e)}>Submit</Button>
          <Slider min={2} max={6} style={{marginLeft:'10rem', maxWidth:'100%'}} 
          onChange={(e) => setInputs(e.currentTarget.value as any as number)}
          value={inputs}
          />
          </Space>
          :
          <Button onClick={(e) => handleClearForm(e)}>Clear Form</Button>
        } 
        </SpaceVertical>
      </Form>
      {url && !error && <Heading>Access Link<Link href={url} target="_blank"> Here</Link></Heading>}
      </SpaceVertical>
      </div>
    </ComponentsProvider>
  )
}

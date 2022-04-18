/*

 MIT License

 Copyright (c) 2022 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */
import React, { useContext, useEffect, useState } from 'react'
import { getFirestore } from 'firebase/firestore'
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth'
import { FirestoreProvider, useFirebaseApp } from 'reactfire'
import { SpaceVertical, Text } from '@looker/components'
import { ExtensionContext2 } from '@looker/extension-sdk-react'
import { Movies } from './Movies'

export const Firestore: React.FC = () => {
  const firebaseApp = useFirebaseApp()
  const firebaseAuth = getAuth(firebaseApp)
  const firestoreInstance = getFirestore(firebaseApp)
  const { coreSDK, extensionSDK } = useContext(ExtensionContext2)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        let clientId = extensionSDK.createSecretKeyTag('looker_client_id')
        let clientSecret = extensionSDK.createSecretKeyTag(
          'looker_client_secret'
        )
        // see .env for shortcut setup
        const requestBody = {
          client_id: clientId,
          client_secret: clientSecret,
          scope:
            'https://www.googleapis.com/auth/datastore  https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database',
        }
        const response = await extensionSDK.serverProxy(
          `http://localhost:8081/access_token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          }
        )
        const { access_token, expiry_date } = response.body
        const credential = GoogleAuthProvider.credential(null, access_token)
        console.log({ credential })
        console.log({ response })
        console.log({ firebaseAuth })
        console.log({ access_token, expiry_date, body: response.body })
        const userCredential = await signInWithCredential(
          firebaseAuth,
          credential
        )
        console.log({ userCredential })
      } catch (error: any) {
        console.error(error)
      }
    }

    const getMe = async () => {
      try {
        const me = await coreSDK.ok(coreSDK.me())
        setMessage(`Hello, ${me.display_name}`)
      } catch (error) {
        console.error(error)
        setMessage('An error occurred while getting information about me!')
      }
    }
    getMe()
    getAccessToken()
  }, [coreSDK])

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <SpaceVertical>
        <Text fontSize="xxxxxlarge">{message}</Text>
        <Movies />
      </SpaceVertical>
    </FirestoreProvider>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import translateText from './translate'

firebase.initializeApp({
  apiKey: 'AIzaSyAkSivI_GML2B0gVtiHUoWgAWm5gqv4nCE',
  authDomain: 'chat-eng-cb8ba.firebaseapp.com',
  projectId: 'chat-eng-cb8ba',
  storageBucket: 'chat-eng-cb8ba.appspot.com',
  messagingSenderId: '215880308306',
  appId: '1:215880308306:web:14f7b367930517f655318b',
})

const auth = firebase.auth()
const firestore = firebase.firestore()
const analytics = firebase.analytics()

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>
        Do not violate the community guidelines or you will be banned for life!
      </p>
    </>
  )
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  )
}

function ChatRoom() {
  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, { idField: 'id' })

  const [formValue, setFormValue] = useState('')

  const sendMessage = async e => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser

    // const translate = await translateText(formValue)
    // console.log({ translate })
    await messagesRef.add({
      // translate: translate,
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    })

    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  function tts(text) {
    const msg = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(msg)
  }

  useEffect(() => {
    if (messages) {
      const message = messages.slice(-1)[0]
      const messageClass =
        message.uid === auth.currentUser.uid ? 'sent' : 'received'

      if (messageClass === 'received') {
        tts(message.text)
      }
    }
  }, [messages])

  return (
    <>
      <main>
        {messages &&
          messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={e => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  const [showText, setShowText] = useState(false)

  function tts(text) {
    const msg = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(msg)
  }
  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          style={{ cursor: 'pointer' }}
          onClick={() => setShowText(!showText)}
          src={
            photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'
          }
        />
        <p style={{ cursor: 'pointer' }} onClick={() => tts(text)}>
          {showText ? text : 'PLAY'}
        </p>
      </div>
    </>
  )
}

export default App

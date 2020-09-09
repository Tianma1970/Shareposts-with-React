import React, { useEffect, useContext, useRef } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import { Link } from "react-router-dom"
//in order to establish two way communication we need to install socket.io-client
import io from "socket.io-client"

// we need to establish a connection between our browser and the server
const socket = io("http://localhost:8080")

function Chat() {
  const chatField = useRef(null)
  // we want to come to the chatfield in case there are many messages. We have to set ref={chatLog}} (JSX line 79)
  //we need to create a reference which makes the we can see the writing area in case of many chat messages
  const chatLog = useRef(null)
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  })

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus()
    }
  }, [appState.isChatOpen])

  //FOR OUR CHAT. We only want to run it the first time the component renders. That's why the dependency array is empty
  useEffect(() => {
    //the first argument in socket.on is the name the server emitted to us. The second argument is a function that runs everytime it happens
    socket.on("chatFromServer", message => {
      //we want to update our state
      setState(draft => {
        draft.chatMessages.push(message)
      })
    })
  }, [])

  //the scrollbar in Chatwindow
  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight
  }, [state.chatMessages]) //anytime the state changes through a new new message pushed on this collection we want the chatwindow scrolled down to its button position

  function handleFieldChange(e) {
    const value = e.target.value
    setState(draft => {
      draft.fieldValue = value
    })
  }
  function handleSubmit(e) {
    e.preventDefault()
    //send message to Chat server
    socket.emit("chatFromBrowser", { message: state.fieldValue, token: appState.user.token })

    //we want the field to become blank after typing
    setState(draft => {
      //add message to state collection of messages
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar
      })

      draft.fieldValue = ""
    })
  }
  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (appState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
      <div className="chat-title-bar bg-primary">
        Chat
        <span onClick={() => appDispatch({ type: "closeChat" })} className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>

      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          //we can need an if statement instead of a ternary operator because we are within an arrow function
          if (message.username == appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            )
          }
          return (
            <div key={index} className="chat-other">
              <Link to={`profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
        <input value={state.fieldValue} onChange={handleFieldChange} ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
      </form>
    </div>
  )
}

export default Chat

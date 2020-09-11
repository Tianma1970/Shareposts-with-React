import React, { useEffect, useState } from "react"
import Page from "./Page"
import Axios from "axios"
//we use immer Reducer for state management
import { useImmerReducer } from "use-immer"

//for error message animated styled
import { CSSTransition } from "react-transition-group"

function HomeGuest() {
  //we earlier worked with useState
  // const [username, setUsername] = useState()
  // const [email, setEmail] = useState()
  // const [password, setPassword] = useState()

  //client side validation default
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    password: {
      value: "",
      hasErrors: false,
      message: ""
    },
    submitCount: 0
  }
  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        //we want to store the value inState
        draft.username.hasErrors = false
        draft.username.value = action.value
        //the username must not be longer than 30 characters
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = "The username cannot exceed 30 characters"
        }
        //regular expression for username only contains a-z, A-Z and 0-9 the test method returns a value of true or false
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "username can only contain numbers and letters"
        }
        return
      case "usernameAfterDelay":
        return
      case "usernameUniqueResults":
        return
      case "emailImmediately":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "emailAfterDelay":
        return
      case "emailUniqueResults":
        return
      case "passwordImmediately":
        draft.password.hasErrors = false
        draft.password.value = action.value
        return
      case "passwordAfterDelay":
        return
      case "submitForm":
        return
    }
  }

  //we need to create our dispatch, we can use down in our JSX we use immer instead for state
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  function handleSubmit(e) {
    e.preventDefault()

    // try {
    //   await Axios.post("/register", { username, email, password })
    //   console.log("User successfully created")
    // } catch (e) {
    //   console.log("there was an error")
    // }
  }
  return (
    <Page title="Home" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up for Shareposts
            </button>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default HomeGuest

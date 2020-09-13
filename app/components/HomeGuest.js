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
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "your username must at least have 3 characters"
        }
        if (!draft.username.hasErrors) {
          draft.username.checkCount++
        }
        return
      case "usernameUniqueResults":
        //we handle the case if the username is already taken
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "that username is already taken"
        } else {
          draft.username.isUnique = true
        }
        return
      case "emailImmediately":
        draft.email.hasErrors = false
        draft.email.value = action.value
        //regular expression in email validation

        return
      case "emailAfterDelay":
        //we want to ensure that the email format is right with an reqular expresion
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email adress."
        }
        if (!draft.email.hasErrors) {
          draft.email.checkCount++
        }
        return
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "This email is already in use"
        } else {
          draft.email.isUnique = true
        }
        return
      case "passwordImmediately":
        draft.password.hasErrors = false
        draft.password.value = action.value
        //we want to check the maximum length of the password
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true
          draft.password.message = "password cannot exceed 50 characters"
        }
        return
      // we want to check the minimum length of the password
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true
          draft.password.message = "your password must at least have 12 characters"
        }

        return
      case "submitForm":
        return
    }
  }

  //we need to create our dispatch, we can use down in our JSX we use immer instead for state
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  //we want to ensure that the username field is not blank
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  //we want to ensure that the email field is not blank
  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  //we want to ensure that the password field is not blank
  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source()

      async function fetchResults() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { cancelToken: ourRequest.token })
          // console.log(response.data)
          dispatch({ type: "usernameUniqueResults", value: response.data }) //the server reponse will be true or false
        } catch (e) {
          console.log("There was a problem, or the request was cancelled.")
        }
      }
      fetchResults()

      return () => ourRequest.cancel()
    }
  }, [state.username.checkCount])

  //email validation
  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source()

      async function fetchResults() {
        try {
          const response = await Axios.post("/doesEmailExist", { email: state.email.value }, { cancelToken: ourRequest.token })
          // console.log(response.data)
          dispatch({ type: "emailUniqueResults", value: response.data }) //the server reponse will be true or false
        } catch (e) {
          console.log("There was a problem, or the request was cancelled.")
        }
      }
      fetchResults()

      return () => ourRequest.cancel()
    }
  }, [state.email.checkCount])

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
              <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
              <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
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

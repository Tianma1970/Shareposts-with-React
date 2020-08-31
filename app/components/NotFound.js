import React from "react"
import Page from "./Page"
import { Link } from "react-router-dom"

function NotFound() {
  return (
    <Page title="Not found">
      <div className="text-center">
        <h2>Woops, this page cannot be found</h2>
        <p className="lead text-muted">
          you can always visit the <Link to="/">homepage</Link> to come to a fresh start
        </p>
      </div>
    </Page>
  )
}

export default NotFound

import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import Post from "./Post"

//components
import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfilePosts(props) {
  //we need to generate a token if we cancel our Request
  const ourRequest = Axios.CancelToken.source()
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`)
        setPosts(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was an error!")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  if (isLoading) return <LoadingDotsIcon />
  return (
    <div className="list-group">
      {posts.map(post => {
        return <Post noAuthor={true} post={post} key={post._id} />
      })}
    </div>
  )
}

export default ProfilePosts

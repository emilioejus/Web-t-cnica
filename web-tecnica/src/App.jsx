import { useState } from 'react'
import VideoUpload from "./components/videoUpload";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <VideoUpload />
      </div>
    </>
  )
}

export default App

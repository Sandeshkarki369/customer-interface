import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    async function fetchTestMessage() {
      const { data, error } = await supabase.from('test').select('*').single()
      
      if (error) {
        console.error("Error:", error)
        setMessage("Connection failed. Check console.")
      } else {
        setMessage(data.message)
      }
    }

    fetchTestMessage()
  }, [])

  return (
    
      Customer Interface
      Database says: {message}
    
  )
}

export default App
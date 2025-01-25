import { Route, Routes } from 'react-router-dom'
import './App.css'
import AddString from './Pages/AddString'
import AddFile from './Pages/AddFile'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<AddString />}></Route>
        <Route path="/addFile" element={<AddFile />}></Route>
      </Routes>
    </div>
  )
}

export default App

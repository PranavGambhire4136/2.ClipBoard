import { Route, Routes } from 'react-router-dom'
import './App.css'
import AddString from './Pages/AddString'
import AddFile from './Pages/AddFile';
import Navbar from './components/Navbar';

function App() {

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center gap-8 px-4 bg-[#f8fafc] text-[#0f172a] min-h-screen font-sans antialiased mt-14 md:ml-40">
      <Navbar />
      <Routes>
        <Route path="/" element={<AddString />}></Route>
        <Route path="/addFile" element={<AddFile />}></Route>
      </Routes>
    </div>
  )
}

export default App
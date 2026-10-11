import {BrowserRouter, Route, Routes} from 'react-router'
import Home from './components/Home'
import Header from './components/Header'
import Pokedex from './components/Pokedex'
import './App.css'
function App(){
  return(
    
    <BrowserRouter>
    <Header />
    <Routes>
      <Route  path='/' element={<Home />}/>
      <Route path='/pokedex' element={<Pokedex />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
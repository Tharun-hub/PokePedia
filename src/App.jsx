import {BrowserRouter, Route, Routes} from 'react-router'
import Home from './components/Home'
import Header from './components/Header'
import Pokedex from './components/Pokedex'
import './App.css'
import CatalogueItemDetail from './components/CatalogueItemDetail'
import Footer from './components/Footer'
function App(){
  return(
    
    <BrowserRouter>
    <Header />
    <Routes>
      <Route  path='/' element={<Home />}/>
      <Route path='/pokedex' element={<Pokedex />}></Route>
      <Route path='pokedex/:id' element={<CatalogueItemDetail />}></Route>
    </Routes>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
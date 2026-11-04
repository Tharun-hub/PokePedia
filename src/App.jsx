import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './components/Home'
import Header from './components/Header'
import Pokedex from './components/Pokedex'
import './App.css'
import CatalogueItemDetail from './components/CatalogueItemDetail'
import Footer from './components/Footer'
import NotFound from './components/NotFound'
function App(){
  return(
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/pokedex' element={<Pokedex />}/>
            <Route path='/pokedex/:id' element={<CatalogueItemDetail />}/>
            <Route path="*" element={<NotFound />}/>
          </Routes>
        </main>
        <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App

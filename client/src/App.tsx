import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {socket, socketContext} from './context/socket';
import Home from './screen/Home/Home';


function App() {
  return (
    <div>
      <socketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>} />
          </Routes>
        </BrowserRouter>
      </socketContext.Provider>
    </div>
  );
}

export default App;

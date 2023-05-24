import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { socket, socketContext } from './context/socket';
import Game from './screen/Game/Game';
import Home from './screen/Home/Home';
import Roles from './screen/Roles/Roles';
import Leaderboard from './screen/Leaderboard/Leaderboard';
import News from './screen/News/News';
import Profil from './screen/Profil/Profil';

function App() {
  return (
    <div>
      <socketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/profil" element={<Profil />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/game/:id" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </socketContext.Provider>
    </div>
  );
}

export default App;

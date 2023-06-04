import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { socket, socketContext } from './context/socket';
import Game from './screen/Game/Game';
import Home from './screen/Home/Home';
import Leaderboard from './screen/Leaderboard/Leaderboard';
import Profil from './screen/Profil/Profil';
import Admin from './screen/Admin/Admin';
import CreateClan from './screen/Clan/CreateClan/CreateClan';
import InfoClan from './screen/Clan/InfoClan/InfoClan';

function App() {
  return (
    <div>
      <socketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profil/:id" element={<Profil />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/clan/create" element={<CreateClan />} />
            <Route path="/clan/info/:id" element={<InfoClan />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </socketContext.Provider>
    </div>
  );
}

export default App;

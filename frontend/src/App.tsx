import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { CandidateRoom } from "./components/CandidateRoom";
import { InterviewRoomWrapper } from "./components/InterviewRoomWrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:token" element={<CandidateRoom />} />
        <Route path="/interview/:token" element={<InterviewRoomWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

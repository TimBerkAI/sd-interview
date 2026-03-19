import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TokenEntry } from "./components/TokenEntry";
import { InterviewRoomWrapper } from "./components/InterviewRoomWrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TokenEntry />} />
        <Route path="/room/:token" element={<InterviewRoomWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

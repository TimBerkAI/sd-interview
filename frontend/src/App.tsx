import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { FlowLayout } from "./components/flow/FlowLayout";

import { TokenEntry } from "./pages/arch/TokenEntry";
import { InterviewRoomWrapper } from "./pages/arch/InterviewRoomWrapper";
import { CandidatesPage } from "./pages/flow/CandidatesPage";
import { CandidateDetailPage } from "./pages/flow/CandidateDetailPage";
import { KanbanBoard } from "./pages/flow/KanbanBoard";
import { TechTokenEntry } from "./pages/tech/TokenEntry";
import { TechInterviewRoomWrapper } from "./pages/tech/InterviewRoom";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TokenEntry />} />
          <Route path="/room/:token" element={<InterviewRoomWrapper />} />

          <Route path="/tech" element={<TechTokenEntry />} />
          <Route path="/tech/room/:token" element={<TechInterviewRoomWrapper />} />

          <Route path="/flow" element={<FlowLayout />}>
            <Route index element={<Navigate to="/flow/candidates" replace />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="candidates/:id" element={<CandidateDetailPage />} />
            <Route path="ways" element={<KanbanBoard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminLayout } from "./components/admin/AdminLayout";

import { LandingPage } from "./pages/LandingPage";
import { TokenEntry } from "./pages/arch/TokenEntry";
import { InterviewRoomWrapper } from "./pages/arch/InterviewRoomWrapper";
import { CandidatesPage } from "./pages/flow/CandidatesPage";
import { CandidateDetailPage } from "./pages/flow/CandidateDetailPage";
import { KanbanBoard } from "./pages/flow/KanbanBoard";
import { TechTokenEntry } from "./pages/tech/TokenEntry";
import { TechInterviewRoomWrapper } from "./pages/tech/InterviewRoom";
import { ArchTasksPage, ArchTaskEditPage } from "./pages/admin/arch/ArchTasksPage";
import { ArchTemplatesPage } from "./pages/admin/arch/ArchTemplatesPage";
import { ArchRoomsPage } from "./pages/admin/arch/ArchRoomsPage";
import { TechTasksPage, TechTaskEditPage } from "./pages/admin/tech/TechTasksPage";
import { TechRoomsPage } from "./pages/admin/tech/TechRoomsPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/arch" element={<TokenEntry />} />
          <Route path="/room/:token" element={<InterviewRoomWrapper />} />

          <Route path="/tech" element={<TechTokenEntry />} />
          <Route path="/tech/room/:token" element={<TechInterviewRoomWrapper />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/arch/tasks" replace />} />
            <Route path="arch/tasks" element={<ArchTasksPage />} />
            <Route path="arch/tasks/:id" element={<ArchTaskEditPage />} />
            <Route path="arch/templates" element={<ArchTemplatesPage />} />
            <Route path="arch/rooms" element={<ArchRoomsPage />} />
            <Route path="tech/tasks" element={<TechTasksPage />} />
            <Route path="tech/tasks/:id" element={<TechTaskEditPage />} />
            <Route path="tech/rooms" element={<TechRoomsPage />} />
            <Route path="flow/candidates" element={<CandidatesPage />} />
            <Route path="flow/candidates/:id" element={<CandidateDetailPage />} />
            <Route path="flow/kanban" element={<KanbanBoard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

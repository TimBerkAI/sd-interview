import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { TokenEntry } from "./components/TokenEntry";
import { InterviewRoom } from "./components/InterviewRoom";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTokenSubmit = async (submittedToken: string) => {
    setLoading(true);
    setToken(submittedToken);
    setLoading(false);
  };

  return (
    <BrowserRouter>
      {!token ? (
        <TokenEntry onSubmit={handleTokenSubmit} loading={loading} />
      ) : (
        <InterviewRoom token={token} />
      )}
    </BrowserRouter>
  );
}

export default App;

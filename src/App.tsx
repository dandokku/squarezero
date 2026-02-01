import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { OpeningsList } from "./pages/OpeningsList.tsx";
import { Practice } from "./pages/Practice.tsx";
// We don't need the old App logic here anymore, it moved to Practice.tsx

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<OpeningsList />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/:id" element={<Practice />} />
          {/* <Route path="progress" element={<Progress />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

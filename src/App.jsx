import "./App.css";
import { Routes, Route } from "react-router-dom";

import AdminPanel from "./pages/AdminPanel";

function App() {
    return (
        <Routes>
            <Route path="/" element={<AdminPanel />} />
        </Routes>
    );
}

export default App;
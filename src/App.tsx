import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/main";
import Login from "./components/Login";
import "./styles/global-style.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

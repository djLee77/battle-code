import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/Main';
import Login from './pages/Login';
import './styles/global-style.css';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <QueryClientProvider client={queryClient}>
          <Route path="/" element={<MainPage />}></Route>
        </QueryClientProvider>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

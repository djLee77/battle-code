import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/Main';
import Login from './pages/Login';
import './styles/global-style.css';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: () => {
        console.log('error');
      },
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />}></Route>

          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

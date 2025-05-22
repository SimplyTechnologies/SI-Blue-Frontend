import { BrowserRouter } from 'react-router';
import { APIProvider } from '@vis.gl/react-google-maps';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from '@/routes';
import './styles/index.css';

const queryClient = new QueryClient();

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <APIProvider apiKey={apiKey} libraries={['marker', 'places']}>
          <div className="app">
            <AppRoutes />
          </div>
        </APIProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;

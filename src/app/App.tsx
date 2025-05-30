import { APIProvider } from '@vis.gl/react-google-maps';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from '@/routes/Routes';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey={apiKey} libraries={['marker', 'places']}>
        <div className="app">
          <AppRoutes />
        </div>
      </APIProvider>
    </QueryClientProvider>
  );
}

export default App;


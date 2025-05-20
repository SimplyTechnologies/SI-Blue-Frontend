import { APIProvider } from '@vis.gl/react-google-maps';
// import Map from "@/components/shared/Map";
import AppRoutes from '@/routes/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/index.css';

const queryClient = new QueryClient();

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        <div className="app">
          {/* <Map /> */}
          <AppRoutes />
        </div>
      </APIProvider>
    </QueryClientProvider>
  );
}

export default App;

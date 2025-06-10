import { useEffect } from 'react';
import { Toaster } from '@/components/atom/Toaster';
import { APIProvider } from '@vis.gl/react-google-maps';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { connectSocket, disconnectSocket } from '@/utils/socket';
import AppRoutes from '@/routes/Routes';
import useAuthStore from '@/stores/authStore';
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
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    if (user?.id) {
      const socket = connectSocket(user.id);
      socket.on('forceLogout', () => {
        logout();
        disconnectSocket();
      });
      return () => {
        disconnectSocket();
      };
    }
  }, [user?.id, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey={apiKey} libraries={['marker', 'places']}>
        <div className="app">
          <AppRoutes />
          <Toaster richColors visibleToasts={1} />
        </div>
      </APIProvider>
    </QueryClientProvider>
  );
}

export default App;

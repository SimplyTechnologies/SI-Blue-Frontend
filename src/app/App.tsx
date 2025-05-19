import { APIProvider } from "@vis.gl/react-google-maps";
// import Map from "@/components/shared/Map";
import AppRoutes from "@/routes/Routes";
import "./styles/index.css";

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  return (
    <APIProvider apiKey={apiKey} libraries={["marker"]}>
      <div className="app">
        {/* <Map /> */}
        <AppRoutes />
      </div>
    </APIProvider>
  );
}

export default App;

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Favourites from "./pages/Favourites";
import Rentals from "./pages/Rentals";
import Projects from "./pages/Projects";
import Insights from "./pages/Insights";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/login" element={<Login />} />

        {/* ================= AUTHENTICATED APP ================= */}

        <Route element={<AppLayout />}>
          <Route path="/listings" element={<Listings />} />

          <Route
            path="/listings/:id"
            element={<ListingDetail />}
          />

          <Route
            path="/favourites"
            element={<Favourites />}
          />

          <Route
            path="/rentals"
            element={<Rentals />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />
          <Route path="/insights" element={<Insights />} />
        </Route>

        {/* ================= DEFAULT ROUTE ================= */}

        <Route
          path="/"
          element={<Navigate to="/listings" replace />}
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<Navigate to="/listings" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
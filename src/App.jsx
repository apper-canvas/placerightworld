import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import JobBoard from "@/components/pages/JobBoard";
import Candidates from "@/components/pages/Candidates";
import Applications from "@/components/pages/Applications";
import Messages from "@/components/pages/Messages";
import Profile from "@/components/pages/Profile";
import { RoleProvider } from "@/hooks/useRole";

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<JobBoard />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="applications" element={<Applications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;
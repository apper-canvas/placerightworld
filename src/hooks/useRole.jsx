import { createContext, useContext, useState } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState("candidate"); // candidate | recruiter

  const toggleRole = () => {
    setCurrentRole(prev => prev === "candidate" ? "recruiter" : "candidate");
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
import { Navigate, useLocation } from "react-router-dom";
import { getAdminToken } from "@/lib/cmsApi";

type AdminGuardProps = {
  children: React.ReactNode;
};

const AdminGuard = ({ children }: AdminGuardProps) => {
  const loc = useLocation();
  if (!getAdminToken()) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }
  return <>{children}</>;
};

export default AdminGuard;

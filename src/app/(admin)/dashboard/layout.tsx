import React from "react";
import { Breadcrumb, Layout, theme } from "antd";
import AdminFooter from "@/component/layout/admin.footer";
import AdminHeader from "@/component/layout/admin.header";
import AdminContent from "@/component/layout/admin.content";
import { AdminContextProvider } from "@/library/admin.context";
const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AdminContextProvider>
      <div style={{ display: "flex" }}>
        <div className="left-side" style={{ minWidth: 80 }}>
        </div>
        <div className="right-side" style={{ flex: 1 }}>
          <AdminHeader />
          <AdminContent>{children}</AdminContent>
          <AdminFooter />
        </div>
      </div>
    </AdminContextProvider>
  );
};

export default AdminLayout;

"use client";

import { ArrowLeftOutlined, CrownOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import Link from "next/link";

const HomePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <Result
        icon={<CrownOutlined />}
        title="Fullstack Next/Nest - createdBy @hoidanit"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-30px", 
        }}
      >
        <Link href="/auth/login">
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

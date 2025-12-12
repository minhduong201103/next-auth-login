"use client";
import { Button, Flex, Table } from "antd";
import Filter from "../layout/admin.filtermethod";

const UserTable = () => {
  const dataSource = [
    {
      key: "1063",
      id: "1063",
      value: "test123",
      description: null,
      type: "TestGroup",
      createdAt: "2025-12-04 14:30:34",
    },
    {
      key: "1062",
      id: "1062",
      value: "test",
      description: null,
      type: "TestGroup",
      createdAt: "2025-12-04 14:29:27",
    },
  ];

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Value", dataIndex: "value", key: "value" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "CreateAt", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <>
      {/* Hàng 1 */}
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 10 }}>
        Manager Users
      </div>

      {/* Hàng 2 — nút trái & nút phải (căn theo table) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Filter />
        {/* nút này thẳng hàng với mép phải của table */}
        <Button type="primary">Create User</Button>
      </div>

      {/* Hàng 3 — Table */}
      <Table bordered dataSource={dataSource} columns={columns} />
    </>
  );
};

export default UserTable;

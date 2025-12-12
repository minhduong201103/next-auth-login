"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Table, Modal, Form, Input, message, Select } from "antd";
import Cookies from "js-cookie";
import Filter from "../layout/admin.filtermethod";

const API_URL = "https://c-lims-api.test.dtp-dev.site:6443";

export default function UserTable() {
  const [values, setValues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("TestGroup");

  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();

  const accessToken = Cookies.get("access-token");

  const METHODS = [
    "FormulaUnit",
    "TestGroup",
    "MethodGroup",
  ] as const;

  // --- REFRESH TOKEN ---
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) return null;

      const data = await res.json();
      Cookies.set("access-token", data.accessToken);
      return data.accessToken;
    } catch {
      return null;
    }
  };

  // --- FETCH DATA ---
  const fetchValues = useCallback(
    async (t: string) => {
      if (!accessToken) return;

      setLoading(true);
      try {
        let res = await fetch(
          `${API_URL}/default-value?type=${t}&page=1&limit=20`,
          {
            credentials: "include",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (res.status === 401) {
          const newToken = await refreshAccessToken();
          if (!newToken) throw new Error("Unauthorized");

          res = await fetch(
            `${API_URL}/default-value?type=${t}&page=1&limit=20`,
            {
              credentials: "include",
              headers: { Authorization: `Bearer ${newToken}` },
            }
          );
        }

        const data = await res.json();
        setValues(data.data?.items ?? []);
      } catch (e) {
        console.log("Fetch failed:", e);
        setValues([]);
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (!accessToken) return;
    fetchValues(type);
  }, [type]);

  // --- CREATE ITEM ---
  const handleCreate = async () => {
    try {
      const formData = await form.validateFields();

      const res = await fetch(`${API_URL}/default-value`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          type: formData.type, // Lấy đúng type user chọn
          value: formData.value,
          description: formData.description || null,
        }),
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) return message.error("Không tạo được!");

        await fetch(`${API_URL}/default-value`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify({
            type,
            value: formData.value,
            description: formData.description || null,
          }),
        });
      }

      message.success("Created successfully!");
      form.resetFields();
      setOpenCreate(false);
      fetchValues(type);
    } catch (err) {
      message.error("Tạo thất bại!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Value", dataIndex: "value", key: "value" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Description", dataIndex: "description", key: "d" },
    { title: "CreateAt", dataIndex: "createdAt", key: "createdAt" },
  ];

  // chuyển API data → Table data
  const tableData = values.map((item) => ({
    key: item.id,
    ...item,
  }));

  return (
    <>
      {/* Title */}
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 10 }}>
        Manager Default Values
      </div>

      {/* Filter + Create */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Filter onSelect={(method) => setType(method)} />

        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            form.setFieldsValue({ type }); // auto chọn type hiện tại
            setOpenCreate(true);
          }}
        >
          + Create
        </Button>
      </div>

      {/* Table */}
      <Table
        loading={loading}
        bordered
        columns={columns}
        dataSource={tableData}
      />
      {/* MODAL CREATE */}
      <Modal
        title="Create Default Value"
        open={openCreate}
        onCancel={() => setOpenCreate(false)}
        onOk={handleCreate}
        okText="Create"
      >
        <Form layout="vertical" form={form}>
          {/* Select type */}
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Select type!" }]}
          >
            <Select placeholder="Select type">
              {METHODS.map((m) => (
                <Select.Option key={m} value={m}>
                  {m}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Value */}
          <Form.Item
            label="Value"
            name="value"
            rules={[{ required: true, message: "Enter value!" }]}
          >
            <Input placeholder="Enter value" />
          </Form.Item>

          {/* Description */}
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Enter description (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

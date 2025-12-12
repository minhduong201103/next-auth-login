import React from "react";

import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

const items: MenuProps["items"] = [
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="">
        1st menu item
      </a>
    ),
    key: "0",
  },
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="">
        2nd menu item
      </a>
    ),
    key: "1",
  },
  {
    label: (
      <a target="_blank" rel="noopener noreferrer" href="">
        3nd menu item
      </a>
    ),
    key: "2",
  },
  {
    type: "divider",
  },
  {
    label: "3rd menu item（disabled）",
    key: "3",
    disabled: true,
  },
];

const Filter = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Please select
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default Filter;

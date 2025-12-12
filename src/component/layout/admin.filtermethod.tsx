"use client";

import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const METHODS = ["TestGroup", "FormulaUnit", "MethodGroup"];

export default function Filter({
  onSelect,
}: {
  onSelect: (m: string) => void;
}) {
  const items = METHODS.map((m) => ({
    key: m,
    label: m,
    onClick: () => onSelect(m), // ⭐ quan trọng nhất
  }));

  return (
    <Dropdown menu={{ items }}>
      <Button>
        Filter Method <DownOutlined />
      </Button>
    </Dropdown>
  );
}

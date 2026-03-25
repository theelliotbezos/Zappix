"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, List, ChevronRight, Trash2, GripVertical } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  response: string;
  children: MenuItem[];
}

const defaultMenuTree: MenuItem[] = [
  {
    id: "1",
    label: "Our Products",
    response: "Here are our available products:",
    children: [
      { id: "1a", label: "Product A", response: "Product A costs N5,000", children: [] },
      { id: "1b", label: "Product B", response: "Product B costs N10,000", children: [] },
    ],
  },
  {
    id: "2",
    label: "Price List",
    response: "Check out our price list at...",
    children: [],
  },
  {
    id: "3",
    label: "Contact Us",
    response: "You can reach us at...",
    children: [],
  },
];

function MenuItemRow({
  item,
  depth = 0,
}: {
  item: MenuItem;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
        style={{ marginLeft: depth * 24 }}
      >
        <GripVertical className="h-4 w-4 flex-shrink-0 cursor-grab text-gray-300" />
        {item.children.length > 0 && (
          <button onClick={() => setExpanded(!expanded)}>
            <ChevronRight
              className={`h-4 w-4 text-gray-400 transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
            />
          </button>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">{item.label}</p>
          <p className="text-xs text-gray-400 truncate max-w-xs">
            {item.response}
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Trash2 className="h-3 w-3 text-red-400" />
          </Button>
        </div>
      </div>
      {expanded &&
        item.children.map((child) => (
          <MenuItemRow key={child.id} item={child} depth={depth + 1} />
        ))}
    </div>
  );
}

export default function MenuBotPage() {
  const [isActive, setIsActive] = useState(false);
  const [menuTree] = useState<MenuItem[]>(defaultMenuTree);

  return (
    <>
      <PageHeader
        title="Menu Bot"
        description="Create an interactive WhatsApp menu for your products and services."
      />

      {/* Config */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Menu Bot</h3>
            <p className="text-sm text-gray-500">
              When active, incoming messages will trigger the interactive menu.
            </p>
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              isActive ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                isActive ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              WhatsApp Account
            </label>
            <select className="flex h-10 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
              <option>Select account...</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Trigger Keyword
            </label>
            <Input placeholder="e.g., menu, start, hello" />
          </div>
        </div>
      </div>

      {/* Menu Tree Editor */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Menu Structure</h3>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Root Item
          </Button>
        </div>

        <div className="space-y-2">
          {menuTree.map((item) => (
            <MenuItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold">Preview</h3>
        <div className="mx-auto max-w-sm rounded-2xl bg-gray-900 p-4">
          <div className="space-y-2">
            <div className="rounded-lg bg-green-700 px-3 py-2 text-sm text-white max-w-[80%]">
              Welcome! Please choose an option:
            </div>
            <div className="rounded-lg bg-green-700 px-3 py-2 text-sm text-white max-w-[80%]">
              <p className="font-medium mb-1">Main Menu</p>
              {menuTree.map((item, i) => (
                <p key={item.id} className="text-green-200">
                  {i + 1}. {item.label}
                </p>
              ))}
              <p className="mt-1 text-green-300 text-xs">
                Reply with a number to select
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

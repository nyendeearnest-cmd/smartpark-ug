"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

type Settings = {
  id: string;
  companyName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo: string | null;
  pricePerHour: number;
  gracePeriod: number;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();

      setSettings(data);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  function handleChange(
    field: keyof Settings,
    value: string | number
  ) {
    if (!settings) return;

    setSettings({
      ...settings,
      [field]: value,
    });
  }

  async function handleSave(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!settings) return;

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Settings saved");

      setSettings(data);

    } catch {
      toast.error("Failed to save settings");
    }
  }


  if (loading) {
    return (
      <DashboardLayout
        title="Settings"
        description="System configuration"
      >
        <p>Loading...</p>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout
      title="Settings"
      description="System configuration"
    >

      <form
        onSubmit={handleSave}
        className="bg-white border rounded-xl p-6 space-y-5"
      >

        <div>
          <label className="block mb-2 font-medium">
            Company Name
          </label>

          <input
            className="border rounded-lg p-3 w-full"
            value={settings?.companyName || ""}
            onChange={(e)=>
              handleChange(
                "companyName",
                e.target.value
              )
            }
          />
        </div>


        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              className="border rounded-lg p-3 w-full"
              value={settings?.phone || ""}
              onChange={(e)=>
                handleChange(
                  "phone",
                  e.target.value
                )
              }
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              className="border rounded-lg p-3 w-full"
              value={settings?.email || ""}
              onChange={(e)=>
                handleChange(
                  "email",
                  e.target.value
                )
              }
            />
          </div>

        </div>


        <div>
          <label className="block mb-2 font-medium">
            Address
          </label>

          <textarea
            className="border rounded-lg p-3 w-full"
            value={settings?.address || ""}
            onChange={(e)=>
              handleChange(
                "address",
                e.target.value
              )
            }
          />
        </div>


        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block mb-2 font-medium">
              Price Per Hour (UGX)
            </label>

            <input
              type="number"
              className="border rounded-lg p-3 w-full"
              value={settings?.pricePerHour || 0}
              onChange={(e)=>
                handleChange(
                  "pricePerHour",
                  Number(e.target.value)
                )
              }
            />
          </div>


          <div>
            <label className="block mb-2 font-medium">
              Grace Period (Minutes)
            </label>

            <input
              type="number"
              className="border rounded-lg p-3 w-full"
              value={settings?.gracePeriod || 0}
              onChange={(e)=>
                handleChange(
                  "gracePeriod",
                  Number(e.target.value)
                )
              }
            />
          </div>

        </div>


        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save Settings
        </button>

      </form>

    </DashboardLayout>
  );
}
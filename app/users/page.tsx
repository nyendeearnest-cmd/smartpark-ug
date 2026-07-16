"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "ATTENDANT";
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ATTENDANT" as "ADMIN" | "ATTENDANT",
  });

  async function fetchUsers() {
    try {
      setLoading(true);

      const res = await fetch("/api/users");
      const data = await res.json();

      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  fetchUsers();
}, []);



  function resetForm() {
    setEditingId(null);

    setForm({
      fullName: "",
      email: "",
      password: "",
      role: "ATTENDANT",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const url = editingId
      ? `/api/users/${editingId}`
      : "/api/users";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(
      editingId
        ? "User updated successfully."
        : "User created successfully."
    );

    resetForm();
    fetchUsers();
  }

  function handleEdit(user: User) {
    setEditingId(user.id);

    setForm({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;

    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("User deleted.");

    fetchUsers();
  }

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.fullName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.role
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [users, search]); 

return (
  <DashboardLayout
    title="Users"
    description="Manage system users"
  >
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg p-3"
      />
    </div>

    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-4 gap-4"
    >
      <input
        placeholder="Full Name"
        className="border rounded-lg p-3"
        value={form.fullName}
        onChange={(e) =>
          setForm({
            ...form,
            fullName: e.target.value,
          })
        }
      />

      <input
        placeholder="Email"
        type="email"
        className="border rounded-lg p-3"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
      />

      <input
        placeholder={
          editingId
            ? "Leave blank to keep password"
            : "Password"
        }
        type="password"
        className="border rounded-lg p-3"
        value={form.password}
        onChange={(e) =>
          setForm({
            ...form,
            password: e.target.value,
          })
        }
      />

      <select
        className="border rounded-lg p-3"
        value={form.role}
        onChange={(e) =>
          setForm({
            ...form,
            role: e.target.value as
              | "ADMIN"
              | "ATTENDANT",
          })
        }
      >
        <option value="ATTENDANT">
          Attendant
        </option>
        <option value="ADMIN">
          Admin
        </option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded-lg py-3"
      >
        {editingId ? "Update User" : "Add User"}
      </button>

      {editingId && (
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-600 text-white rounded-lg py-3"
        >
          Cancel
        </button>
      )}
    </form>

    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Email</th>
            <th className="text-left p-4">Role</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={4}
                className="text-center p-6"
              >
                Loading...
              </td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="text-center p-6"
              >
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t"
              >
                <td className="p-4">
                  {user.fullName}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      user.role === "ADMIN"
                        ? "bg-purple-600"
                        : "bg-green-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() =>
                      handleEdit(user)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(user.id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </DashboardLayout>
);
}
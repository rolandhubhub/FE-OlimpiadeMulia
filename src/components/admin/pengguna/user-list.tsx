"use client";

import { useMemo, useState } from "react";
import Badge from "@/components/admin/badge";
import PageHeader from "@/components/admin/page-header";
import ReadOnlyTable from "@/components/admin/read-only-table";
import { adminUsers } from "@/data/admin/pengguna";
import type { AdminTableColumn, AdminUser, AdminUserRole, AdminUserStatus } from "@/types/admin";

const columns: AdminTableColumn<AdminUser>[] = [
  {
    key: "number",
    header: "No",
    width: "6%",
    render: (_user, index = 0) => `${index + 1}.`,
  },
  {
    key: "user",
    header: "Pengguna",
    width: "34%",
    render: (user) => (
      <>
        <span className="user-list__primary">{user.name}</span>
        <span className="user-list__secondary">{user.email}</span>
      </>
    ),
  },
  {
    key: "role",
    header: "Role",
    width: "14%",
    render: (user) => (
      <span className={`user-list__role user-list__role--${user.role.toLowerCase()}`}>
        {user.role}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "18%",
    render: (user) => <Badge variant="ok">{user.status}</Badge>,
  },
  {
    key: "joined",
    header: "Bergabung",
    width: "28%",
    render: (user) => user.joined,
  },
];

export default function UserList() {
  const [emailSearch, setEmailSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "">("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | "">("");

  const filteredUsers = useMemo(() => {
    const query = emailSearch.trim().toLocaleLowerCase("id");
    return adminUsers.filter(
      (user) =>
        (!query || user.email.toLocaleLowerCase("id").includes(query)) &&
        (!statusFilter || user.status === statusFilter) &&
        (!roleFilter || user.role === roleFilter),
    );
  }, [emailSearch, roleFilter, statusFilter]);

  return (
    <>
      <PageHeader title="Pengguna" eyebrow="Pengguna" description="Akses Pengguna" />
      <div className="admin-readonly-page">
        <div className="admin-filter-bar admin-filter-bar--users">
          <label className="sr-only" htmlFor="user-email-search">
            Cari berdasarkan email
          </label>
          <input
            id="user-email-search"
            className="admin-filter admin-filter--user-email"
            type="search"
            placeholder="Cari Email"
            value={emailSearch}
            onChange={(event) => setEmailSearch(event.target.value)}
          />
          <label className="sr-only" htmlFor="user-status">
            Filter status pengguna
          </label>
          <select
            id="user-status"
            className="admin-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as AdminUserStatus | "")
            }
          >
            <option value="">Semua Status</option>
            <option value="Active">Active</option>
          </select>
          <label className="sr-only" htmlFor="user-role">
            Filter role pengguna
          </label>
          <select
            id="user-role"
            className="admin-filter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as AdminUserRole | "")}
          >
            <option value="">Semua Role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <ReadOnlyTable
          key={`${emailSearch}|${statusFilter}|${roleFilter}`}
          data={filteredUsers}
          columns={columns}
          getRowKey={(user) => user.id}
          label="Daftar pengguna"
        />
      </div>
    </>
  );
}

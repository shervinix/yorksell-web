"use client";

import { useEffect, useState } from "react";

type ClientRecord = {
  id: string;
  userId: string;
  user: { id: string; name: string | null; email: string | null };
  buyerClient: boolean;
  sellerClient: boolean;
  propertyManagementClient: boolean;
  showFiles: boolean;
  showStats: boolean;
  showNotes: boolean;
  showUpdates: boolean;
  statsJson: unknown;
  fileCount: number;
  noteCount: number;
  updateCount: number;
  updatedAt: string;
};

type UserOption = {
  id: string;
  name: string | null;
  email: string | null;
  hasClient: boolean;
};

type ClientDetail = ClientRecord & {
  files: { id: string; name: string; url: string; createdAt: string }[];
  notes: { id: string; content: string; createdAt: string }[];
  updates: { id: string; title: string; content: string; createdAt: string }[];
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<ClientDetail | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [formData, setFormData] = useState({
    buyerClient: false,
    sellerClient: false,
    propertyManagementClient: false,
    showFiles: true,
    showStats: true,
    showNotes: true,
    showUpdates: true,
    statsJson: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/admin/clients");
      if (!res.ok) return;
      const data = await res.json();
      setClients(data.clients || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch(`/api/admin/users?q=${encodeURIComponent(userSearch)}`);
    if (!res.ok) return;
    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => {
    if (showAddForm) fetchUsers();
  }, [showAddForm, userSearch]);

  const fetchClientDetail = async (clientId: string) => {
    const res = await fetch(`/api/admin/clients/${clientId}`);
    if (!res.ok) return;
    const data = await res.json();
    setExpandedClient(data.client);
  };

  const toggleExpand = (clientId: string) => {
    if (expandedId === clientId) {
      setExpandedId(null);
      setExpandedClient(null);
    } else {
      setExpandedId(clientId);
      fetchClientDetail(clientId);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      let statsJson: unknown = null;
      if (formData.statsJson.trim()) {
        try {
          statsJson = JSON.parse(formData.statsJson);
        } catch {
          setError("Invalid JSON for stats");
          setSubmitting(false);
          return;
        }
      }
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          buyerClient: formData.buyerClient,
          sellerClient: formData.sellerClient,
          propertyManagementClient: formData.propertyManagementClient,
          showFiles: formData.showFiles,
          showStats: formData.showStats,
          showNotes: formData.showNotes,
          showUpdates: formData.showUpdates,
          statsJson,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "Failed to create client");
        return;
      }
      setShowAddForm(false);
      setSelectedUserId("");
      setFormData({
        buyerClient: false, sellerClient: false, propertyManagementClient: false,
        showFiles: true, showStats: true, showNotes: true, showUpdates: true, statsJson: "",
      });
      fetchClients();
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateClient = async (clientId: string, updates: Partial<ClientDetail>) => {
    const res = await fetch(`/api/admin/clients/${clientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) return;
    fetchClientDetail(clientId);
    fetchClients();
  };

  const addFile = async (clientId: string, name: string, url: string) => {
    const res = await fetch(`/api/admin/clients/${clientId}/files`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url }),
    });
    if (!res.ok) return;
    fetchClientDetail(clientId);
    fetchClients();
  };

  const deleteFile = async (clientId: string, fileId: string) => {
    await fetch(`/api/admin/clients/${clientId}/files/${fileId}`, { method: "DELETE" });
    fetchClientDetail(clientId);
    fetchClients();
  };

  const addNote = async (clientId: string, content: string) => {
    const res = await fetch(`/api/admin/clients/${clientId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) return;
    fetchClientDetail(clientId);
    fetchClients();
  };

  const deleteNote = async (clientId: string, noteId: string) => {
    await fetch(`/api/admin/clients/${clientId}/notes/${noteId}`, { method: "DELETE" });
    fetchClientDetail(clientId);
    fetchClients();
  };

  const addUpdate = async (clientId: string, title: string, content: string) => {
    const res = await fetch(`/api/admin/clients/${clientId}/updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) return;
    fetchClientDetail(clientId);
    fetchClients();
  };

  const deleteUpdate = async (clientId: string, updateId: string) => {
    await fetch(`/api/admin/clients/${clientId}/updates/${updateId}`, { method: "DELETE" });
    fetchClientDetail(clientId);
    fetchClients();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Client Management</h1>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active clients</h2>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {showAddForm ? "Cancel" : "Add client"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleCreateClient} className="mt-6 space-y-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
            <div>
              <label className="block text-xs text-zinc-500">Search users</label>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Type to search by email or name"
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500">Select user</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              >
                <option value="">Choose a user</option>
                {users.filter((u) => !u.hasClient).map((u) => (
                  <option key={u.id} value={u.id}>{u.email ?? u.name ?? u.id}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-4">
              {(["buyerClient", "sellerClient", "propertyManagementClient"] as const).map((key) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[key]}
                    onChange={(e) => setFormData((d) => ({ ...d, [key]: e.target.checked }))}
                  />
                  <span className="text-sm">{key === "buyerClient" ? "Buyer" : key === "sellerClient" ? "Seller" : "Property Mgmt"}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !selectedUserId}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
            >
              {submitting ? "Creating…" : "Create client"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>
        ) : clients.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">No clients yet. Add one above.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {clients.map((c) => (
              <li key={c.id} className="rounded-xl border border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => toggleExpand(c.id)}
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <div>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {c.user?.email ?? c.user?.name ?? c.userId}
                    </span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {[c.buyerClient && "Buyer", c.sellerClient && "Seller", c.propertyManagementClient && "PM"]
                        .filter(Boolean).join(", ")}
                    </span>
                  </div>
                  <span className="text-zinc-400">{expandedId === c.id ? "▼" : "▶"}</span>
                </button>

                {expandedId === c.id && expandedClient && expandedClient.id === c.id && (
                  <ClientDetailPanel
                    client={expandedClient}
                    onUpdate={(updates) => handleUpdateClient(c.id, updates)}
                    onAddFile={(name, url) => addFile(c.id, name, url)}
                    onDeleteFile={(fileId) => deleteFile(c.id, fileId)}
                    onAddNote={(content) => addNote(c.id, content)}
                    onDeleteNote={(noteId) => deleteNote(c.id, noteId)}
                    onAddUpdate={(title, content) => addUpdate(c.id, title, content)}
                    onDeleteUpdate={(updateId) => deleteUpdate(c.id, updateId)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

type StatRow = { key: string; value: string };

function parseStatsJson(raw: unknown): StatRow[] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
  return Object.entries(raw as Record<string, unknown>).map(([key, value]) => ({
    key,
    value: String(value),
  }));
}

type Tab = "details" | "files" | "notes" | "updates";

function ClientDetailPanel({
  client,
  onUpdate,
  onAddFile,
  onDeleteFile,
  onAddNote,
  onDeleteNote,
  onAddUpdate,
  onDeleteUpdate,
}: {
  client: ClientDetail;
  onUpdate: (u: Partial<ClientDetail>) => void;
  onAddFile: (name: string, url: string) => void;
  onDeleteFile: (fileId: string) => void;
  onAddNote: (content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onAddUpdate: (title: string, content: string) => void;
  onDeleteUpdate: (updateId: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("details");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [statRows, setStatRows] = useState<StatRow[]>(() => parseStatsJson(client.statsJson));
  const [pendingDelete, setPendingDelete] = useState<{ type: string; id: string } | null>(null);

  function saveStats() {
    const obj = Object.fromEntries(statRows.filter((r) => r.key.trim()).map((r) => [r.key.trim(), r.value]));
    onUpdate({ statsJson: Object.keys(obj).length ? obj : null });
  }

  function confirmDelete(type: string, id: string) {
    setPendingDelete({ type, id });
  }

  function cancelDelete() {
    setPendingDelete(null);
  }

  function executeDelete() {
    if (!pendingDelete) return;
    const { type, id } = pendingDelete;
    setPendingDelete(null);
    if (type === "file") onDeleteFile(id);
    else if (type === "note") onDeleteNote(id);
    else if (type === "update") onDeleteUpdate(id);
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "details", label: "Details" },
    { key: "files", label: "Files", count: client.files.length },
    { key: "notes", label: "Notes", count: client.notes.length },
    { key: "updates", label: "Updates", count: client.updates.length },
  ];

  const inputClass =
    "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-700">
      {/* Tab bar */}
      <div className="flex border-b border-zinc-100 px-4 dark:border-zinc-800">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-3 text-xs font-medium transition-colors ${
              tab === key
                ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {label}
            {count !== undefined && count > 0 && (
              <span className="ml-1.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Inline delete confirmation banner */}
      {pendingDelete && (
        <div className="flex items-center justify-between bg-red-50 px-5 py-3 text-sm dark:bg-red-900/20">
          <span className="text-red-700 dark:text-red-300">
            Delete this {pendingDelete.type}? This cannot be undone.
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={executeDelete}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={cancelDelete}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-50/50 p-5 dark:bg-zinc-900/50">
        {/* Details tab */}
        {tab === "details" && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-medium text-zinc-500 mb-2">Services</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { key: "buyerClient" as const, label: "Buyer" },
                    { key: "sellerClient" as const, label: "Seller" },
                    { key: "propertyManagementClient" as const, label: "Property Management" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={client[key]}
                        onChange={(e) => onUpdate({ [key]: e.target.checked })}
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-medium text-zinc-500 mb-2">Portal visibility</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { key: "showFiles" as const, label: "Files tab" },
                    { key: "showStats" as const, label: "Stats tab" },
                    { key: "showNotes" as const, label: "Notes tab" },
                    { key: "showUpdates" as const, label: "Updates tab" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={client[key]}
                        onChange={(e) => onUpdate({ [key]: e.target.checked })}
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats key/value editor */}
            {client.showStats && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-zinc-500">Stats shown to client</h3>
                  <button
                    type="button"
                    onClick={saveStats}
                    className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  >
                    Save stats
                  </button>
                </div>
                <div className="space-y-2">
                  {statRows.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={row.key}
                        onChange={(e) =>
                          setStatRows((rows) => rows.map((r, j) => j === i ? { ...r, key: e.target.value } : r))
                        }
                        placeholder="Label"
                        className={`flex-1 ${inputClass}`}
                      />
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) =>
                          setStatRows((rows) => rows.map((r, j) => j === i ? { ...r, value: e.target.value } : r))
                        }
                        placeholder="Value"
                        className={`flex-1 ${inputClass}`}
                      />
                      <button
                        type="button"
                        onClick={() => setStatRows((rows) => rows.filter((_, j) => j !== i))}
                        className="rounded p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700"
                        aria-label="Remove row"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStatRows((rows) => [...rows, { key: "", value: "" }])}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    + Add row
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Files tab */}
        {tab === "files" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="File name"
                className={`flex-1 ${inputClass}`}
              />
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="URL"
                className={`flex-1 ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => {
                  if (fileName && fileUrl) {
                    onAddFile(fileName, fileUrl);
                    setFileName("");
                    setFileUrl("");
                  }
                }}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
              >
                Add
              </button>
            </div>
            {client.files.length === 0 ? (
              <p className="text-sm text-zinc-400">No files yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {client.files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                      {f.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => confirmDelete("file", f.id)}
                      className="text-xs text-red-500 hover:text-red-700 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Notes tab */}
        {tab === "notes" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Note content"
                rows={2}
                className={`flex-1 ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => {
                  if (noteContent.trim()) {
                    onAddNote(noteContent.trim());
                    setNoteContent("");
                  }
                }}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 self-start"
              >
                Add
              </button>
            </div>
            {client.notes.length === 0 ? (
              <p className="text-sm text-zinc-400">No notes yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {client.notes.map((n) => (
                  <li key={n.id} className="flex items-start justify-between gap-3 rounded-lg border border-zinc-100 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{n.content}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => confirmDelete("note", n.id)}
                      className="shrink-0 text-xs text-red-500 hover:text-red-700 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Updates tab */}
        {tab === "updates" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                placeholder="Title"
                className={`w-full ${inputClass}`}
              />
              <textarea
                value={updateContent}
                onChange={(e) => setUpdateContent(e.target.value)}
                placeholder="Content"
                rows={3}
                className={`w-full ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => {
                  if (updateTitle.trim() && updateContent.trim()) {
                    onAddUpdate(updateTitle.trim(), updateContent.trim());
                    setUpdateTitle("");
                    setUpdateContent("");
                  }
                }}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
              >
                Post update
              </button>
            </div>
            {client.updates.length === 0 ? (
              <p className="text-sm text-zinc-400">No updates yet.</p>
            ) : (
              <ul className="space-y-2">
                {client.updates.map((u) => (
                  <li key={u.id} className="rounded-lg border border-zinc-100 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{u.title}</p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{u.content}</p>
                        <p className="mt-1 text-xs text-zinc-400">{new Date(u.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => confirmDelete("update", u.id)}
                        className="shrink-0 text-xs text-red-500 hover:text-red-700 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
        buyerClient: false,
        sellerClient: false,
        propertyManagementClient: false,
        showFiles: true,
        showStats: true,
        showNotes: true,
        showUpdates: true,
        statsJson: "",
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
    if (!confirm("Delete this file?")) return;
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
    if (!confirm("Delete this note?")) return;
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
    if (!confirm("Delete this update?")) return;
    await fetch(`/api/admin/clients/${clientId}/updates/${updateId}`, { method: "DELETE" });
    fetchClientDetail(clientId);
    fetchClients();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Client Management
      </h1>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Active clients
          </h2>
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
                {users
                  .filter((u) => !u.hasClient)
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email ?? u.name ?? u.id}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.buyerClient}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, buyerClient: e.target.checked }))
                  }
                />
                <span className="text-sm">Buyer</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.sellerClient}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, sellerClient: e.target.checked }))
                  }
                />
                <span className="text-sm">Seller</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.propertyManagementClient}
                  onChange={(e) =>
                    setFormData((d) => ({
                      ...d,
                      propertyManagementClient: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm">Property Management</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.showFiles}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, showFiles: e.target.checked }))
                  }
                />
                <span className="text-sm">Show files</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.showStats}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, showStats: e.target.checked }))
                  }
                />
                <span className="text-sm">Show stats</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.showNotes}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, showNotes: e.target.checked }))
                  }
                />
                <span className="text-sm">Show notes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.showUpdates}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, showUpdates: e.target.checked }))
                  }
                />
                <span className="text-sm">Show updates</span>
              </label>
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
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
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Loading…
          </p>
        ) : clients.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            No clients yet. Add one above.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {clients.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-700"
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(c.id)}
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <div>
                    <span className="font-medium">
                      {c.user?.email ?? c.user?.name ?? c.userId}
                    </span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {[c.buyerClient && "Buyer", c.sellerClient && "Seller", c.propertyManagementClient && "PM"]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                  <span className="text-zinc-400">
                    {expandedId === c.id ? "▼" : "▶"}
                  </span>
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
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [statsJson, setStatsJson] = useState(
    typeof client.statsJson === "object" && client.statsJson !== null
      ? JSON.stringify(client.statsJson, null, 2)
      : ""
  );

  const saveStats = () => {
    try {
      const parsed = statsJson.trim() ? JSON.parse(statsJson) : null;
      onUpdate({ statsJson: parsed });
    } catch {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="border-t border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-medium text-zinc-500">Services</h3>
          <div className="mt-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={client.buyerClient}
                onChange={(e) => onUpdate({ buyerClient: e.target.checked })}
              />
              <span className="text-sm">Buyer</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={client.sellerClient}
                onChange={(e) => onUpdate({ sellerClient: e.target.checked })}
              />
              <span className="text-sm">Seller</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={client.propertyManagementClient}
                onChange={(e) =>
                  onUpdate({ propertyManagementClient: e.target.checked })
                }
              />
              <span className="text-sm">Property Management</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-medium text-zinc-500">Visibility</h3>
          <div className="mt-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={client.showFiles}
                onChange={(e) => onUpdate({ showFiles: e.target.checked })}
              />
              <span className="text-sm">Files</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={client.showStats}
                onChange={(e) => onUpdate({ showStats: e.target.checked })}
              />
              <span className="text-sm">Stats</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={client.showNotes}
                onChange={(e) => onUpdate({ showNotes: e.target.checked })}
              />
              <span className="text-sm">Notes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={client.showUpdates}
                onChange={(e) => onUpdate({ showUpdates: e.target.checked })}
              />
              <span className="text-sm">Updates</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-medium text-zinc-500">Stats (JSON)</h3>
        <textarea
          value={statsJson}
          onChange={(e) => setStatsJson(e.target.value)}
          onBlur={saveStats}
          rows={4}
          placeholder='{"Rent collected": "$2,500", "Occupancy": "100%"}'
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-medium text-zinc-500">Files</h3>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="File name"
            className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="URL"
            className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
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
            className="rounded-lg bg-zinc-200 px-3 py-1.5 text-sm dark:bg-zinc-700"
          >
            Add
          </button>
        </div>
        <ul className="mt-2 space-y-1">
          {client.files.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between rounded bg-white px-2 py-1 dark:bg-zinc-800"
            >
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                {f.name}
              </a>
              <button
                type="button"
                onClick={() => onDeleteFile(f.id)}
                className="text-xs text-red-600 dark:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-medium text-zinc-500">Notes</h3>
        <div className="mt-2 flex gap-2">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Note content"
            rows={2}
            className="flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
          <button
            type="button"
            onClick={() => {
              if (noteContent.trim()) {
                onAddNote(noteContent.trim());
                setNoteContent("");
              }
            }}
            className="rounded-lg bg-zinc-200 px-3 py-1.5 text-sm dark:bg-zinc-700"
          >
            Add
          </button>
        </div>
        <ul className="mt-2 space-y-1">
          {client.notes.map((n) => (
            <li
              key={n.id}
              className="flex items-start justify-between rounded bg-white px-2 py-1 dark:bg-zinc-800"
            >
              <span className="text-sm">{n.content.slice(0, 60)}...</span>
              <button
                type="button"
                onClick={() => onDeleteNote(n.id)}
                className="text-xs text-red-600 dark:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-medium text-zinc-500">Updates</h3>
        <div className="mt-2 space-y-2">
          <input
            type="text"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
          <textarea
            value={updateContent}
            onChange={(e) => setUpdateContent(e.target.value)}
            placeholder="Content"
            rows={2}
            className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
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
            className="rounded-lg bg-zinc-200 px-3 py-1.5 text-sm dark:bg-zinc-700"
          >
            Add update
          </button>
        </div>
        <ul className="mt-2 space-y-1">
          {client.updates.map((u) => (
            <li
              key={u.id}
              className="flex items-start justify-between rounded bg-white px-2 py-1 dark:bg-zinc-800"
            >
              <span className="text-sm font-medium">{u.title}</span>
              <button
                type="button"
                onClick={() => onDeleteUpdate(u.id)}
                className="text-xs text-red-600 dark:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

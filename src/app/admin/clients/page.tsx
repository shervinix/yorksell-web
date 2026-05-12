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
  showChecklist: boolean;
  showMessages: boolean;
  showAppointments: boolean;
  showOffers: boolean;
  stage: string | null;
  agentName: string | null;
  agentTitle: string | null;
  agentPhone: string | null;
  agentEmail: string | null;
  pinnedListingIds: string[];
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

type ChecklistItem = {
  id: string;
  title: string;
  assignedTo: string;
  done: boolean;
  doneAt: string | null;
  order: number;
  createdAt: string;
};

type Message = {
  id: string;
  fromAgent: boolean;
  content: string;
  readAt: string | null;
  createdAt: string;
};

type Appointment = {
  id: string;
  title: string;
  date: string;
  notes: string | null;
  createdAt: string;
};

type Offer = {
  id: string;
  address: string | null;
  price: number | null;
  status: string;
  conditions: string | null;
  closingDate: string | null;
  notes: string | null;
  createdAt: string;
};

type ClientDetail = ClientRecord & {
  files: { id: string; name: string; url: string; createdAt: string }[];
  notes: { id: string; content: string; createdAt: string }[];
  updates: { id: string; title: string; content: string; createdAt: string }[];
  checklist: ChecklistItem[];
  messages: Message[];
  appointments: Appointment[];
  offers: Offer[];
};

const TRANSACTION_STAGES = [
  "Pre-listing / Preparation",
  "Listed / Active",
  "Offer Received",
  "Conditional",
  "Firm Sale",
  "Closing Scheduled",
  "Closed",
  "Searching",
  "Viewed Properties",
  "Offer Submitted",
  "Offer Accepted",
  "Conditions Satisfied",
  "Closing",
  "Possession",
];

const OFFER_STATUSES = ["Pending", "Accepted", "Conditional", "Firm", "Rejected", "Withdrawn", "Expired"];

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

  const handleUpdateClient = async (clientId: string, updates: Record<string, unknown>) => {
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

  const addChecklistItem = async (clientId: string, title: string, assignedTo: string) => {
    const res = await fetch(`/api/admin/clients/${clientId}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, assignedTo }),
    });
    if (!res.ok) return;
    fetchClientDetail(clientId);
  };

  const patchChecklistItem = async (clientId: string, itemId: string, patch: Record<string, unknown>) => {
    await fetch(`/api/admin/clients/${clientId}/checklist/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    fetchClientDetail(clientId);
  };

  const deleteChecklistItem = async (clientId: string, itemId: string) => {
    await fetch(`/api/admin/clients/${clientId}/checklist/${itemId}`, { method: "DELETE" });
    fetchClientDetail(clientId);
  };

  const addMessage = async (clientId: string, content: string) => {
    const res = await fetch(`/api/admin/clients/${clientId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, fromAgent: true }),
    });
    if (!res.ok) return;
    fetchClientDetail(clientId);
  };

  const addAppointment = async (clientId: string, title: string, date: string, notes: string) => {
    const res = await fetch(`/api/admin/clients/${clientId}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, notes: notes || null }),
    });
    if (!res.ok) return;
    fetchClientDetail(clientId);
  };

  const deleteAppointment = async (clientId: string, appointmentId: string) => {
    await fetch(`/api/admin/clients/${clientId}/appointments/${appointmentId}`, { method: "DELETE" });
    fetchClientDetail(clientId);
  };

  const addOffer = async (clientId: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/clients/${clientId}/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return;
    fetchClientDetail(clientId);
  };

  const patchOffer = async (clientId: string, offerId: string, patch: Record<string, unknown>) => {
    await fetch(`/api/admin/clients/${clientId}/offers/${offerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    fetchClientDetail(clientId);
  };

  const deleteOffer = async (clientId: string, offerId: string) => {
    await fetch(`/api/admin/clients/${clientId}/offers/${offerId}`, { method: "DELETE" });
    fetchClientDetail(clientId);
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
                    {c.stage && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {c.stage}
                      </span>
                    )}
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
                    onAddChecklistItem={(title, assignedTo) => addChecklistItem(c.id, title, assignedTo)}
                    onPatchChecklistItem={(itemId, patch) => patchChecklistItem(c.id, itemId, patch)}
                    onDeleteChecklistItem={(itemId) => deleteChecklistItem(c.id, itemId)}
                    onAddMessage={(content) => addMessage(c.id, content)}
                    onAddAppointment={(title, date, notes) => addAppointment(c.id, title, date, notes)}
                    onDeleteAppointment={(apptId) => deleteAppointment(c.id, apptId)}
                    onAddOffer={(data) => addOffer(c.id, data)}
                    onPatchOffer={(offerId, patch) => patchOffer(c.id, offerId, patch)}
                    onDeleteOffer={(offerId) => deleteOffer(c.id, offerId)}
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

function fmt(price: number) {
  return "$" + price.toLocaleString("en-CA");
}

type Tab = "details" | "stage" | "files" | "notes" | "updates" | "checklist" | "messages" | "appointments" | "offers";

function ClientDetailPanel({
  client,
  onUpdate,
  onAddFile,
  onDeleteFile,
  onAddNote,
  onDeleteNote,
  onAddUpdate,
  onDeleteUpdate,
  onAddChecklistItem,
  onPatchChecklistItem,
  onDeleteChecklistItem,
  onAddMessage,
  onAddAppointment,
  onDeleteAppointment,
  onAddOffer,
  onPatchOffer,
  onDeleteOffer,
}: {
  client: ClientDetail;
  onUpdate: (u: Record<string, unknown>) => void;
  onAddFile: (name: string, url: string) => void;
  onDeleteFile: (fileId: string) => void;
  onAddNote: (content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onAddUpdate: (title: string, content: string) => void;
  onDeleteUpdate: (updateId: string) => void;
  onAddChecklistItem: (title: string, assignedTo: string) => void;
  onPatchChecklistItem: (itemId: string, patch: Record<string, unknown>) => void;
  onDeleteChecklistItem: (itemId: string) => void;
  onAddMessage: (content: string) => void;
  onAddAppointment: (title: string, date: string, notes: string) => void;
  onDeleteAppointment: (apptId: string) => void;
  onAddOffer: (data: Record<string, unknown>) => void;
  onPatchOffer: (offerId: string, patch: Record<string, unknown>) => void;
  onDeleteOffer: (offerId: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("details");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [statRows, setStatRows] = useState<StatRow[]>(() => parseStatsJson(client.statsJson));
  const [pendingDelete, setPendingDelete] = useState<{ type: string; id: string } | null>(null);

  // Stage/Agent state
  const [agentName, setAgentName] = useState(client.agentName ?? "");
  const [agentTitle, setAgentTitle] = useState(client.agentTitle ?? "");
  const [agentPhone, setAgentPhone] = useState(client.agentPhone ?? "");
  const [agentEmail, setAgentEmail] = useState(client.agentEmail ?? "");

  // Checklist state
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemAssigned, setNewItemAssigned] = useState("client");

  // Message state
  const [messageContent, setMessageContent] = useState("");

  // Appointment state
  const [apptTitle, setApptTitle] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [apptNotes, setApptNotes] = useState("");

  // Offer state
  const [offerAddress, setOfferAddress] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerStatus, setOfferStatus] = useState("Pending");
  const [offerConditions, setOfferConditions] = useState("");
  const [offerClosing, setOfferClosing] = useState("");
  const [offerNotes, setOfferNotes] = useState("");
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  function saveStats() {
    const obj = Object.fromEntries(statRows.filter((r) => r.key.trim()).map((r) => [r.key.trim(), r.value]));
    onUpdate({ statsJson: Object.keys(obj).length ? obj : null });
  }

  function saveAgent() {
    onUpdate({
      agentName: agentName.trim() || null,
      agentTitle: agentTitle.trim() || null,
      agentPhone: agentPhone.trim() || null,
      agentEmail: agentEmail.trim() || null,
    });
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
    else if (type === "checklist") onDeleteChecklistItem(id);
    else if (type === "appointment") onDeleteAppointment(id);
    else if (type === "offer") onDeleteOffer(id);
  }

  function startEditOffer(offer: Offer) {
    setEditingOfferId(offer.id);
    setOfferAddress(offer.address ?? "");
    setOfferPrice(offer.price ? String(offer.price) : "");
    setOfferStatus(offer.status);
    setOfferConditions(offer.conditions ?? "");
    setOfferClosing(offer.closingDate ? offer.closingDate.split("T")[0] : "");
    setOfferNotes(offer.notes ?? "");
  }

  function saveEditOffer(offerId: string) {
    onPatchOffer(offerId, {
      address: offerAddress.trim() || null,
      price: offerPrice ? parseInt(offerPrice, 10) : null,
      status: offerStatus,
      conditions: offerConditions.trim() || null,
      closingDate: offerClosing || null,
      notes: offerNotes.trim() || null,
    });
    setEditingOfferId(null);
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "details", label: "Details" },
    { key: "stage", label: "Stage & Agent" },
    { key: "files", label: "Files", count: client.files.length },
    { key: "notes", label: "Notes", count: client.notes.length },
    { key: "updates", label: "Updates", count: client.updates.length },
    { key: "checklist", label: "Checklist", count: client.checklist.length },
    { key: "messages", label: "Messages", count: client.messages.length },
    { key: "appointments", label: "Appointments", count: client.appointments.length },
    { key: "offers", label: "Offers", count: client.offers.length },
  ];

  const inputClass =
    "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-700">
      {/* Tab bar — scrollable on small screens */}
      <div className="flex overflow-x-auto border-b border-zinc-100 px-4 dark:border-zinc-800">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-xs font-medium transition-colors ${
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
        {/* ── Details tab ── */}
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
                <h3 className="text-xs font-medium text-zinc-500 mb-2">Portal sections visible to client</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { key: "showFiles" as const, label: "Files" },
                    { key: "showStats" as const, label: "Stats" },
                    { key: "showNotes" as const, label: "Notes" },
                    { key: "showUpdates" as const, label: "Updates" },
                    { key: "showChecklist" as const, label: "Checklist" },
                    { key: "showMessages" as const, label: "Messages" },
                    { key: "showAppointments" as const, label: "Appointments" },
                    { key: "showOffers" as const, label: "Offers" },
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

        {/* ── Stage & Agent tab ── */}
        {tab === "stage" && (
          <div className="space-y-6">
            {/* Transaction stage */}
            <div>
              <h3 className="text-xs font-medium text-zinc-500 mb-2">Transaction stage</h3>
              <div className="flex flex-wrap gap-2">
                {TRANSACTION_STAGES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onUpdate({ stage: client.stage === s ? null : s })}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      client.stage === s
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-zinc-400">Click a stage to activate it. Click again to clear.</p>
            </div>

            {/* Agent contact card */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-zinc-500">Agent contact card (shown to client)</h3>
                <button
                  type="button"
                  onClick={saveAgent}
                  className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  Save card
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Name</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Agent full name"
                    className={`w-full ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={agentTitle}
                    onChange={(e) => setAgentTitle(e.target.value)}
                    placeholder="e.g. Sales Representative"
                    className={`w-full ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={agentPhone}
                    onChange={(e) => setAgentPhone(e.target.value)}
                    placeholder="(416) 555-0000"
                    className={`w-full ${inputClass}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={agentEmail}
                    onChange={(e) => setAgentEmail(e.target.value)}
                    placeholder="agent@yorksell.ca"
                    className={`w-full ${inputClass}`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Files tab ── */}
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

        {/* ── Notes tab ── */}
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

        {/* ── Updates tab ── */}
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

        {/* ── Checklist tab ── */}
        {tab === "checklist" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Checklist item"
                className={`flex-1 ${inputClass}`}
              />
              <select
                value={newItemAssigned}
                onChange={(e) => setNewItemAssigned(e.target.value)}
                className={inputClass}
              >
                <option value="client">Client</option>
                <option value="agent">Agent</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  if (newItemTitle.trim()) {
                    onAddChecklistItem(newItemTitle.trim(), newItemAssigned);
                    setNewItemTitle("");
                  }
                }}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
              >
                Add
              </button>
            </div>
            {client.checklist.length === 0 ? (
              <p className="text-sm text-zinc-400">No checklist items yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {client.checklist.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={(e) => onPatchChecklistItem(item.id, { done: e.target.checked })}
                      className="h-4 w-4 rounded"
                    />
                    <span className={`flex-1 text-sm ${item.done ? "line-through text-zinc-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                      {item.title}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.assignedTo === "agent"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                    }`}>
                      {item.assignedTo}
                    </span>
                    <button
                      type="button"
                      onClick={() => confirmDelete("checklist", item.id)}
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

        {/* ── Messages tab ── */}
        {tab === "messages" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Message to client…"
                rows={2}
                className={`flex-1 ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => {
                  if (messageContent.trim()) {
                    onAddMessage(messageContent.trim());
                    setMessageContent("");
                  }
                }}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 self-start"
              >
                Send
              </button>
            </div>
            {client.messages.length === 0 ? (
              <p className="text-sm text-zinc-400">No messages yet.</p>
            ) : (
              <div className="space-y-2">
                {client.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.fromAgent ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      m.fromAgent
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    }`}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      <p className={`mt-1 text-xs ${m.fromAgent ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-400"}`}>
                        {m.fromAgent ? "Agent" : "Client"} · {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Appointments tab ── */}
        {tab === "appointments" && (
          <div className="space-y-4">
            <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={apptTitle}
                  onChange={(e) => setApptTitle(e.target.value)}
                  placeholder="Title (e.g. Property showing)"
                  className={`w-full ${inputClass}`}
                />
                <input
                  type="datetime-local"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className={`w-full ${inputClass}`}
                />
              </div>
              <input
                type="text"
                value={apptNotes}
                onChange={(e) => setApptNotes(e.target.value)}
                placeholder="Notes (optional)"
                className={`w-full ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => {
                  if (apptTitle.trim() && apptDate) {
                    onAddAppointment(apptTitle.trim(), apptDate, apptNotes);
                    setApptTitle("");
                    setApptDate("");
                    setApptNotes("");
                  }
                }}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
              >
                Add appointment
              </button>
            </div>
            {client.appointments.length === 0 ? (
              <p className="text-sm text-zinc-400">No appointments yet.</p>
            ) : (
              <ul className="space-y-2">
                {client.appointments.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 rounded-lg border border-zinc-100 bg-white px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{a.title}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(a.date).toLocaleDateString("en-CA", {
                          weekday: "short", year: "numeric", month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                      {a.notes && <p className="mt-0.5 text-xs text-zinc-400">{a.notes}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => confirmDelete("appointment", a.id)}
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

        {/* ── Offers tab ── */}
        {tab === "offers" && (
          <div className="space-y-4">
            {/* New offer form */}
            {editingOfferId === null && (
              <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
                <p className="text-xs font-medium text-zinc-500">New offer</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={offerAddress}
                    onChange={(e) => setOfferAddress(e.target.value)}
                    placeholder="Property address"
                    className={`w-full ${inputClass}`}
                  />
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="Offer price"
                    className={`w-full ${inputClass}`}
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    value={offerStatus}
                    onChange={(e) => setOfferStatus(e.target.value)}
                    className={`w-full ${inputClass}`}
                  >
                    {OFFER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input
                    type="date"
                    value={offerClosing}
                    onChange={(e) => setOfferClosing(e.target.value)}
                    placeholder="Closing date"
                    className={`w-full ${inputClass}`}
                  />
                </div>
                <textarea
                  value={offerConditions}
                  onChange={(e) => setOfferConditions(e.target.value)}
                  placeholder="Conditions (optional)"
                  rows={2}
                  className={`w-full ${inputClass}`}
                />
                <textarea
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  placeholder="Notes (optional)"
                  rows={2}
                  className={`w-full ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    onAddOffer({
                      address: offerAddress.trim() || null,
                      price: offerPrice ? parseInt(offerPrice, 10) : null,
                      status: offerStatus,
                      conditions: offerConditions.trim() || null,
                      closingDate: offerClosing || null,
                      notes: offerNotes.trim() || null,
                    });
                    setOfferAddress("");
                    setOfferPrice("");
                    setOfferStatus("Pending");
                    setOfferConditions("");
                    setOfferClosing("");
                    setOfferNotes("");
                  }}
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
                >
                  Add offer
                </button>
              </div>
            )}

            {client.offers.length === 0 ? (
              <p className="text-sm text-zinc-400">No offers yet.</p>
            ) : (
              <ul className="space-y-3">
                {client.offers.map((o) => (
                  <li key={o.id} className="rounded-lg border border-zinc-100 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
                    {editingOfferId === o.id ? (
                      <div className="space-y-2">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input type="text" value={offerAddress} onChange={(e) => setOfferAddress(e.target.value)} placeholder="Address" className={`w-full ${inputClass}`} />
                          <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="Price" className={`w-full ${inputClass}`} />
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <select value={offerStatus} onChange={(e) => setOfferStatus(e.target.value)} className={`w-full ${inputClass}`}>
                            {OFFER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                          <input type="date" value={offerClosing} onChange={(e) => setOfferClosing(e.target.value)} className={`w-full ${inputClass}`} />
                        </div>
                        <textarea value={offerConditions} onChange={(e) => setOfferConditions(e.target.value)} placeholder="Conditions" rows={2} className={`w-full ${inputClass}`} />
                        <textarea value={offerNotes} onChange={(e) => setOfferNotes(e.target.value)} placeholder="Notes" rows={2} className={`w-full ${inputClass}`} />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => saveEditOffer(o.id)} className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">Save</button>
                          <button type="button" onClick={() => setEditingOfferId(null)} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-0.5">
                          {o.address && <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{o.address}</p>}
                          <div className="flex flex-wrap items-center gap-2">
                            {o.price && <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{fmt(o.price)}</span>}
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              o.status === "Accepted" || o.status === "Firm" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : o.status === "Rejected" || o.status === "Withdrawn" || o.status === "Expired" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : o.status === "Conditional" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                            }`}>
                              {o.status}
                            </span>
                          </div>
                          {o.closingDate && (
                            <p className="text-xs text-zinc-500">Closing: {new Date(o.closingDate).toLocaleDateString("en-CA")}</p>
                          )}
                          {o.conditions && <p className="text-xs text-zinc-400">Conditions: {o.conditions}</p>}
                          {o.notes && <p className="text-xs text-zinc-400">{o.notes}</p>}
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button type="button" onClick={() => startEditOffer(o)} className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Edit</button>
                          <button type="button" onClick={() => confirmDelete("offer", o.id)} className="text-xs text-red-500 hover:text-red-700 dark:text-red-400">Delete</button>
                        </div>
                      </div>
                    )}
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

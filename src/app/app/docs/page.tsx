"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocModal } from "@/components/doc-modal";
import { docLanguages, docVisibilities } from "@/lib/constants";
import type { Doc } from "@/lib/types";
import { createDoc, deleteDoc, fetchDocs, updateDoc } from "@/services/docs";
import { BookOpen, Plus, Undo2 } from "lucide-react";

type DocFiltersState = {
  language?: string;
  visibility?: string;
  q?: string;
};

export default function DocsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DocFiltersState>({});
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Doc | null>(null);

  const fetchFilters = useMemo(() => {
    return {
      language: filters.language || undefined,
      visibility: filters.visibility || undefined,
      q: filters.q || undefined
    };
  }, [filters]);

  const loadDocs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDocs(fetchFilters);
      setDocs(data);
      if (!selectedDocId && data.length > 0) {
        setSelectedDocId(data[0].id);
      }
      if (selectedDocId && !data.find((doc) => doc.id === selectedDocId)) {
        setSelectedDocId(data[0]?.id ?? null);
      }
    } catch (error) {
      toast.error("Erro ao carregar documentacoes", { description: String(error) });
    } finally {
      setLoading(false);
    }
  }, [fetchFilters, selectedDocId]);

  useEffect(() => {
    void loadDocs();
  }, [loadDocs]);

  const activeDoc = useMemo(
    () => docs.find((doc) => doc.id === selectedDocId) ?? null,
    [docs, selectedDocId]
  );

  const handleSaveDoc = async (values: {
    title: string;
    content: string;
    language: Doc["language"];
    visibility: Doc["visibility"];
  }, docId?: string) => {
    try {
      const saved = docId ? await updateDoc(docId, values) : await createDoc(values);
      toast.success(docId ? "Documentacao atualizada" : "Documentacao criada");
      setDocModalOpen(false);
      setEditingDoc(null);
      await loadDocs();
      setSelectedDocId(saved.id);
    } catch (error) {
      toast.error("Erro ao salvar documentacao", { description: String(error) });
    }
  };

  const handleDeleteDoc = async (doc: Doc) => {
    if (!confirm(`Excluir a documentacao "${doc.title}"?`)) return;
    try {
      await deleteDoc(doc.id);
      toast.success("Documentacao removida");
      if (selectedDocId === doc.id) {
        setSelectedDocId(null);
      }
      await loadDocs();
    } catch (error) {
      toast.error("Erro ao excluir documentacao", { description: String(error) });
    }
  };

  return (
    <main className="min-h-screen px-6 pb-24 pt-24">
      <div className="fixed left-1/2 top-6 z-40 flex w-[calc(100%-3rem)] max-w-6xl -translate-x-1/2 flex-col items-start gap-3 rounded-2xl border bg-white/90 px-4 py-3 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-sm font-semibold text-stone-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white">
            <BookOpen className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">TaskFlow</p>
            <p>Documentacoes</p>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-2 md:flex-row md:items-center">
          <Input
            placeholder="Buscar por titulo ou conteudo..."
            value={filters.q ?? ""}
            onChange={(event) => setFilters({ ...filters, q: event.target.value })}
            className="border-stone-200 bg-white text-stone-900 placeholder:text-stone-400"
          />
          <div className="flex w-full flex-wrap gap-2 md:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                setEditingDoc(null);
                setDocModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nova doc
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/app">
                <Undo2 className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4 rounded-3xl border bg-white/70 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Biblioteca
            </h2>
            <span className="rounded-full border bg-white px-2 text-xs">{docs.length}</span>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Linguagem</Label>
              <Select
                value={filters.language ?? "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, language: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {docLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={filters.visibility ?? "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, visibility: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {docVisibilities.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>
                      {visibility === "public" ? "Publico" : "Pessoal"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando documentacoes...</p>
          ) : docs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma documentacao cadastrada.</p>
          ) : (
            <div className="space-y-2">
              {docs.map((doc) => {
                const isActive = doc.id === selectedDocId;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                      isActive ? "border-stone-900 bg-white" : "border-transparent bg-white/70 hover:bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold">{doc.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Badge>{doc.language.toUpperCase()}</Badge>
                      <Badge variant={doc.visibility === "public" ? "warning" : "success"}>
                        {doc.visibility === "public" ? "Publico" : "Pessoal"}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="rounded-3xl border bg-white/80 p-6">
          {!activeDoc ? (
            <div className="rounded-2xl border border-dashed bg-white/80 p-6 text-sm text-muted-foreground">
              Selecione uma documentacao para visualizar.
            </div>
          ) : (
            <div className="space-y-6">
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold">{activeDoc.title}</h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge>{activeDoc.language.toUpperCase()}</Badge>
                    <Badge variant={activeDoc.visibility === "public" ? "warning" : "success"}>
                      {activeDoc.visibility === "public" ? "Publico" : "Pessoal"}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingDoc(activeDoc);
                      setDocModalOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteDoc(activeDoc)}>
                    Excluir
                  </Button>
                </div>
              </header>

              <div className="rounded-2xl border bg-white px-4 py-4 text-sm leading-relaxed text-stone-800">
                <pre className="whitespace-pre-wrap font-mono text-sm">{activeDoc.content}</pre>
              </div>
            </div>
          )}
        </section>
      </div>

      <DocModal
        open={docModalOpen}
        doc={editingDoc}
        onClose={() => {
          setDocModalOpen(false);
          setEditingDoc(null);
        }}
        onSubmit={handleSaveDoc}
      />
    </main>
  );
}

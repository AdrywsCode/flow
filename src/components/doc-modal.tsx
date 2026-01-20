import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { docLanguages, docVisibilities } from "@/lib/constants";
import { docSchema } from "@/lib/validations";
import type { Doc } from "@/lib/types";

type DocFormValues = z.infer<typeof docSchema>;

type DocModalProps = {
  open: boolean;
  doc?: Doc | null;
  onClose: () => void;
  onSubmit: (values: DocFormValues, docId?: string) => Promise<void>;
};

export function DocModal({ open, doc, onClose, onSubmit }: DocModalProps) {
  const form = useForm<DocFormValues>({
    resolver: zodResolver(docSchema),
    defaultValues: {
      title: "",
      content: "",
      language: "html",
      visibility: "personal"
    }
  });

  useEffect(() => {
    if (doc) {
      form.reset({
        title: doc.title,
        content: doc.content,
        language: doc.language,
        visibility: doc.visibility
      });
    } else {
      form.reset({
        title: "",
        content: "",
        language: "html",
        visibility: "personal"
      });
    }
  }, [doc, form]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      form.setValue("content", text, { shouldDirty: true });
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{doc ? "Editar documentacao" : "Nova documentacao"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => onSubmit(values, doc?.id))}
        >
          <div className="space-y-2">
            <Label htmlFor="doc-title">Titulo</Label>
            <Input id="doc-title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-xs text-rose-600">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Linguagem</Label>
              <Select
                value={form.watch("language")}
                onValueChange={(value) => form.setValue("language", value as DocFormValues["language"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                value={form.watch("visibility")}
                onValueChange={(value) =>
                  form.setValue("visibility", value as DocFormValues["visibility"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {docVisibilities.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>
                      {visibility === "public" ? "Publico" : "Pessoal"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-content">Conteudo</Label>
            <Textarea id="doc-content" rows={10} {...form.register("content")} />
            {form.formState.errors.content && (
              <p className="text-xs text-rose-600">{form.formState.errors.content.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Upload de arquivo</Label>
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="doc-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Escolher arquivo
              </label>
              <span className="text-xs text-muted-foreground">
                Suporta .md, .txt, .html, .css e .js.
              </span>
            </div>
            <input
              id="doc-upload"
              type="file"
              accept=".md,.txt,.html,.css,.js"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

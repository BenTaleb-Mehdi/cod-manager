"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FolderPlus, Loader2 } from "lucide-react";
import { Category } from "@/types";
import { createCategoryAction } from "@/actions/inventory";

const AddCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Le nom de la catégorie doit comporter au moins 2 caractères.")
    .max(191),
  slug: z
    .string()
    .min(2, "Le slug doit comporter au moins 2 caractères.")
    .max(191)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit être en minuscules avec des tirets (ex: beaute-soins)."
    ),
  description: z.string().max(500).optional(),
});

type AddCategoryFormValues = z.infer<typeof AddCategorySchema>;

interface AddCategoryDialogProps {
  onCategoryCreated?: (newCategory: Category) => void;
}

export function AddCategoryDialog({ onCategoryCreated }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddCategoryFormValues>({
    resolver: zodResolver(AddCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Auto-génération du slug à la saisie du nom
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const autoSlug = name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setValue("slug", autoSlug, { shouldValidate: true });
  };

  const onSubmit = async (values: AddCategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await createCategoryAction(values);

      const createdCategory: Category = {
        id: res.success && res.data ? res.data.id : `cat-${Date.now()}`,
        name: values.name,
        slug: values.slug,
        description: values.description,
        productCount: 0,
        createdAt: new Date().toISOString(),
      };

      if (onCategoryCreated) {
        onCategoryCreated(createdCategory);
      }

      reset();
      setOpen(false);
    } catch (e) {
      console.error("Error creating category:", e);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-9">
          <FolderPlus className="h-4 w-4" />
          <span>Nouvelle Catégorie</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            Ajouter une Catégorie
          </DialogTitle>
          <DialogDescription>
            Créez une catégorie pour classer vos produits e-commerce et optimiser vos stocks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Nom */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Nom de la catégorie</Label>
            <Input
              id="category-name"
              placeholder="ex: Beauté & Cosmétiques"
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
                handleNameChange(e);
              }}
            />
            {errors.name && (
              <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="category-slug">Slug URL</Label>
            <Input
              id="category-slug"
              placeholder="ex: beaute-cosmetiques"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-xs text-destructive font-medium">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="category-desc">Description (optionnelle)</Label>
            <Input
              id="category-desc"
              placeholder="Courte description de la gamme..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive font-medium">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Créer la catégorie
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { z } from "zod";
import { FileCategory } from "@prisma/client";

export const fileSchema = z.object({
  name: z.string().min(2, "Asset name must be at least 2 characters").max(120, "Name is too long"),
  fileUrl: z.string().url("Must be a valid asset or documentation URL (e.g. https://...)"),
  fileSizeKb: z.coerce.number().min(1, "File size must be greater than 0 KB"),
  mimeType: z.string().min(2, "MIME / file type format is required (e.g. application/pdf, image/png)"),
  category: z.nativeEnum(FileCategory).default(FileCategory.REFERENCE),
  projectId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable(),
});

export type FileInput = z.infer<typeof fileSchema>;

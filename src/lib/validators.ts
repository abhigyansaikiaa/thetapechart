import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./constants";

export const TradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  entry: z.number().positive("Entry must be greater than 0"),
  exit: z.number().positive("Exit must be greater than 0"),
  sl: z.number().positive("Stop Loss must be greater than 0"),
  tp: z.number().positive("Take Profit must be greater than 0"),
  size: z.number().positive("Position size must be greater than 0"),
  instrument: z.enum(["EQUITY", "FUTURES", "OPTIONS"]),
  strategy: z.string().min(1, "Strategy is required"),
  screenshotUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const ImageUploadSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size is 500KB."
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

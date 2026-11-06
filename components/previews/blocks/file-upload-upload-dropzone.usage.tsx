"use client";

import { UploadDropzone, type UploadDropzoneProps } from "@/components/motion/upload-dropzone";

/**
 * Supply your own transport; this example never invents a network endpoint.
 * upload(file, { signal, offset, onProgress }) must:
 * - honour AbortSignal and resume the upload session at offset;
 * - report absolute uploadedBytes (including offset), not percentages;
 * - resolve ONLY when the server confirms the file is stored;
 * - reject on transport/server errors so Retry becomes available.
 * onRemove should delete the remote file/session and reject if deletion fails.
 * Browser/drop/paste selection shares MIME/extension, size and queue validation.
 * Object URLs for local image previews are revoked automatically.
 * value/defaultValue may contain existing host-owned items with genuine File data.
 * Demo fixtures belong in previews and must not imply a confirmed remote upload.
 */
export function UploadDropzoneUsage({ upload, onRemove, value, defaultValue, onValueChange }: Pick<UploadDropzoneProps, "upload" | "onRemove" | "value" | "defaultValue" | "onValueChange">) {
  return <UploadDropzone upload={upload} onRemove={onRemove} value={value} defaultValue={defaultValue} onValueChange={onValueChange} accept="image/*,.pdf,.csv" maxFileSize={10 * 1024 * 1024} maxFiles={6} />;
}

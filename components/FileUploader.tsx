"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import useUploadFile from "@/hooks/useUploadFile";
import { useRouter } from "next/navigation";

type Props = {};

export default function FileUploader({ }: Props) {
  const { progress, status, fileId, handleUpload } = useUploadFile();
  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      await handleUpload(file);
    } else {
      alert("Please select a file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc", ".docx"],
      },
    });

  return (
    <div
      {...getRootProps()}
      className={`overflow-hidden flex-1 w-full min-h-[50vh] bg-white rounded-lg border flex flex-col items-center justify-center text-center p-12 py-28 ${isFocused || isDragAccept ? "bg-[#7303c0]/30 border-[#7303c0]" : ""
        }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Drag here or Click to upload</span>
          </p>
          <p className="text-xs text-gray-500">PDF, DOC, DOCX</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {};

export default function FileUploader({}: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);

    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`overflow-hidden flex-1 w-full min-h-[50vh] bg-white shadow-xl rounded-lg shadow-gray-500/10 cursor-pointer border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-center p-12 py-28 ${
        isFocused || isDragAccept ? "bg-[#7303c0]/30 border-[#7303c0]" : ""
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

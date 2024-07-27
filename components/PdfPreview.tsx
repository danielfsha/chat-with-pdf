"use client";

import { useState, useEffect } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";

// WE NEED TO CONFIGURE CORS
// gsutils cors set cors.json gs://<app-name>.appspot.com
// gsutils cors set cors.json gs://pdf-chat-21690.appspot.com

// head over at console.cloud.google.com/
// create new file in the editor and name it cors.json
// run gsutil cors set cors gs://pdf-chat-21690.appspot.com

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfPreview({ url }: { url: string }) {
  const [file, setFile] = useState<Blob | null>(null);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const maxZoom = 1.4;
  const minZoom = 0.1;
  const zoomSteps = 0.1;

  useEffect(() => {
    const fetchFile = async () => {
      const res = await fetch(url);
      const blob = await res.blob();
      setFile(blob);
    };

    fetchFile();
  }, [url]);

  const onDocumentLoadSuccess = async ({ numPages }: { numPages: number }) => {
    setPages(numPages);
  };

  const performDocumentActions = (action: string) => {
    // starts at 1 not 0
    switch (action) {
      case "previous":
        if (currentPage === 1) return;
        setCurrentPage(currentPage - 1);
        break;
      case "next":
        if (currentPage === pages) return;
        setCurrentPage(currentPage + 1);
        break;
      case "rotate-right":
        setRotation((rotation + 90) % 360);
        break;
      case "rotate-left":
        setRotation((rotation - 90) % 360);
        break;
      case "zoom-in":
        if (scale >= maxZoom) return;
        setScale(scale + zoomSteps);
        break;
      case "zoom-out":
        if (scale <= minZoom) return;
        setScale(scale - zoomSteps);
        break;
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="relative bg-white flex items-center justify-between p-2">
        {/* rotation */}
        <div className="flex items-center justify-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => performDocumentActions("rotate-left")}
          >
            <ArrowCounterClockwise size={22} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => performDocumentActions("rotate-right")}
          >
            <ArrowClockwise size={22} />
          </Button>
        </div>
        {/* page navigation */}{" "}
        <div className="relative bg-white flex items-center justify-center z-10 p-2">
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => performDocumentActions("previous")}
            >
              Previous
            </Button>

            <p>
              Page {currentPage} of {pages}
            </p>

            <Button
              variant="outline"
              onClick={() => performDocumentActions("next")}
            >
              Next
            </Button>
          </div>
        </div>
        {/* zoom */}
        <div className="relative bg-white flex items-center justify-center">
          <div className="flex items-center justify-center space-x-1">
            <Button
              variant="outline"
              szie="icon"
              onClick={() => performDocumentActions("zoom-out")}
            >
              <MagnifyingGlassMinus size={22} />
            </Button>

            <p>{Math.trunc(scale * 100)}%</p>

            <Button
              variant="outline"
              szie="icon"
              onClick={() => performDocumentActions("zoom-in")}
            >
              <MagnifyingGlassPlus size={22} />
            </Button>
          </div>
        </div>
      </div>

      <Document
        loading={
          <div className="flex-1 items-center justify-center">Loading...</div>
        }
        file={file}
        rotate={rotation}
        onLoadSuccess={onDocumentLoadSuccess}
        className="m-4 overflow-scroll h-full mx-auto"
      >
        <Page pageNumber={currentPage} scale={scale} className="shadow-lg" />
      </Document>
    </div>
  );
}

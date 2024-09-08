"use client";

import { useState, useEffect } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  CircleNotch,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";

// WE NEED TO CONFIGURE CORS
// gsutils cors set cors.json gs://<app-name>.appspot.com
// gsutils cors set cors.json gs://pdf-chat-21690.appspot.com

// head over at console.cloud.google.com/
// create new file in the editor and name it cors.json
// run -> gsutil cors set cors.json gs://pdf-chat-21690.appspot.com

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export default function PdfPreview({ url }: { url: string }) {
  const [file, setFile] = useState<Blob | null>(null);
  const [pages, setPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const maxZoom = 1.4;
  const minZoom = 0.4;
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
    <div className="relative h-full flex-1 flex flex-col justify-between">

      {
        file ? (
          <>
            <Document
              loading={null}
              file={file}
              rotate={rotation}
              onLoadSuccess={onDocumentLoadSuccess}
              className="overflow-scroll mx-auto flex-1"
            >
              <Page pageNumber={currentPage} scale={scale} className="shadow-lg" />
            </Document>

            {/* zoom and rotation actions */}
            <div className="absolute top-4 right-4 flex flex-col items-center justify-center space-y-1">
              {/* <p>{Math.trunc(scale * 100)}%</p> */}

              <Button
                variant="outline"
                size="icon"
                onClick={() => performDocumentActions("zoom-in")}
              >
                <MagnifyingGlassPlus size={22} />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => performDocumentActions("zoom-out")}
              >
                <MagnifyingGlassMinus size={22} />
              </Button>

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


            <div className="z-10 absolute bottom-0 left-0 w-full flex items-center justify-center p-1">
              {/* page navigation */}
              <div className="bg-white border rounded-lg shadow-sm flex items-center justify-center space-x-4 p-2">
                <Button
                  variant="secondary"
                  onClick={() => performDocumentActions("previous")}
                >
                  Previous
                </Button>

                <p>
                  Page {currentPage} of {pages}
                </p>

                <Button
                  variant="secondary"
                  onClick={() => performDocumentActions("next")}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <CircleNotch className="w-4 h-4 animate-spin" />
          </div>
        )}
    </div>

  );
}

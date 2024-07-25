import FileUploader from "@/components/FileUploader";

type Props = {};

function NewDocumentUploadPage({}: Props) {
  return (
    <div className="wrapper flex-1 flex items-center justify-center">
      <FileUploader />
    </div>
  );
}

export default NewDocumentUploadPage;

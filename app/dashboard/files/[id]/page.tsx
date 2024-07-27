import PdfPreview from "@/components/PdfPreview";
import { adminDB } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: {
    id: string;
  };
};

async function FileChatPage({ params: { id } }: Props) {
  auth().protect();

  const { userId } = await auth();

  const ref = await adminDB
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .get();

  return (
    <div className="flex-1 flex justify-between items-center overflow-hidden">
      {/* left side */}
      <div className="relative w-[70%] overflow-hidden h-full">
        <PdfPreview url={ref.data()?.url} />
      </div>

      {/* right side */}
      <div className="relative flex-1 h-full">{userId}</div>
    </div>
  );
}

export default FileChatPage;

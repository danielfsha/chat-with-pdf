import { adminDB } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Chat from '@/components/Chat';
import PdfPreview from "@/components/PdfPreview";

type Props = {
  params: {
    id: string;
  };
};

async function FileChatPage({ params: { id } }: Props) {
  auth().protect();

  const { userId } = await auth();

  if (!userId) return <div>You need to be logged in to view this page</div>;

  const ref = await adminDB.collection("users").doc(userId).collection("files").doc(id).get();
  const url = ref.data()?.url;

  // console.log("URL of the file: ", url);

  return (
    <div className="h-full w-full flex-1 flex justify-between items-stretch overflow-hidden">
      {/* left side */}
      <div className="w-[70%] h-full overflow-hidden">
        <PdfPreview url={url} />
      </div>

      {/* right side */}
      <div className="flex-1 h-full overflow-hidden bg-white border-l ">
        <Chat id={id} />
      </div>
    </div>
  );
}

export default FileChatPage;

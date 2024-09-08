import PlaceholderDocument from "@/components/PlaceholderDocument";

import { adminDB } from "@/firebaseAdmin"; 
import { auth } from "@clerk/nextjs/server";

import Link from "next/link";

export default async function Dashboard() {
  auth().protect()

  const {userId} = await auth()

  if (!userId) {
    return <div>You are not logged in</div>
  }

  const documentSnapshot = await adminDB
    .collection('users')
    .doc(userId)
    .collection('files')
    .get()
  

  return (
    <main className="wrapper overflow-y-scroll">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className={`flex space-x-2 space-y-2`}>
        {/* placeholder / create new doucment */}
        <PlaceholderDocument />
        {/* <Document /> */}

        {
          documentSnapshot.docs.map((doc, index) => {
            const {name, downloadUrl, size} = doc.data()
            return (
              <Link
                href={`/dashboard/files/${doc?.id}`}
                key={index}
                className="flex flex-col h-[250px] w-[200px] items-center justify-center gap-2">
                <div
                    className="bg-white border w-full h-full rounded-xl flex flex-col items-center justify-center hover:bg-black hover:text-white space-y-3 transition-all"
                  >
                </div>
              <p className="text-center text-sm text-gray-500">{ name}</p>
              </Link>
            )
          })
        }
      </div>
    </main>
  );
}

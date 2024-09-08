import Header from "@/components/Header";
import { ClerkLoaded } from "@clerk/nextjs";

import { DeepgramContextProvider } from "@/context/DeepgramContextProvider";
import { MicrophoneContextProvider } from "@/context/MicrophoneContextProvider";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <ClerkLoaded>
      <MicrophoneContextProvider>
        <DeepgramContextProvider>
          <div className="flex-1 bg-gray-100 w-screen h-screen overflow-hidden flex flex-col">
            <Header />
            {children}
          </div>
        </DeepgramContextProvider>
      </MicrophoneContextProvider>
    </ClerkLoaded>
  );
};

export default layout;

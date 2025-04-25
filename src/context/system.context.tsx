import { createContext, useEffect, useState } from "react";
import firebase from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
interface SystemContextType {
  contentSpecial: string;
  isLoading: boolean;
}
const useSystemContext = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentSpecial, setContentSpecial] = useState<string>("");
  const init = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(firebase.db, "system", "contentSpecial");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContentSpecial(docSnap.data().contentSpecial);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return {
    contentSpecial: contentSpecial,
    isLoading: isLoading,
  };
};
export const SystemContext = createContext<SystemContextType>({
  contentSpecial: "",
  isLoading: true,
});

const SystemContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useSystemContext();
  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
};

export default SystemContextProvider;

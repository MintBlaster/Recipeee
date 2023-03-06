import Navbar from "@/componets/Navbar";
import { UserContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <>
      <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      </UserContext.Provider>
    </>
  );
}

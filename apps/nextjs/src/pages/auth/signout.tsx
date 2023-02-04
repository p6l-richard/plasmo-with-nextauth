import { useEffect } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import { env } from "~/env.mjs";

const Success: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const query = router.query;

    if (query.success === "true") {
      // alert extension
      chrome.runtime.sendMessage(
        env.NEXT_PUBLIC_EXTENSION_ID,
        { action: "signout" },
        (response) => {
          // eslint-disable-next-line
          if (response.success) {
            // log out the apps/web using NextAuth
            void router.push("/auth/success?action=signout");
          } else {
            console.log("Something went wrong in apps/plasmo/background.ts");
          }
        },
      );
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center p-10">
      <p className="pr-5">Are you sure you&apos;d like to sign out?</p>
      <button
        className=" bg-red-600 text-white p-4 rounded-xl hover:bg-red-400"
        disabled={status !== "authenticated"}
        onClick={() =>
          void signOut({ callbackUrl: "/auth/signout?success=true" })
        }
      >
        Sign Out
      </button>
    </div>
  );
};
export default Success;

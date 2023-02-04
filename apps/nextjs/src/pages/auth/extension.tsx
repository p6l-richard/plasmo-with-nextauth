import { useEffect, useState } from "react";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { Loader2 } from "lucide-react";
import { getToken } from "next-auth/jwt";

import { env } from "../../env.mjs";

const Extension: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ accessToken }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoadingExtension, setIsLoadingExtension] = useState(false);

  /**
   * This effect sends the accessToken to the extension,
   * awaits the response, and sets the state accordingly.
   */
  useEffect(() => {
    if (!accessToken) return;
    setIsLoadingExtension(true);

    chrome.runtime.sendMessage(
      env.NEXT_PUBLIC_EXTENSION_ID,
      // eslint-disable-next-line
      { action: "signin", accessToken },
      (res) => {
        setIsLoadingExtension(false);
        // eslint-disable-next-line
        if (res.success) {
          setIsSuccess(true);
          setTimeout(() => {
            close();
          }, 2000);
        } else {
          setIsError(true);
        }
      },
    );
  }, [accessToken]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <p>This page will close automatically</p>
        {isLoadingExtension ? (
          // We're still loading the response from the extension
          <div>
            <div className="h-12">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </div>
            <span className="text-gray-600">Verifying...</span>
          </div>
        ) : isSuccess ? (
          // The extension responded with success
          <div>
            <p className="text-xl font-semibold text-green-600">
              You are successfully logged in!
            </p>
            <p className="text-lg text-gray-600">
              You can open your extension now.
            </p>
          </div>
        ) : isError ? (
          // The extension responded with an error
          <div>
            <p className="text-xl font-semibold text-red-600">
              Something went wrong!
            </p>
            <p className="text-lg text-gray-600">Please try again.</p>
          </div>
        ) : (
          // User came here without an accessToken
          <div>
            <p className="text-2xl text-gray-600">
              Seems like you reached this page by mistake.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  /**
   * The JWT function works even though we're using the session strategy. Not entirely sure why that is.
   */
  const sessionToken = await getToken({ req, raw: true });

  return {
    props: {
      accessToken: sessionToken,
    },
  };
};

export default Extension;

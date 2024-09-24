import { RegistrationFlow, UpdateLoginFlowBody } from "@ory/client";
import { oryClient } from "apps/nextjs/clients/oryClient";
import { useOryAuthStore } from "apps/nextjs/stores/ory-auth.store";
import {
  OryFlowForm,
  OryFlowFormSubmitProps,
} from "apps/nextjs/components/ory/OryFlowForm";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRedirectIfAuthenticated } from "apps/nextjs/hooks/auth";
import Link from "next/link";

export default function RegistrationPage() {
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined);
  const router = useRouter();

  const { checkIsAuthenticated, resetAuthStatus } = useOryAuthStore();

  useRedirectIfAuthenticated();

  useEffect(() => {
    oryClient
      .createBrowserLoginFlow()
      .then(({ data }) => {
        console.log(data);
        setFlow(data);
      })
      .catch((error) => {
        console.log(error, error.response?.data?.error?.id);
        if (
          error instanceof AxiosError &&
          error.response?.data?.error?.id === "session_already_available"
        ) {
          resetAuthStatus();
        }
      });
  }, [oryClient]);

  const submitLoginFlow = async ({
    flowId,
    body,
  }: OryFlowFormSubmitProps<UpdateLoginFlowBody>) => {
    console.log(body);
    try {
      await oryClient.updateLoginFlow({
        flow: flowId,
        updateLoginFlowBody: body,
      });

      await resetAuthStatus();
    } catch (error) {
      if (error instanceof AxiosError) {
        const pendingFlow = error.response?.data;
        console.log(pendingFlow.redirect_browser_to);
        if (pendingFlow.redirect_browser_to) {
          router.push(pendingFlow.redirect_browser_to);
          return;
        }
        setFlow(error.response?.data);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <OryFlowForm<UpdateLoginFlowBody>
        flow={flow}
        onSubmit={submitLoginFlow}
        footer={
          <div>
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-bold underline">
              Sign up!
            </Link>
          </div>
        }
      />
    </div>
  );
}

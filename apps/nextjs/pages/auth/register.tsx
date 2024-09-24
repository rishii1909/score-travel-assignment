import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client";
import { oryClient } from "apps/nextjs/clients/oryClient";
import { useOryAuthStore } from "apps/nextjs/stores/ory-auth.store";
import {
  OryFlowForm,
  OryFlowFormSubmitProps,
} from "apps/nextjs/components/ory/OryFlowForm";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRedirectIfAuthenticated } from "apps/nextjs/hooks/auth";
import Link from "next/link";

export default function RegistrationPage() {
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined);
  const router = useRouter();

  const { resetAuthStatus } = useOryAuthStore();

  useRedirectIfAuthenticated();

  useEffect(() => {
    oryClient
      .createBrowserRegistrationFlow()
      .then(({ data }) => {
        console.log(data);
        setFlow(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const submitRegistrationFlow = async ({
    flowId,
    body,
  }: OryFlowFormSubmitProps<UpdateRegistrationFlowBody>) => {
    console.log(body);
    setFlow(undefined);
    try {
      await oryClient.updateRegistrationFlow({
        flow: flowId,
        updateRegistrationFlowBody: body,
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
      <OryFlowForm<UpdateRegistrationFlowBody>
        flow={flow}
        onSubmit={submitRegistrationFlow}
        footer={
          <div>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold underline">
              Sign in!
            </Link>
          </div>
        }
      />
    </div>
  );
}

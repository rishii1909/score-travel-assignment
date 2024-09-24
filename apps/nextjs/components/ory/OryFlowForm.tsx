import { Button, Divider, Input, Spinner } from "@chakra-ui/react";
import { SelfServiceFlow } from "@ory/elements";
import { ReactNode, useRef, useState } from "react";
import { OryFlowOTPInput } from "./OryFlowOTPInput";
import { Loader } from "../Loader";
import { apiClient } from "apps/nextjs/clients/apiClient";
import { OryFlowButton } from "./OryFlowButton";
import { capitalize } from "lodash";

interface FormData {
  [key: string]: string | FormData;
}

export interface OryFlowFormSubmitProps<T> {
  flowId: string;
  body: T;
}

interface CreateFormProps<T> {
  flow?: SelfServiceFlow;
  onSubmit: (props: OryFlowFormSubmitProps<T>) => Promise<void>; // Accepts generic form data
  footer: ReactNode;
}

export const OryFlowForm = <T extends Record<string, any>>({
  flow,
  onSubmit,
  footer,
}: CreateFormProps<T>) => {
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  if (!flow) return <Loader />;

  const handleSubmit = async (name: string, value: string) => {
    if (!formWrapperRef.current) return;

    try {
      setLoading(true);

      const fields = formWrapperRef.current.querySelectorAll("input[name]");
      const formData: FormData = {
        [name]: value,
      };

      fields.forEach((field) => {
        if (field instanceof HTMLInputElement) {
          const name = field.name;
          const value = field.value;

          if (name) {
            const keys = name.split(".");
            let current: any = formData;

            keys.forEach((key, index) => {
              if (index === keys.length - 1) {
                current[key] = value;
              } else {
                if (!current[key]) {
                  current[key] = {};
                }
                current = current[key];
              }
            });
          }
        }
      });

      if (!!formData.provider) {
        formData.method = "oidc";
      }

      await onSubmit({ flowId: flow.id, body: formData as T });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col space-y-4 shrink-0 grow !relative"
      style={{ position: "relative" }}
      ref={formWrapperRef}
    >
      {loading && <Loader overlay />}
      {flow?.ui?.nodes.map((node, index) => {
        const nodeAttributes = node.attributes as any;

        if (nodeAttributes.type === "submit") {
          return (
            <OryFlowButton
              key={index}
              name={nodeAttributes.name}
              value={nodeAttributes.value}
              handleSubmit={handleSubmit}
              text={node.meta.label?.text || ""}
            />
          );
        } else if (nodeAttributes.name === "code") {
          return <OryFlowOTPInput />;
        }
        {
          const isHidden = nodeAttributes.type === "hidden";
          return (
            <Input
              key={index}
              name={nodeAttributes.name}
              required={nodeAttributes.required}
              placeholder={node.meta.label?.text}
              {...(isHidden && {
                readOnly: true,
                hidden: true,
                value: nodeAttributes.value,
              })}
            />
          );
        }
      })}

      {!!flow.ui.messages?.length && (
        <>
          <Divider />
          {flow.ui.messages?.map((message) => (
            <div
              className="border-zinc-700 border border-solid px-2 py-1 max-w-14 rounded-lg"
              style={{
                maxWidth: "240px",
                margin: "0.4em auto",
                padding: "0.4em",
                borderRadius: "6px",
              }}
            >
              {capitalize(message.type)}: {message.text}
            </div>
          ))}
          <Divider style={{ marginTop: "0px" }} />
        </>
      )}
      <div className="mt-2">{footer}</div>
    </div>
  );
};

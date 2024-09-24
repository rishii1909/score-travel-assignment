import { Button, Input, Spinner } from "@chakra-ui/react";
import { SelfServiceFlow } from "@ory/elements";
import { useRef } from "react";
import { OryFlowOTPInput } from "./OryFlowOTPInput";
import { Loader } from "../Loader";
import { apiClient } from "apps/nextjs/clients/apiClient";

interface OryFlowButtonProps {
  key: number;
  handleSubmit: (name: string, value: string) => void;
  name: string;
  value: string;
  text: string;
}

export const OryFlowButton = ({
  key,
  handleSubmit,
  name,
  value,
  text,
}: OryFlowButtonProps) => {
  return (
    <Button
      key={key}
      onClick={(e) => {
        e.preventDefault();
        handleSubmit(name, value);
      }}
    >
      {text}
    </Button>
  );
};

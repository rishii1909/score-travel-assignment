import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import React, { useState } from "react";

export const OryFlowOTPInput = () => {
  const [pin, setPin] = useState<string>();
  return (
    <div>
      <input name="code" hidden value={pin} type="text" />
      <HStack>
        <PinInput value={pin} onChange={setPin} otp>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
    </div>
  );
};

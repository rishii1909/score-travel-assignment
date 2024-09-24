import { Spinner } from "@chakra-ui/react";
import clsx from "clsx";
import React from "react";

// export const Loader = () => {
//   return (
//     <div className="flex flex-col space-y-6 items-center">
//       <Spinner size="lg" />
//       <div>Loading...</div>
//     </div>
//   );
// };

// import { Spinner } from "@chakra-ui/react";
// import React from "react";

interface LoaderProps {
  overlay?: boolean;
}
export const Loader = ({ overlay }: LoaderProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center z-50 space-y-6 h-full w-full"
      {...(overlay && {
        style: {
          position: "absolute",
          top: 0,
          bottom: 0,
          background: "rgb(26, 32, 44, 75%)",
          zIndex: 10000,
          backdropFilter: "",
        },
      })}
    >
      <Spinner size="lg" margin={2} />
      <div>Loading...</div>
    </div>
  );
};

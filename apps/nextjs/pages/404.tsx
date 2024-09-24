// pages/404.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";

const Custom404 = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 2 seconds
    const timeout = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timeout); // Clear timeout on component unmount
  }, [router]);

  return (
    <div className="flex border border-solid border-zinc-400 flex-col space-y-6 p-4 rounded-sm text-center">
      <h1 className="font-bold">404 - Page Not Found</h1>
      <p>Redirecting to home page...</p>
    </div>
  );
};

export default Custom404;

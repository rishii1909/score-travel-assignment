import { useOryAuthStore } from "../stores/ory-auth.store";
import { oryClient } from "../clients/oryClient";
import { Button, Divider, position } from "@chakra-ui/react";
import { apiClient } from "../clients/apiClient";
import { useRedirectIfUnauthenticated } from "../hooks/auth";
import { UsersList } from "../components/users/UsersList";
import { Loader } from "../components/Loader";
import { capitalize } from "lodash";

const Home: React.FC = () => {
  const { isAuthenticated, logout, roles, userData, hasMetadata } =
    useOryAuthStore();

  useRedirectIfUnauthenticated();

  const onLogout = async () => {
    const createLogoutFlowresponse = await oryClient.createBrowserLogoutFlow();

    await oryClient.updateLogoutFlow({
      token: createLogoutFlowresponse.data.logout_token,
    });

    logout();
  };

  const testAPI = async () => {
    const response = await apiClient.put("/users/login");

    console.log(response);
  };

  if (!isAuthenticated) return <Loader />;

  return (
    <div
      className="flex flex-col space-y-8 items-center"
      style={{ position: "relative" }}
    >
      <Button width={"fit-content"} onClick={onLogout}>
        Logout
      </Button>
      <div className="border border-solid border-zinc-500 p-4 rounded-md w-96 flex flex-col space-y-4">
        {hasMetadata() ? (
          <>
            <div>
              <h3 className="font-bold mb-2">User Data</h3>
              <ul>
                {Object.keys(userData!).map((key, i, arr) => (
                  <>
                    <li className="py-2 border-b-violet-300 border-opacity-10 border border-x-0 last:border-none border-t-0 border-solid">
                      {capitalize(key)} :{" "}
                      <span className="opacity-50">
                        {" "}
                        {Array.isArray(userData![key])
                          ? userData![key].join(", ")
                          : JSON.stringify(userData![key])}
                      </span>
                    </li>
                  </>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>

      <Divider />

      <UsersList />
    </div>
  );
};

export default Home;

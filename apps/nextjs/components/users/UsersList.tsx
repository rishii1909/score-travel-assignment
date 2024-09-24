import { apiClient } from "apps/nextjs/clients/apiClient";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { Loader } from "../Loader";
import { useOryAuthStore } from "apps/nextjs/stores/ory-auth.store";

interface User {
  email: string;
  oryIdentityId: string;
  roles: string[];
}

export const UsersList = () => {
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const { authSession } = useOryAuthStore();

  useEffect(() => {
    fetchUsers();
  }, [apiClient]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/users/list");
      setUsers(response.data as User[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminRole = async (identityId: string, makeAdmin: boolean) => {
    try {
      setLoading(true);
      await apiClient.put(`/roles/admin/${makeAdmin ? "add" : "remove"}`, {
        identityId,
      });

      await Promise.all([fetchUsers()]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!users) return <Loader />;

  return (
    <TableContainer style={{ position: "relative" }}>
      {loading && <Loader overlay />}
      <Table variant="simple">
        <TableCaption>Manage Admin RBAC</TableCaption>
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Roles</Th>
            <Th>Modify Access</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users?.map(({ email, roles, oryIdentityId }) => (
            <Tr>
              <Td>{email}</Td>
              <Td>{roles.map(capitalize).join(", ")}</Td>
              <Td>
                <Button
                  width={172}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toggleAdminRole(oryIdentityId, !roles.includes("Admin"))
                  }
                  {...(authSession?.identity?.id === oryIdentityId && {
                    disabled: true,
                  })}
                >
                  {roles.includes("Admin") ? "Revoke" : "Grant"} Admin access
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>

    // <div className="border border-solid border-zinc-400 p-4 rounded-md w-96 flex flex-col space-y-4">
    //   {users?.map((user) => (
    //     <div className="flex flex-row justify-between">
    //       <div>{user.email}</div>
    //       <Button></Button>
    //     </div>
    //   ))}
    // </div>
  );
};

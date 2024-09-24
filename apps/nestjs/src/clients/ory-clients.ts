import { RelationshipApi, PermissionApi } from "@ory/client";
import { oryConfig } from "../config/ory-config";
import axios from "axios";

const oryAxiosClient = axios.create({
  baseURL: process.env.ORY_BASE_URL,
  withCredentials: true,
});

oryAxiosClient.defaults.headers.common[
  "Authorization"
] = `Bearer ${process.env.ORY_API_KEY}`;

oryAxiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const OryRelationShipsClient = new RelationshipApi(
  oryConfig,
  undefined,
  oryAxiosClient
);

export const OryPermissionsClient = new PermissionApi(
  oryConfig,
  undefined,
  oryAxiosClient
);

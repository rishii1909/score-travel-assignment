import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Configuration, FrontendApi } from "@ory/client";
import { oryConfig } from "../../config/ory-config";
import { OryRequest } from "../../common/ory";

const ory = new FrontendApi(oryConfig);

@Injectable()
export class OryGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: OryRequest = context.switchToHttp().getRequest<OryRequest>();
    const sessionResponse = await validateSession(request);

    if (!sessionResponse) {
      throw new UnauthorizedException("Invalid or expired session");
    }
    const { data: session } = sessionResponse;

    // Attach session to the request object so other guards can use it
    request["orySession"] = session;

    return true;
  }
}

const validateSession = async (request: OryRequest) => {
  const cookie = request.headers["cookie"];

  if (!cookie) {
    throw new UnauthorizedException("No session cookie found");
  }

  try {
    const session = await ory.toSession({ cookie });
    return session;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

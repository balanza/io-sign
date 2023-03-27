import { flow, pipe } from "fp-ts/lib/function";

import * as azure from "@pagopa/handler-kit/lib/azure";

import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

import { createHandler } from "@pagopa/handler-kit";

import { error, success } from "@io-sign/io-sign/infra/http/response";

import {
  HttpBadRequestError,
  HttpError,
} from "@io-sign/io-sign/infra/http/errors";
import { header, HttpRequest } from "@pagopa/handler-kit/lib/http";
import { validate } from "@io-sign/io-sign/validation";

import { IssuerEnvironment } from "@io-sign/io-sign/issuer";
import { QtspClausesMetadataToApiModel } from "../../http/encoders/qtsp-clauses-metadata";
import { QtspClausesMetadataDetailView } from "../../http/models/QtspClausesMetadataDetailView";
import { makeGetClausesWithToken, makeGetToken } from "../../namirial/client";
import {
  getNamirialCredentialsFromIssuerEnvironment,
  NamirialConfig,
} from "../../namirial/config";
import { NamirialClausesToQtspClauses } from "../../http/encoders/namirial-clauses-metadata";

const getQtspClausesWithToken = makeGetClausesWithToken()(makeGetToken());

const encodeHttpSuccessResponse = flow(
  QtspClausesMetadataToApiModel.encode,
  success(QtspClausesMetadataDetailView)
);

const requireIssuerEnvironment = (req: HttpRequest) =>
  pipe(
    req,
    header("x-iosign-issuer-environment"),
    E.fromOption(
      () =>
        new HttpBadRequestError("Missing x-iosign-issuer-environment in header")
    ),
    E.chainW(validate(IssuerEnvironment, "Invalid signature request id"))
  );

const getQtspClausesMetadataFunction = (config: NamirialConfig) => {
  const decodeHttpRequest = flow(
    azure.fromHttpRequest,
    E.chainW(requireIssuerEnvironment),
    TE.fromEither
  );

  return createHandler(
    decodeHttpRequest,
    (issuerEnvironment) =>
      pipe(
        config,
        getNamirialCredentialsFromIssuerEnvironment(issuerEnvironment),
        getQtspClausesWithToken,
        TE.map(NamirialClausesToQtspClauses.encode),
        TE.mapLeft((e) => new HttpError(e.message))
      ),
    error,
    encodeHttpSuccessResponse
  );
};

export const makeGetQtspClausesMetadataFunction = flow(
  getQtspClausesMetadataFunction,
  azure.unsafeRun
);

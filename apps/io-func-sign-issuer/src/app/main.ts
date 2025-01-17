import { CosmosClient } from "@azure/cosmos";
import { ContainerClient } from "@azure/storage-blob";
import { QueueClient } from "@azure/storage-queue";
import {
  EventHubConsumerClient,
  EventHubProducerClient,
} from "@azure/event-hubs";

import { createIOApiClient } from "@io-sign/io-sign/infra/io-services/client";
import { createPdvTokenizerClient } from "@io-sign/io-sign/infra/pdv-tokenizer/client";

import * as E from "fp-ts/lib/Either";
import { pipe, identity } from "fp-ts/lib/function";

import { makeCreateDossierFunction } from "../infra/azure/functions/create-dossier";
import { makeCreateSignatureRequestFunction } from "../infra/azure/functions/create-signature-request";
import { makeGetDossierFunction } from "../infra/azure/functions/get-dossier";
import { makeGetSignatureRequestFunction } from "../infra/azure/functions/get-signature-request";
import { makeGetSignerFunction } from "../infra/azure/functions/get-signer";
import { makeGetUploadUrlFunction } from "../infra/azure/functions/get-upload-url";
import { makeInfoFunction } from "../infra/azure/functions/info";
import { makeSendNotificationFunction } from "../infra/azure/functions/send-notification";
import { makeSetSignatureRequestStatusFunction } from "../infra/azure/functions/set-signature-request-status";
import { makeValidateUploadFunction } from "../infra/azure/functions/validate-upload";
import { makeRequestAsWaitForSignatureFunction } from "../infra/azure/functions/mark-as-wait-for-signature";
import { makeRequestAsRejectedFunction } from "../infra/azure/functions/mark-as-rejected";
import { makeRequestAsSignedFunction } from "../infra/azure/functions/mark-as-signed";

import { makeCreateIssuerFunction } from "../infra/azure/functions/create-issuer";
export { run as CreateIssuerByVatNumberView } from "../infra/azure/functions/create-issuers-by-vat-number-view";

import { getConfigFromEnvironment } from "./config";

const configOrError = pipe(
  getConfigFromEnvironment(process.env),
  E.getOrElseW(identity)
);

if (configOrError instanceof Error) {
  throw configOrError;
}

const config = configOrError;

const cosmosClient = new CosmosClient(config.azure.cosmos.connectionString);
const database = cosmosClient.database(config.azure.cosmos.dbName);

const eventHubBillingClient = new EventHubProducerClient(
  config.azure.eventHubs.billingConnectionString,
  "billing"
);

const eventHubAnalyticsClient = new EventHubProducerClient(
  config.azure.eventHubs.analyticsConnectionString,
  "analytics"
);

const eventHubSelfCareContractsConsumer = new EventHubConsumerClient(
  EventHubConsumerClient.defaultConsumerGroupName,
  config.pagopa.selfCare.eventHub.connectionString,
  config.pagopa.selfCare.eventHub.contractsName
);

const pdvTokenizerClientWithApiKey = createPdvTokenizerClient(
  config.pagopa.tokenizer.basePath,
  config.pagopa.tokenizer.apiKey
);

const ioApiClient = createIOApiClient(
  config.pagopa.ioServices.basePath,
  config.pagopa.ioServices.subscriptionKey
);

const uploadedContainerClient = new ContainerClient(
  config.azure.storage.connectionString,
  "uploaded-documents"
);

const validatedContainerClient = new ContainerClient(
  config.azure.storage.connectionString,
  "validated-documents"
);

const signedContainerClient = new ContainerClient(
  config.azure.storage.connectionString,
  "signed-documents"
);

const onSignatureRequestReadyQueueClient = new QueueClient(
  config.azure.storage.connectionString,
  "on-signature-request-ready"
);

export const Info = makeInfoFunction(
  pdvTokenizerClientWithApiKey,
  ioApiClient,
  database,
  eventHubBillingClient,
  eventHubAnalyticsClient,
  eventHubSelfCareContractsConsumer,
  uploadedContainerClient,
  validatedContainerClient,
  onSignatureRequestReadyQueueClient
);

export const CreateDossier = makeCreateDossierFunction(database);
export const GetDossier = makeGetDossierFunction(database);

export const CreateSignatureRequest = makeCreateSignatureRequestFunction(
  database,
  eventHubAnalyticsClient
);
export const GetSignatureRequest = makeGetSignatureRequestFunction(
  database,
  signedContainerClient
);
export const SetSignatureRequestStatus = makeSetSignatureRequestStatusFunction(
  database,
  onSignatureRequestReadyQueueClient
);
export const MarkAsWaitForSignature =
  makeRequestAsWaitForSignatureFunction(database);

export const MarkAsRejected = makeRequestAsRejectedFunction(
  database,
  pdvTokenizerClientWithApiKey,
  ioApiClient
);

export const MarkAsSigned = makeRequestAsSignedFunction(
  database,
  pdvTokenizerClientWithApiKey,
  ioApiClient,
  eventHubBillingClient
);

export const GetSignerByFiscalCode = makeGetSignerFunction(
  pdvTokenizerClientWithApiKey,
  ioApiClient
);

export const GetUploadUrl = makeGetUploadUrlFunction(
  database,
  uploadedContainerClient
);

export const SendNotification = makeSendNotificationFunction(
  database,
  pdvTokenizerClientWithApiKey,
  ioApiClient
);

export const ValidateUpload = makeValidateUploadFunction(
  database,
  uploadedContainerClient,
  validatedContainerClient
);

export const CreateIssuer = makeCreateIssuerFunction(
  database,
  config.pagopa.selfCare,
  config.slack
);

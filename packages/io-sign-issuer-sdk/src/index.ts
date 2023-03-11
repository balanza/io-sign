import * as inquirer from "inquirer";
import { Configuration } from "@io-sign/io-sign-api-client";
import * as fetch from "isomorphic-fetch";
import { callSigners } from "./signer";
import { callDossiers } from "./dossier";
import { callSignatureRequests } from "./signature-request";

console.log(
  "Benvenuto nella CLI utilizzata dagli enti per integrarsi con Firma con IO"
);

const mainMenu = async (SubscriptionKey = process.env.SUBSCRIPTION_KEY) => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "command",
      message: "Quale endpoint vuoi eseguire?",
      choices: ["signers", "dossiers", "signature-requests", "nessuno"],
    },
  ]);

  const configuration = new Configuration({
    apiKey: SubscriptionKey,
    fetchApi: fetch,
  });

  switch (answers.command) {
    case "signers":
      await callSigners(configuration);
      await mainMenu();
      break;
    case "dossiers":
      await callDossiers(configuration);
      await mainMenu();
      break;
    case "signature-requests":
      await callSignatureRequests(configuration);
      await mainMenu();
      break;
    default:
      process.exit(0);
  }
};

mainMenu().catch(console.error);

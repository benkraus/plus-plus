/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    PlusPlusBot: {
      type: "sst.cloudflare.Worker"
      url: string
    }
    SlackClientSecret: {
      type: "sst.sst.Secret"
      value: string
    }
    SlackSigningSecret: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
// cloudflare 
declare module "sst" {
  export interface Resource {
    PlusPlus: import("@cloudflare/workers-types").D1Database
    PlusPlusInstallations: import("@cloudflare/workers-types").KVNamespace
    PlusPlusOAuthStates: import("@cloudflare/workers-types").KVNamespace
  }
}

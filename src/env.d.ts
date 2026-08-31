/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MAILCHIMP_API_KEY: string;
  readonly MAILCHIMP_LIST_ID: string;
  readonly MAILCHIMP_SERVER: string;
  readonly GOOGLE_ABSTRACT_SCRIPT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
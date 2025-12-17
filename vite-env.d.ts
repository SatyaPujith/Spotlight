/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly YELP_AI_API_KEY: string
  readonly YELP_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

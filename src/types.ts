export interface JwtPayload {
    email: string;
    provider?: string;
    provider_id?: string;
    isNew: boolean;
  }
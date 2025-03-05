import Keycloak from "keycloak-js";

class KeycloakInstance {
  private static instance: Keycloak | null = null;

  public static getInstance(): Keycloak | null {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!this.instance) {
      const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL || '';
      const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || '';
      const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || '';

      
      this.instance = new Keycloak({
        url,
        realm,
        clientId,
      });
    }

    return this.instance;
  }
}

export default KeycloakInstance.getInstance();
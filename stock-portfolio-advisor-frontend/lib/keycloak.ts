import Keycloak from "keycloak-js";

class KeycloakInstance {
  private static instance: Keycloak | null = null;

  public static getInstance(): Keycloak | null {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!this.instance) {
      this.instance = new Keycloak({
        url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
        realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
        clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
      });
    }

    return this.instance;
  }
}

export default KeycloakInstance.getInstance();
import * as ExpoSecureStore from "expo-secure-store";

// ─── SecureStore Wrapper ──────────────────────────────────────────────────────
//
// Typed wrapper around expo-secure-store for storing sensitive values:
//   - Encryption keys for vault content
//   - Biometric challenge tokens
//   - Any device-local secrets that must NOT go in AsyncStorage
//
// Values are encrypted at rest using the device's Secure Enclave (iOS)
// or Android Keystore.

export const SecureStore = {
  /**
   * Store a string value securely.
   */
  async set(key: string, value: string): Promise<void> {
    await ExpoSecureStore.setItemAsync(key, value, {
      keychainAccessible: ExpoSecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },

  /**
   * Retrieve a string value. Returns null if not found.
   */
  async get(key: string): Promise<string | null> {
    return await ExpoSecureStore.getItemAsync(key);
  },

  /**
   * Delete a stored value.
   */
  async delete(key: string): Promise<void> {
    await ExpoSecureStore.deleteItemAsync(key);
  },

  /**
   * Check whether a key exists in secure storage.
   */
  async has(key: string): Promise<boolean> {
    const value = await ExpoSecureStore.getItemAsync(key);
    return value !== null;
  },
} as const;

// ─── Typed Key Constants ──────────────────────────────────────────────────────
// Centralise key names to avoid typos and collisions.

export const SecureKeys = {
  VAULT_ENCRYPTION_KEY: "flow.vault.encryptionKey",
  BIOMETRIC_CHALLENGE_TOKEN: "flow.biometric.challengeToken",
  DEVICE_ID: "flow.device.id",
} as const;

export type SecureKey = (typeof SecureKeys)[keyof typeof SecureKeys];

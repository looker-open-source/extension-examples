import { ExtensionSDK, FetchProxy, FetchCustomParameters } from "@looker/extension-sdk";

/**
 * With the advent of enforcement of the SameSite attribute for cookies, an authorization
 * header is being used instead of cookies.
 * @param extensionSDK
 * @param locationState
 */
export const getDataServerFetchProxy = (extensionSDK: ExtensionSDK, locationState?: any): FetchProxy => {
  const init: FetchCustomParameters = {}
  if (locationState && locationState.jwtToken) {
    init.headers = {
      "Authorization" : `Bearer ${locationState.jwtToken}`
    }
  }
  return extensionSDK.createFetchProxy(undefined, init)
}
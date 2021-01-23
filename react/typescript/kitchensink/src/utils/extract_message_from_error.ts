export const extractMessageFromError = (error: any): string => {
  if (typeof error === 'string') {
    return error
  }
  if (error.message) {
    return error.message
  }
  return `${error}`
}
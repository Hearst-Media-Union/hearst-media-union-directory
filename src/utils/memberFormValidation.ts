export function isValidEmail(value: string) {
  const trimmedValue = value.trim()

  if (trimmedValue.length === 0) {
    return true
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)
}

export function isValidWorkEmailLocalPart(value: string) {
  const trimmedValue = value.trim()

  return trimmedValue.length > 0 && /^[a-z0-9._-]+$/.test(trimmedValue)
}

export function getPhoneDigits(value: string) {
  return value.replace(/\D/g, '').replace(/^1/, '')
}

export function hasInvalidPhoneCharacters(value: string) {
  return /[^0-9()+\-\s.]/.test(value)
}

export function isValidOptionalPhone(value: string) {
  const trimmedValue = value.trim()

  if (trimmedValue.length === 0) {
    return true
  }

  return !hasInvalidPhoneCharacters(value) && getPhoneDigits(value).length === 10
}

export function formatPhoneNumber(value: string) {
  const digits = getPhoneDigits(value)
  const visibleDigits = digits.slice(0, 10)

  if (visibleDigits.length <= 3) {
    return visibleDigits
  }

  if (visibleDigits.length <= 6) {
    return `${visibleDigits.slice(0, 3)}-${visibleDigits.slice(3)}`
  }

  return `1-${visibleDigits.slice(0, 3)}-${visibleDigits.slice(3, 6)}-${visibleDigits.slice(6)}`
}

export function getSuggestedWorkEmailLocalPart(firstName: string, lastName: string) {
  const normalizedFirstName = firstName.trim().toLowerCase()
  const normalizedLastName = lastName.trim().toLowerCase()

  if (normalizedFirstName.length === 0 || normalizedLastName.length === 0) {
    return ''
  }

  return `${normalizedFirstName.charAt(0)}${normalizedLastName}`.replace(/[^a-z0-9._-]/g, '')
}

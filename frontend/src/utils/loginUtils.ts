export function checkIsValidFormatEmail(inputValue: string) {
  const REGEX_EMAIL = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return !!inputValue.match(REGEX_EMAIL);
}

export function checkIsValidFormatPassword(inputValue: string) {
  const REGEX_PW = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()\-=_+[\]\\;',./{}|:"<>?`~]).{8,}$/;
  return !!inputValue.match(REGEX_PW);
}

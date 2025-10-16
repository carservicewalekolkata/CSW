import { useEffect, useState } from 'react';

import { SESSION_PHONE_STORAGE_KEY, SESSION_TOKEN_STORAGE_KEY } from '@/constants/homepageHeroSectionData';

const readItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to read ${key} from storage`, error);
    return null;
  }
};

const writeItem = (key: string, value: string | null) => {
  try {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Failed to persist ${key} in storage`, error);
  }
};

export const useHeroSession = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionPhone, setSessionPhone] = useState<string | null>(null);

  useEffect(() => {
    setSessionToken(readItem(SESSION_TOKEN_STORAGE_KEY));
    setSessionPhone(readItem(SESSION_PHONE_STORAGE_KEY));
  }, []);

  useEffect(() => {
    writeItem(SESSION_TOKEN_STORAGE_KEY, sessionToken);
  }, [sessionToken]);

  useEffect(() => {
    writeItem(SESSION_PHONE_STORAGE_KEY, sessionPhone);
  }, [sessionPhone]);

  return {
    sessionToken,
    setSessionToken,
    sessionPhone,
    setSessionPhone,
    hasActiveSession: Boolean(sessionToken)
  };
};

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_ACCOUNT_TYPE, getAccountType, type AccountType } from "@/lib/account";

const AccountContext = createContext<AccountType>(DEFAULT_ACCOUNT_TYPE);

/**
 * Resolve o tipo de conta do profissional logado no cliente (localStorage), evitando
 * mismatch de hidratação: renderiza o default no servidor e no 1º render, e só depois
 * do mount lê o valor persistido.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>(DEFAULT_ACCOUNT_TYPE);

  useEffect(() => {
    setAccountType(getAccountType());
  }, []);

  return <AccountContext.Provider value={accountType}>{children}</AccountContext.Provider>;
}

export function useAccountType(): AccountType {
  return useContext(AccountContext);
}

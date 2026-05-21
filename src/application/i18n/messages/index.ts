/* eslint-disable @typescript-eslint/no-explicit-any */
import { typedEntries } from "@/application/utils/object";
import messages from "./messages";

type Restructure<T extends Record<string, Record<string, unknown>>> = {
  [L in keyof T[keyof T]]: {
    [S in keyof T]: T[S][L];
  };
};

function restructureMessages<T extends Record<string, any>>(
  messages: T
): Restructure<T> {
  return typedEntries(messages).reduce((prev, [key, value]) => {
    for (const [lang, content] of typedEntries(value)) {
      if (!prev[lang]) prev[lang] = {};

      prev[lang][key] = content;
    }

    return prev;
  }, {} as any);
}

export const i18nMessages = restructureMessages(messages);

export type MessageSchema = typeof i18nMessages[keyof typeof i18nMessages];

export type Locale = keyof typeof i18nMessages;

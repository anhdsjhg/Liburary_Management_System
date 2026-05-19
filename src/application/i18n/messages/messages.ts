import { homeI18n } from "@/modules/home/i18n";
import { commonMessages } from "./common";
import { acquisitionsI18n } from "@/modules/acquisitions/i18n";
import { settingsI18n } from "@/modules/settings/i18n";
import { reportsI18n } from "@/modules/reports/i18n";
import { websiteI18n } from "@/modules/website/i18n";
import { serviceDeskI18n } from "@/modules/service-desk/i18n";
import { catalogingI18n } from "@/modules/cataloging/i18n";
import { authI18n } from "@/modules/auth/i18n";
import { defaultLayoutMessages } from "@/application/layouts/admin/i18n";

const messages = {
  ...commonMessages,
  ...homeI18n,
  ...defaultLayoutMessages,
  ...acquisitionsI18n,
  ...serviceDeskI18n,
  ...settingsI18n,
  ...reportsI18n,
  ...websiteI18n,
  ...catalogingI18n,
  ...authI18n,
} as const;

export default messages;

import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAttendanceApi } from "@/api/reports/attendance/get";

export function useAttendancePage() {
  const { t } = useI18n();

  const { data, isLoading } = useAttendanceApi();

  const weekDays = computed(() => [
    t("reports.days.monday"),
    t("reports.days.tuesday"),
    t("reports.days.wednesday"),
    t("reports.days.thursday"),
    t("reports.days.friday"),
    t("reports.days.saturday"),
    t("reports.days.sunday"),
  ]);

  const monthNames = computed(() => [
    t("reports.months.january"),
    t("reports.months.february"),
    t("reports.months.march"),
    t("reports.months.april"),
    t("reports.months.may"),
    t("reports.months.june"),
    t("reports.months.july"),
    t("reports.months.august"),
    t("reports.months.september"),
    t("reports.months.october"),
    t("reports.months.november"),
    t("reports.months.december"),
  ]);

  const byWeek = computed(() => data.value?.res?.byWeek ?? null);
  const byMonth = computed(() => data.value?.res?.byMonth ?? null);

  return { weekDays, monthNames, byWeek, byMonth, isLoading };
}
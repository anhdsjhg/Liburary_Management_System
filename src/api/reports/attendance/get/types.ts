export type AttendanceWeekData = {
  students: number[];
  employees: number[];
  total: {
    employees: number;
    students: number;
  };
};

export type AttendanceResponse = {
  res: {
    byWeek: AttendanceWeekData;
    byMonth: AttendanceWeekData;
  };
};
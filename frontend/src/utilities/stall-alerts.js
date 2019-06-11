export const isStalled = status_history => {
  let missedDueDates = 0;
  let missed = false;
  let dateA = null;
  let dateB = null;
  if (!status_history.length) return false;
  status_history = status_history.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  for (let i = 1; i < status_history.length; i++) {
    dateA = new Date(status_history[i - 1].new_due_date);
    dateB = new Date(status_history[i].date);
    missed = dateB > dateA;
    if (missed) missedDueDates++;
    if (missedDueDates > 1) return true;
  }
  dateA = new Date(status_history[status_history.length - 1].new_due_date);
  dateB = new Date();
  missed = dateB > dateA;
  if (missed) missedDueDates++;
  if (missedDueDates > 1) return true;
  return false;
};

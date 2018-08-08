export const getFilteredEmployees = state => {
  // If there are no filters active, show all
  if (state.filters.length < 1) return state.employees;

  return state.employees.filter(employee => {
    // Otherwise only show those employee that are on departments that have a filter
    return state.filters.includes(employee.department);
  });
};

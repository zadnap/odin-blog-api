import ROLES from '../constants/roles.js';

export const getPostVisibilityFilter = (user) => {
  if (user?.role === ROLES.ADMIN) {
    return {};
  }

  return { published: true };
};

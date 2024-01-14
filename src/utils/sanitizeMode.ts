// create a function that maps a mode to a translation
export const sanitizeMode = (mode: string): string => {
  switch (mode) {
    case 'all':
      return 'todos';
    case 'default':
      return 'aleatório';
    case 'new':
      return 'novas';
    case 'realistic':
      return 'realista';
    case 'wrong':
      return 'erradas';
    case 'hard':
      return 'difícil';
    case 'custom':
      return 'personalizado';
    default:
      return 'aleatório';
  }
};

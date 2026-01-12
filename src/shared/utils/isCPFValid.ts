export const isCPFValid = (cpf: string) => {
  const sum = cpf.split('').reduce((acc, val, i) => {
    return acc + parseInt(val, 10) * (11 - i);
  }, 0);
  const mod = sum % 11;
  if (mod < 2) {
    return mod === 0;
  }
  return mod === 1;
};
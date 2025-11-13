// Funções de máscara
export const formatCpf = (value: string) => {
  if (!value) return "";
  value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
  if (value.length > 11) { // Limita a 11 dígitos
    value = value.substring(0, 11);
  }
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
};

export const formatPhone = (value: string) => {
  if (!value) return "";
  value = value.replace(/\D/g, ""); // Remove tudo que não é dígito

  if (value.length > 11) {
    value = value.substring(0, 11); // Limita a 11 dígitos
  }

  let formattedValue = value;
  if (formattedValue.length > 0) {
    formattedValue = `(${formattedValue}`;
  }
  if (formattedValue.length > 3) { // Depois de (XX
    formattedValue = `${formattedValue.substring(0, 3)}) ${formattedValue.substring(3)}`;
  }
  if (formattedValue.length > 6 && formattedValue.charAt(6) !== ' ') { // Depois de (XX) X
    formattedValue = `${formattedValue.substring(0, 6)} ${formattedValue.substring(6)}`;
  }
  if (formattedValue.length > 11) { // Depois de (XX) X XXXX
    formattedValue = `${formattedValue.substring(0, 11)}-${formattedValue.substring(11)}`;
  }
  return formattedValue;
};

export const isValidCpf = (value: string) => {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
};
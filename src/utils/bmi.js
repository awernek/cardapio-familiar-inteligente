/**
 * Calcula o IMC (Índice de Massa Corporal)
 * @param {number} weight - Peso em kg
 * @param {number} height - Altura em cm
 * @returns {string|null} IMC formatado com 1 casa decimal ou null
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

/**
 * Retorna a classificação do IMC
 * @param {string|number} bmi - Valor do IMC
 * @returns {string} Classificação do IMC
 */
export const getBMICategory = (bmi) => {
  if (!bmi) return '';
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return 'Abaixo do peso';
  if (bmiNum < 25) return 'Peso normal';
  if (bmiNum < 30) return 'Sobrepeso';
  return 'Obesidade';
};

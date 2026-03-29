/**
 * Telefon raqamni formatlaydi: 998900100505 → +998 90 010 05 05
 */
export function formatPhone(phone: number): string {
  const digits = phone.toString().replace(/\D/g, '')
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`
}

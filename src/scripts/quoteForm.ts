// Logica pura del formulario de cotizacion.
// validateForm: valida campos obligatorios sin regex (segun ARCHITECTURE.md).
// buildWhatsAppMessage: arma el mensaje segun el contrato de ARCHITECTURE.md
// y lo devuelve codificado con encodeURIComponent, listo para concatenarse a
// la URL de wa.me.

export interface QuoteFormData {
  nombre: string;
  telefono: string;
  email: string;
  tipoSeguro: string;
  consulta: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: {
    nombre: boolean;
    tipoSeguro: boolean;
    consulta: boolean;
  };
}

export function validateForm(formData: QuoteFormData): ValidationResult {
  const errors = {
    nombre: formData.nombre.trim().length === 0,
    tipoSeguro: formData.tipoSeguro.trim().length === 0,
    consulta: formData.consulta.trim().length === 0,
  };
  const valid = !errors.nombre && !errors.tipoSeguro && !errors.consulta;
  return { valid, errors };
}

export function buildWhatsAppMessage(formData: QuoteFormData): string {
  const lines: string[] = [
    `Hola, soy ${formData.nombre.trim()}. Me interesa el seguro de ${formData.tipoSeguro.trim()}.`,
    formData.consulta.trim(),
  ];
  if (formData.telefono.trim().length > 0) {
    lines.push(`Mi teléfono: ${formData.telefono.trim()}`);
  }
  if (formData.email.trim().length > 0) {
    lines.push(`Mi email: ${formData.email.trim()}`);
  }
  return encodeURIComponent(lines.join('\n'));
}

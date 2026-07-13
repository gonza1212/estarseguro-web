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
  const lines: string[] = [];
  const nombre = formData.nombre.trim();
  const tipoSeguro = formData.tipoSeguro.trim();
  const consulta = formData.consulta.trim();
  const telefono = formData.telefono.trim();
  const email = formData.email.trim();

  if (nombre.length > 0 && tipoSeguro.length > 0) {
    lines.push(`Hola, soy ${nombre}. Me interesa el seguro de ${tipoSeguro}.`);
  } else if (nombre.length > 0) {
    lines.push(`Hola, soy ${nombre}.`);
  }

  if (consulta.length > 0) {
    lines.push(consulta);
  }
  if (telefono.length > 0) {
    lines.push(`Mi teléfono: ${telefono}`);
  }
  if (email.length > 0) {
    lines.push(`Mi email: ${email}`);
  }
  return encodeURIComponent(lines.join('\n'));
}

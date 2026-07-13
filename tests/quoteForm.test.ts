// Tests de validateForm y buildWhatsAppMessage.
// Se ejecuta con: node --test --experimental-strip-types tests/quoteForm.test.ts
// Cubre los casos listados en tasks/feature-2-hero-formulario.md seccion Tests.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateForm, buildWhatsAppMessage, validateViajeroForm, buildViajeroWhatsAppMessage } from '../src/scripts/quoteForm.ts';

describe('validateForm', () => {
  it('acepta nombre, tipoSeguro y consulta completos (telefono y email vacios)', () => {
    const result = validateForm({
      nombre: 'Juan',
      telefono: '',
      email: '',
      tipoSeguro: 'Autos',
      consulta: 'Quiero cotizar un auto',
    });
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, { nombre: false, tipoSeguro: false, consulta: false });
  });

  it('acepta todos los campos completos, incluidos los opcionales', () => {
    const result = validateForm({
      nombre: 'Ana',
      telefono: '1145678901',
      email: 'ana@example.com',
      tipoSeguro: 'ART',
      consulta: 'Necesito info',
    });
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, { nombre: false, tipoSeguro: false, consulta: false });
  });

  it('rechaza nombre vacio', () => {
    const result = validateForm({
      nombre: '',
      telefono: '',
      email: '',
      tipoSeguro: 'Autos',
      consulta: 'Algo',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.nombre, true);
  });

  it('rechaza nombre solo con espacios', () => {
    const result = validateForm({
      nombre: '   ',
      telefono: '',
      email: '',
      tipoSeguro: 'Autos',
      consulta: 'Algo',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.nombre, true);
  });

  it('rechaza tipoSeguro en placeholder (string vacio)', () => {
    const result = validateForm({
      nombre: 'Juan',
      telefono: '',
      email: '',
      tipoSeguro: '',
      consulta: 'Algo',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.tipoSeguro, true);
  });

  it('rechaza consulta vacia', () => {
    const result = validateForm({
      nombre: 'Juan',
      telefono: '',
      email: '',
      tipoSeguro: 'Autos',
      consulta: '',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.consulta, true);
  });

  it('rechaza multiples campos obligatorios vacios a la vez', () => {
    const result = validateForm({
      nombre: '',
      telefono: '',
      email: '',
      tipoSeguro: '',
      consulta: '',
    });
    assert.equal(result.valid, false);
    assert.deepEqual(result.errors, { nombre: true, tipoSeguro: true, consulta: true });
  });
});

describe('buildWhatsAppMessage', () => {
  it('incluye las 5 lineas con todos los campos', () => {
    const message = buildWhatsAppMessage({
      nombre: 'Juan',
      telefono: '1145678901',
      email: 'juan@example.com',
      tipoSeguro: 'Autos',
      consulta: 'Quiero cotizar',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(
      decoded,
      'Hola, soy Juan. Me interesa el seguro de Autos.\nQuiero cotizar\nMi teléfono: 1145678901\nMi email: juan@example.com'
    );
  });

  it('omite la linea de telefono cuando telefono esta vacio', () => {
    const message = buildWhatsAppMessage({
      nombre: 'Juan',
      telefono: '',
      email: 'juan@example.com',
      tipoSeguro: 'Autos',
      consulta: 'Quiero cotizar',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(decoded.includes('Mi teléfono:'), false);
    assert.equal(decoded.includes('Mi email: juan@example.com'), true);
  });

  it('omite la linea de email cuando email esta vacio', () => {
    const message = buildWhatsAppMessage({
      nombre: 'Juan',
      telefono: '1145678901',
      email: '',
      tipoSeguro: 'Autos',
      consulta: 'Quiero cotizar',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(decoded.includes('Mi email:'), false);
    assert.equal(decoded.includes('Mi teléfono: 1145678901'), true);
  });

  it('omite ambas lineas opcionales cuando telefono y email estan vacios', () => {
    const message = buildWhatsAppMessage({
      nombre: 'Juan',
      telefono: '',
      email: '',
      tipoSeguro: 'Autos',
      consulta: 'Quiero cotizar',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(decoded.includes('Mi teléfono:'), false);
    assert.equal(decoded.includes('Mi email:'), false);
  });

  it('devuelve el mensaje codificado con encodeURIComponent', () => {
    const message = buildWhatsAppMessage({
      nombre: 'Juan',
      telefono: '',
      email: '',
      tipoSeguro: 'Autos',
      consulta: 'Quiero info con ñ y acentos',
    });
    assert.equal(message.includes(' '), false);
    assert.equal(message.includes('ñ'), false);
    assert.equal(decodeURIComponent(message).includes('ñ'), true);
  });

  it('respeta el orden del contrato: saludo, consulta, telefono, email', () => {
    const message = buildWhatsAppMessage({
      nombre: 'Ana',
      telefono: '1145678901',
      email: 'ana@example.com',
      tipoSeguro: 'ART',
      consulta: 'Necesito info',
    });
    const decoded = decodeURIComponent(message);
    const idxSaludo = decoded.indexOf('Hola, soy Ana');
    const idxConsulta = decoded.indexOf('Necesito info');
    const idxTel = decoded.indexOf('Mi teléfono:');
    const idxEmail = decoded.indexOf('Mi email:');
    assert.ok(idxSaludo < idxConsulta, 'saludo antes de consulta');
    assert.ok(idxConsulta < idxTel, 'consulta antes de telefono');
    assert.ok(idxTel < idxEmail, 'telefono antes de email');
  });

  it('omite la linea de saludo cuando nombre esta vacio', () => {
    const message = buildWhatsAppMessage({
      nombre: '',
      telefono: '1145678901',
      email: '',
      tipoSeguro: 'Autos',
      consulta: 'Quiero cotizar',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(decoded.includes('Hola, soy'), false);
    assert.equal(decoded.includes('Quiero cotizar'), true);
    assert.equal(decoded.includes('Mi teléfono: 1145678901'), true);
  });

  it('omite la linea de consulta cuando consulta esta vacia', () => {
    const message = buildWhatsAppMessage({
      nombre: 'Juan',
      telefono: '',
      email: '',
      tipoSeguro: 'Autos',
      consulta: '',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(decoded.includes('Hola, soy Juan. Me interesa el seguro de Autos.'), true);
    assert.equal(decoded.includes('Mi teléfono:'), false);
    assert.equal(decoded.includes('Mi email:'), false);
  });

  it('incluye solo el nombre cuando tipoSeguro esta vacio', () => {
    const message = buildWhatsAppMessage({
      nombre: 'Juan',
      telefono: '',
      email: '',
      tipoSeguro: '',
      consulta: 'Quiero cotizar',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(decoded, 'Hola, soy Juan.\nQuiero cotizar');
  });

  it('devuelve string vacio cuando todos los campos estan vacios', () => {
    const message = buildWhatsAppMessage({
      nombre: '',
      telefono: '',
      email: '',
      tipoSeguro: '',
      consulta: '',
    });
    assert.equal(message, '');
  });
});

describe('validateViajeroForm', () => {
  it('acepta todos los campos completos', () => {
    const result = validateViajeroForm({
      nombre: 'Juan',
      cantidadPersonas: '3',
      edades: '35, 28, 4',
      destino: 'Brasil',
      fechaDesde: '2026-08-01',
      fechaHasta: '2026-08-15',
    });
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, {
      nombre: false,
      cantidadPersonas: false,
      edades: false,
      destino: false,
      fechaDesde: false,
      fechaHasta: false,
    });
  });

  it('rechaza nombre vacio', () => {
    const result = validateViajeroForm({
      nombre: '',
      cantidadPersonas: '2',
      edades: '30, 25',
      destino: 'Chile',
      fechaDesde: '2026-09-01',
      fechaHasta: '2026-09-10',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.nombre, true);
  });

  it('rechaza cantidad de personas vacia', () => {
    const result = validateViajeroForm({
      nombre: 'Ana',
      cantidadPersonas: '',
      edades: '40',
      destino: 'Uruguay',
      fechaDesde: '2026-10-01',
      fechaHasta: '2026-10-05',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.cantidadPersonas, true);
  });

  it('rechaza destino vacio', () => {
    const result = validateViajeroForm({
      nombre: 'Ana',
      cantidadPersonas: '1',
      edades: '40',
      destino: '',
      fechaDesde: '2026-10-01',
      fechaHasta: '2026-10-05',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.destino, true);
  });

  it('rechaza fecha desde vacia', () => {
    const result = validateViajeroForm({
      nombre: 'Ana',
      cantidadPersonas: '1',
      edades: '40',
      destino: 'Perú',
      fechaDesde: '',
      fechaHasta: '2026-11-01',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.fechaDesde, true);
  });

  it('rechaza multiples campos vacios', () => {
    const result = validateViajeroForm({
      nombre: '',
      cantidadPersonas: '',
      edades: '',
      destino: '',
      fechaDesde: '',
      fechaHasta: '',
    });
    assert.equal(result.valid, false);
    assert.deepEqual(result.errors, {
      nombre: true,
      cantidadPersonas: true,
      edades: true,
      destino: true,
      fechaDesde: true,
      fechaHasta: true,
    });
  });
});

describe('buildViajeroWhatsAppMessage', () => {
  it('incluye todos los campos en el mensaje', () => {
    const message = buildViajeroWhatsAppMessage({
      nombre: 'Juan',
      cantidadPersonas: '3',
      edades: '35, 28, 4',
      destino: 'Brasil',
      fechaDesde: '2026-08-01',
      fechaHasta: '2026-08-15',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(decoded.includes('Hola, soy Juan. Quisiera cotizar una asistencia al viajero.'), true);
    assert.equal(decoded.includes('Cantidad de personas: 3'), true);
    assert.equal(decoded.includes('Edades: 35, 28, 4'), true);
    assert.equal(decoded.includes('Destino: Brasil'), true);
    assert.equal(decoded.includes('Fecha desde: 2026-08-01'), true);
    assert.equal(decoded.includes('Fecha hasta: 2026-08-15'), true);
  });

  it('usa saludo generico cuando nombre esta vacio', () => {
    const message = buildViajeroWhatsAppMessage({
      nombre: '',
      cantidadPersonas: '1',
      edades: '30',
      destino: 'Chile',
      fechaDesde: '2026-09-01',
      fechaHasta: '2026-09-10',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(decoded.includes('Hola, quisiera cotizar una asistencia al viajero.'), true);
    assert.equal(decoded.includes('Hola, soy'), false);
  });

  it('omite campos vacios', () => {
    const message = buildViajeroWhatsAppMessage({
      nombre: 'Ana',
      cantidadPersonas: '',
      edades: '40',
      destino: '',
      fechaDesde: '2026-10-01',
      fechaHasta: '',
    });
    const decoded = decodeURIComponent(message);
    assert.equal(decoded.includes('Cantidad de personas:'), false);
    assert.equal(decoded.includes('Destino:'), false);
    assert.equal(decoded.includes('Fecha hasta:'), false);
    assert.equal(decoded.includes('Edades: 40'), true);
    assert.equal(decoded.includes('Fecha desde: 2026-10-01'), true);
  });

  it('devuelve el mensaje codificado con encodeURIComponent', () => {
    const message = buildViajeroWhatsAppMessage({
      nombre: 'María José',
      cantidadPersonas: '2',
      edades: '30, 28',
      destino: 'México',
      fechaDesde: '2026-12-01',
      fechaHasta: '2026-12-20',
    });
    assert.equal(message.includes(' '), false);
    assert.equal(message.includes('á'), false);
    assert.equal(decodeURIComponent(message).includes('María José'), true);
  });

  it('respeta el orden: saludo, cantidad, edades, destino, fecha desde, fecha hasta', () => {
    const message = buildViajeroWhatsAppMessage({
      nombre: 'Ana',
      cantidadPersonas: '2',
      edades: '30, 28',
      destino: 'España',
      fechaDesde: '2026-07-01',
      fechaHasta: '2026-07-20',
    });
    const decoded = decodeURIComponent(message);
    const idxSaludo = decoded.indexOf('Hola, soy Ana');
    const idxCantidad = decoded.indexOf('Cantidad de personas:');
    const idxEdades = decoded.indexOf('Edades:');
    const idxDestino = decoded.indexOf('Destino:');
    const idxDesde = decoded.indexOf('Fecha desde:');
    const idxHasta = decoded.indexOf('Fecha hasta:');
    assert.ok(idxSaludo < idxCantidad, 'saludo antes de cantidad');
    assert.ok(idxCantidad < idxEdades, 'cantidad antes de edades');
    assert.ok(idxEdades < idxDestino, 'edades antes de destino');
    assert.ok(idxDestino < idxDesde, 'destino antes de fecha desde');
    assert.ok(idxDesde < idxHasta, 'fecha desde antes de fecha hasta');
  });
});

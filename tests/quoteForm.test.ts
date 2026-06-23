// Tests de validateForm y buildWhatsAppMessage.
// Se ejecuta con: node --test --experimental-strip-types tests/quoteForm.test.ts
// Cubre los casos listados en tasks/feature-2-hero-formulario.md seccion Tests.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateForm, buildWhatsAppMessage } from '../src/scripts/quoteForm.ts';

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
});

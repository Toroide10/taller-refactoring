const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
var print_the_bill = require('../../statement');

function normalizeCurrency(str) {
   // Elimina espacios normales y no separables después del símbolo $
   return str.replace(/\$\s*/g, '$').replace(/\u00A0/g, '');
}

Given('el listado de la facturación de espectáculos', function (espectaculos) {
   this.invoice = JSON.parse(espectaculos);
});

Given('la lista de obras', function (obras) {
   this.play = JSON.parse(obras);
});

When('mando a imprimir el borderau', function () {
   this.actualAnswer = print_the_bill.printTheBillText(this.invoice, this.play);
});

Then('debería imprimir el borderau', function (expectedAnswer) {
   assert.equal(this.actualAnswer.trim(), expectedAnswer.trim());
});

When('mando a imprimir el borderau en HTML', function () {
   this.actualAnswer = print_the_bill.printTheBillHtml(this.invoice, this.play);
});

Then('debería imprimir el borderau en HTML', function (expectedAnswer) {
   assert.equal(this.actualAnswer.trim(), expectedAnswer.trim());
});

// NUEVOS STEPDEFS PARA ARS

When('mando a imprimir el borderau en ARS', function () {
   this.actualAnswer = print_the_bill.printTheBillTextARS(this.invoice, this.play);
});

Then('debería imprimir el borderau en ARS', function (expectedAnswer) {
   assert.equal(
      normalizeCurrency(this.actualAnswer.trim()),
      normalizeCurrency(expectedAnswer.trim())
   );
});

When('mando a imprimir el borderau en HTML en ARS', function () {
   this.actualAnswer = print_the_bill.printTheBillHtmlARS(this.invoice, this.play);
});

Then('debería imprimir el borderau en HTML en ARS', function (expectedAnswer) {
   assert.equal(
      normalizeCurrency(this.actualAnswer.trim()),
      normalizeCurrency(expectedAnswer.trim())
   );
});
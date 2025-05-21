const createStatementData = require("./createStatementData.js");

// Abstracción de formateador de moneda
class CurrencyFormatter {
    format(amount) {
        throw new Error("format() must be implemented");
    }
}

class UsdFormatter extends CurrencyFormatter {
    format(amount) {
        return new Intl.NumberFormat("en-US", {
            style: "currency", currency: "USD", minimumFractionDigits: 2
        }).format(amount / 100);
    }
}

class ArsFormatter extends CurrencyFormatter {
    format(amount) {
        return new Intl.NumberFormat("es-AR", {
            style: "currency", currency: "ARS", minimumFractionDigits: 2
        }).format(amount / 100);
    }
}

// Renderizador abstracto
class StatementRenderer {
    constructor(currencyFormatter) {
        this.currencyFormatter = currencyFormatter;
    }
    render(data) {
        throw new Error("render() must be implemented");
    }
}

// Renderizador de texto
class PlainTextRenderer extends StatementRenderer {
    render(data) {
        let result = `Statement for ${data.customer}\n`;
        for (let perf of data.performances) {
            result += `  ${perf.play.name}: ${this.currencyFormatter.format(perf.amount)} (${perf.audience} seats)\n`;
        }
        result += `Amount owed is ${this.currencyFormatter.format(data.totalAmount)}\n`;
        result += `You earned ${data.totalVolumeCredits} credits\n`;
        return result;
    }
}

// Renderizador HTML
class HtmlRenderer extends StatementRenderer {
    render(data) {
        let result = `<h1>Statement for ${data.customer}</h1>\n`;
        result += "<table>\n";
        result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>\n";
        for (let perf of data.performances) {
            result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
            result += `<td>${this.currencyFormatter.format(perf.amount)}</td></tr>\n`;
        }
        result += "</table>\n";
        result += `<p>Amount owed is <em>${this.currencyFormatter.format(data.totalAmount)}</em></p>\n`;
        result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
        return result;
    }
}

// Función principal que aplica DIP
function printTheBill(invoice, plays, renderer) {
    const data = createStatementData(invoice, plays);
    return renderer.render(data);
}

// Exporta funciones concretas para compatibilidad con los stepdefs
exports.printTheBillText = function (invoice, plays) {
    return printTheBill(invoice, plays, new PlainTextRenderer(new UsdFormatter()));
}
exports.printTheBillHtml = function (invoice, plays) {
    return printTheBill(invoice, plays, new HtmlRenderer(new UsdFormatter()));
}
exports.printTheBillTextARS = function (invoice, plays) {
    return printTheBill(invoice, plays, new PlainTextRenderer(new ArsFormatter()));
}
exports.printTheBillHtmlARS = function (invoice, plays) {
    return printTheBill(invoice, plays, new HtmlRenderer(new ArsFormatter()));
}
// Utilidades
function format(aNumber, aCurrency) {
    switch (aCurrency) {
        case "USD":
            return new Intl.NumberFormat("en-US", {
                style: "currency", currency: aCurrency,
                minimumFractionDigits: 2
            }).format(aNumber);
        case "ARS":
            return new Intl.NumberFormat("es-AR", {
                style: "currency", currency: aCurrency,
                minimumFractionDigits: 2
            }).format(aNumber);
        default:
            throw new Error(`Unsupported currency: ${aCurrency}`);
    }
}
function usd(aNumber) {
    return format(aNumber / 100, "USD");
}
function ars(aNumber) {
    return format(aNumber / 100, "ARS");
}

function renderHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>\n";
    for (let perf of data.performances) {
      result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
      result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
  }
  
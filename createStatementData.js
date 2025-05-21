module.exports = createStatementData = function (invoice, plays) {
    let statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData.performances);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData.performances);

    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, calculator.aPerformance);
        result.play = calculator.aPlay;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function totalAmount(somePerformances) {
        return somePerformances.reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumeCredits(somePerformances) {
        return somePerformances.reduce((total, p) => total + p.volumeCredits, 0);
    }


    function playFor(aPerformance) {
        let result = plays[aPerformance.playID];
        return result;
    }

}





class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.aPerformance = aPerformance;
        this.aPlay = aPlay;
    }


    get volumeCredits() {
        let result = 0;
        return Math.max(this.aPerformance.audience - 30, 0);
    }
}




class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.aPerformance.audience > 30) {
            result += 1000 * (this.aPerformance.audience - 30);
        }
        return result;
    }

}





class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.aPerformance.audience > 20) {
            result += 10000 + 500 * (this.aPerformance.audience - 20);
        }
        return result += 300 * this.aPerformance.audience;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.aPerformance.audience / 5);
    }
}



function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);
        default: throw new Error(`unknown type: ${aPlay.type}`);
    }
}
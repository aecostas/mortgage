class Deposit {
  static get INTEREST_END() { return 'end'; }
  static get INTEREST_QUARTER() { return 'quarter'; }
  static get INTEREST_MONTH() { return 'month'; }

  constructor(name, account, initialAmount, start, duration, interest, type) {
    this._name = name;
    this.type = type;
    this.account = account;
    this.month = 0;
    this.start = start;
    this.duration = duration;
    this.interest = interest;
    this.initialAmount = initialAmount;
    this.widthholding = 0.19;

    switch (type) {
      case Deposit.INTEREST_END:
        this.getLiquidations = this.getLiquidationsAtTheEnd;
        break;
      case Deposit.INTEREST_MONTH:
        this.getLiquidations = this.getLiquidationsMonthly;
        break;
      case Deposit.INTEREST_QUARTER:
        this.getLiquidations = this.getLiquidationsQuarterly;
        break;
    }
  }

  get name() {
    return this._name;
  }

  getLiquidationsQuarterly() {
    let liquidations = [];

    if ((this.month - this.start) % 4 === 0) {
      liquidations.push(["Deposit interests", (this.initialAmount * this.interest) * (this.duration / 12) * (1 - this.widthholding) * 4 / this.duration]);
    }

    if (this.month === this.start + this.duration) {
      liquidations.push(["Deposit ends", this.initialAmount]);
    }

    return(liquidations);
  }

  getLiquidationsMonthly() {
    let liquidations = [
      ["Deposit interests", (this.initialAmount * this.interest) * (this.duration / 12) * (1 - this.widthholding) / this.duration]
    ]

    if (this.month === this.start + this.duration) {
      liquidations.push(["Deposit ends", this.initialAmount]);
    }

    return(liquidations);
  }

  getLiquidationsAtTheEnd() {
    if (this.month === this.start + this.duration) {
      return( 
        [
          ["Deposit ends", this.initialAmount],
          ["Deposit interests", (this.initialAmount * this.interest) * (this.duration / 12) * (1 - this.widthholding)]
        ]
      );
    }

    return([]);
  }

  step() {
    this.month += 1;

    if (this.month < this.start || this.month > this.start + this.duration) {
      return
    }

    if (this.month === this.start) {
      this.account.extract(this._name, "Open deposit", this.initialAmount);
    }

    for (let liquidation of this.getLiquidations()) {
      this.account.deposit(this._name, liquidation[0], liquidation[1]);
    }

  }
}

module.exports = Deposit;

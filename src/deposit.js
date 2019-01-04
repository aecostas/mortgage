class Deposit {
  constructor(name, account, initialAmount, start, duration, interest) {
    this._name = name;
    this.account = account;
    this.month = 0;
    this.start = start;
    this.duration = duration;
    this.interest = interest;
    this.initialAmount = initialAmount;
    this.widthholding = 0.19;
  }

  get name() {
    return this._name;
  }

  step() {
    this.month += 1;

    if (this.month < this.start || this.month > this.start + this.duration) {
      return
    }

    if (this.month === this.start) {
      this.account.extract(this._name, "Open deposit", this.initialAmount);
    }

    if (this.month === this.start + this.duration) {
      this.account.deposit(this._name, "Deposit ends", this.initialAmount);
      this.account.deposit(this._name, "Deposit interests", (this.initialAmount * this.interest) * (1 - this.widthholding));
    }

  }
}

module.exports = Deposit;

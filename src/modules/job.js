class Job {
  constructor(name, account, salary, start) {
    this._name = name;
    this.account = account;
    this.month = 0;
    this.start = start;
    this.salary = salary;
  }

  get name() {
    return this._name;
  }

  step() {
    this.month += 1;

    if (this.month < this.start) {
      return
    }

    this.account.deposit(this._name, "Monthly salary", this.salary);
  }
}

module.exports = Job;

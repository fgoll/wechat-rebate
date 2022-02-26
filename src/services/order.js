
module.export = class OrderBind {
  constructor()  {
    this.users = [];
  }

  push(id) {
    this.users.push(id)
  }
}
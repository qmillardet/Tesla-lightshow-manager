class NotYetImplementedError extends Error {
  constructor () {
    super('Functionality not yet implemented');
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name
    this.status = 404
  }

  statusCode() {
    return this.status
  }
}

module.exports = NotYetImplementedError

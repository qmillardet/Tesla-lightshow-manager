class Device{
    #uid;
    #montPoint = {};


    get uid() {
        return this.#uid;
    }

    set uid(value) {
        this.#uid = value;
    }

    get montPoint() {
        return this.#montPoint;
    }

    set montPoint(value) {
        this.#montPoint = value;
    }
}

module.exports = Device
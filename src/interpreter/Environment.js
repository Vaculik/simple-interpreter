module.exports = class Environment {
    constructor (parent) {
        this.parent = parent;
        this.variables = new Map();
    }

    extend () {
        return new Environment(this);
    }

    lookup (name) {
        const variable = this.variables.get(name);

        if (variable !== undefined) {
            return variable;
        }

        if (this.parent) {
            return this.parent.lookup(name);
        }
    }

    insert (name, value) {
        this.variables.set(name, value);
    }

    defPrimitives () {
        this.insert('print', (txt) => process.stdout.write(String(txt)));
        this.insert('println', (txt) => console.log(txt));
    }
};

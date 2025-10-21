import assert from "node:assert"
import { beforeEach, describe, it } from "node:test"
import BasicContainer from "../basic-container.ts"
import type Container from "../container.ts"

for (const Container of [BasicContainer]) {
  describe(Container.name, () => {
    let container: Container

    beforeEach(() => {
      container = new Container()
    })

    describe(".registrations", () => {
      it("returns all registrations when no regexp given", () => {
        container.register("hello world", { name: "helloWorld", type: "value" })
        container.register("bye world", { name: "byeWorld", type: "function" })
        const result = container.registrations()
        assert.strictEqual(result.length, 2)
        assert.ok(result.includes("helloWorld"))
        assert.ok(result.includes("byeWorld"))
      })

      it("returns registrations matching the regexp given", () => {
        container.register("hello world", { name: "helloWorld", type: "value" })
        container.register("bye world", { name: "byeWorld", type: "function" })
        const result = container.registrations(/bye/)
        assert.strictEqual(result.length, 1)
        assert.ok(result.includes("byeWorld"))
      })
    })

    describe(".createScope", () => {
      it("returns a new container", () => {
        container.register("hello world", { name: "helloWorld", type: "value" })
        const scope = container.createScope()
        assert.ok(scope instanceof Container)
      })

      it("can resolve dependencies from parent container", () => {
        container.register("hello world", { name: "helloWorld", type: "value" })
        const scope = container.createScope()
        const result = scope.resolve("helloWorld")
        assert.strictEqual(result, "hello world")
      })

      it("can add new dependencies that the parent has no access to", () => {
        container.register("hello world", { name: "helloWorld", type: "value" })

        const scope = container.createScope()
        scope.register("bye world", { name: "byeWorld", type: "value" })

        assert.strictEqual(scope.resolve("byeWorld"), "bye world")
        assert.throws(() => container.resolve("byeWorld"), Error)
      })
    })

    it("can register and resolve a class", () => {
      const myClass = class MyClass { }
      container.register(myClass, { name: "myClass", type: "class" })
      const result = container.resolve("myClass")
      assert.ok(result)
    })

    it("can register and resolve a function", () => {
      function myFunction() {
        return "hello world"
      }

      container.register(myFunction, { name: "myFunction", type: "function" })
      const result = container.resolve("myFunction")
      assert.ok(result)
    })

    it("can register and resolve an arrow function", () => {
      const myFunction = () => "hello world"

      container.register(myFunction, { name: "myFunction", type: "function" })
      const result = container.resolve("myFunction")
      assert.ok(result)
    })

    it("can register and resolve a value", () => {
      const myValue = "hello world"

      container.register(myValue, { name: "myValue", type: "value" })
      const result = container.resolve("myValue")
      assert.ok(result)
    })

    describe("for a class with dependencies", () => {
      class MyClass {
        public myFunction: string
        public mySecondaryFunction: string
        public myValue: string
        constructor(myFunction: string, mySecondFunction: string, myValue: string) {
          this.myFunction = myFunction
          this.mySecondaryFunction = mySecondFunction
          this.myValue = myValue
        }
      }

      it("can resolve", () => {
        const myValue = "hello world"
        const myFunction = (myValue: string) => myValue
        function mySecondFunction(myFunction: string) {
          return myFunction
        }

        container.register(myFunction, { type: "function", name: "myFunction" })
        container.register(mySecondFunction, {
          type: "function",
          name: "mySecondFunction",
        })
        container.register(myValue, { type: "value", name: "myValue" })
        container.register(MyClass, { type: "class", name: "myClass" })

        const result = container.resolve<MyClass>("myClass")
        assert.strictEqual(result.mySecondaryFunction, myValue)
        assert.strictEqual(result.myFunction, myValue)
        assert.strictEqual(result.myValue, myValue)
      })

      it("can build", () => {
        const myValue = "hello world"
        const myFunction = (myValue: string) => myValue
        function mySecondFunction(myFunction: string) {
          return myFunction
        }

        container.register(myFunction, { type: "function", name: "myFunction" })
        container.register(mySecondFunction, {
          type: "function",
          name: "mySecondFunction",
        })
        container.register(myValue, { type: "value", name: "myValue" })

        const result = container.build(MyClass)
        assert.strictEqual(result.mySecondaryFunction, myValue)
        assert.strictEqual(result.myFunction, myValue)
        assert.strictEqual(result.myValue, myValue)
      })
    })

    describe("for a function with dependencies", () => {
      it("can build", () => {
        const myValue = "hello world"
        const myFunction = (myClass: MyClass) => myClass.myValue
        function mySecondFunction(myFunction: string, myClass: MyClass) {
          return myFunction === myClass.myValue
        }
        class MyClass {
          public myValue: string
          constructor(myValue: string) {
            this.myValue = myValue
          }
        }

        container.register(myFunction, { type: "function", name: "myFunction" })
        container.register(myValue, { type: "value", name: "myValue" })
        container.register(MyClass, { type: "class", name: "myClass" })

        const result = container.build(mySecondFunction)
        assert.ok(result)
      })

      it("can resolve", () => {
        const myValue = "hello world"
        const myFunction = (myClass: MyClass) => myClass.myValue
        function mySecondFunction(myFunction: string, myClass: MyClass) {
          return myFunction === myClass.myValue
        }
        class MyClass {
          public myValue: string
          constructor(myValue: string) {
            this.myValue = myValue
          }
        }

        container.register(myFunction, { type: "function", name: "myFunction" })
        container.register(mySecondFunction, {
          type: "function",
          name: "mySecondFunction",
        })
        container.register(myValue, { type: "value", name: "myValue" })
        container.register(MyClass, { type: "class", name: "myClass" })

        const result = container.resolve<ReturnType<typeof mySecondFunction>>("mySecondFunction")
        assert.ok(result)
      })
    })
  })
}

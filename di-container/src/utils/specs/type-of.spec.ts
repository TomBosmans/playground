import assert from "node:assert"
import { describe, it } from "node:test"
import typeOf from "../type-of.ts"

describe("typeOf", () => {
  it("can check if something is a class", () => {
    const myClass = class MyClass {}
    assert.strictEqual(typeOf(myClass), "class")
  })

  it("can check if something is a function with arraw function", () => {
    const myFunction = () => null
    assert.strictEqual(typeOf(myFunction), "function")
  })

  it("can check if something is a function with classic function", () => {
    function myFunction() {}
    assert.strictEqual(typeOf(myFunction), "function")
  })

  it("can check if something is a value", () => {
    const myValue = { hello: "world" }
    assert.strictEqual(typeOf(myValue), "value")
  })
})

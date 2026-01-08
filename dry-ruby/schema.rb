require "irb"
require "dry-schema"

AddressSchema = Dry::Schema.Params do
  required(:street).filled(:string)
  required(:city).filled(:string)
  required(:zipcode).filled(:string)
end

UserSchema = Dry::Schema.Params do
  required(:name).filled(:string)
  required(:email).filled(:string)
  # optional() => key is not required
  # .maybe() => value is allowed to be nil
  # string is coerced to integer
  optional(:age).filled(:integer)
  required(:address).hash(AddressSchema)
end

@user = UserSchema.call(
  name: "jane",
  email: "jane@doe.org",
  age: nil,
  address: { street: "street 1", city: "NYC", zipcode: "1234"}
)

p "user: #{@user.to_h}"
p "errors: #{@user.errors.to_h}"
p "is success? #{@user.success?}"
p "is failure? #{@user.failure?}"
p "has error on :age? #{@user.error? :age}"

IRB.start

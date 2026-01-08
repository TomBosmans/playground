require "irb"
require "dry-struct"

module Types
  include Dry.Types()
end

class Address < Dry::Struct
  attribute :street, Types::String
  attribute :city, Types::String
  attribute :zipcode, Types::Coercible::Integer
end

class User < Dry::Struct 
  attribute :name, Types::String
  attribute :email, Types::String
  attribute :age, Types::Coercible::Integer
  attribute :address, Address
end

@user = User.new(name: "Tom Bosmans", email: "tom.bosmans@email.com", age: 31, random: "string", address: { street: "hollestraat", city: "heist", zipcode: 2220 })

IRB.start

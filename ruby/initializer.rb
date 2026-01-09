require "irb"
require "dry-initializer"
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

class UserRepo
  extend Dry::Initializer
  option :logger, default: -> { Logger.new($stdout) }

  def save(user)
    logger.info "create record in db"
    user
  end
end

RepoType = Types.Instance(Object).constrained(
  respond_to: :save
)

class CreateUserService
  extend Dry::Initializer

  option :repo, RepoType

  def execute(input)
    newUser = User.new(input)
    user = repo.save(newUser)
    user
  end
end

@service = CreateUserService.new(repo: UserRepo.new)
@newUser = @service.execute(name: "Tom Bosmans", email: "tom.bosmans@email.com", age: 31, random: "string", address: { street: "hollestraat", city: "heist", zipcode: 2220 })

p @newUser

IRB.start

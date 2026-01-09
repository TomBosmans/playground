require 'irb'
require 'httparty'
require 'dry-schema'
require 'dry-types'

module Types
  include Dry.Types()
end

NewPostSchema = Dry::Schema.JSON do
  required(:title).filled(:string)
  required(:body).filled(:string)
  required(:userId).filled(Types::Params::Integer)
end

class JsonPlaceHolderSDK
  include HTTParty
  base_uri "https://jsonplaceholder.typicode.com"
  headers 'Content-Type' => 'application/json; charset=UTF-8'
  
  def initialize(debug: false)
    self.class.default_options.update(debug_output: $stdout) if debug
  end

  def posts
    self.class.get("/todos")
  end

  def post(id)
    self.class.get("/todos/#{id}")
  end

  def comments_for(post_id:)
    self.class.get("/posts/#{post_id}/comments")
  end

  def create_post(title:, body:, user_id:)
    body = NewPostSchema.call!(title: title, body: body, userId: user_id)
    raise ArgumentError, body.errors.to_h.inspect if body.failure?

    self.class.post("/posts", body: body.to_h.to_json)
  end
end

@sdk = JsonPlaceHolderSDK.new(debug: false)

IRB.start

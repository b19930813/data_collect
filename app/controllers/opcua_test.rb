require 'rest-client'

response =  RestClient.get "http://127.0.0.1:39320/iotgateway/browse" , {accept: :json}
@data = JSON.parse(response.body)
puts response[:succeeded]
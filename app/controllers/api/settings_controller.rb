require 'rest-client'

module API
    class Api::SettingsController < ApplicationController
        def index
            puts 'run this'
            render json: {state:200}
        end
        def show
            if params[:id] == 'rest'
            begin
                response =  RestClient.get "http://#{params[:rest]}/iotgateway/browse" , {accept: :json}
                if response.code == 200
                    render json: {state:200}
                else
                    render json: {state:404}
                end
             rescue => exception   
                puts exception    
                render json: {state:404}  
             end    
            elsif params[:id] == 'mqtt'
                puts 'mqtt'
            elsif params[:id] == 'OPCUA'
                puts 'opcua'
                render json: {state:200}
            else
                puts 'No support!'
            end
        end
    end
end
  
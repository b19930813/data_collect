require 'rest-client'
require 'opcua_client'

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
                client = OPCUAClient::Client.new
                begin
                    client.connect("opc.tcp://#{params[:opcua]}")
                    render json: {state:200}
                rescue => exception 
                    client.disconnect
                    puts "opc ua connect fail, reason = #{exception}"
                    render json: {state:404}
                end
            elsif params[:id] == 'save'
                if Setting.count == 0 
                    #建立資料
                    @sett = Setting.new(rest_server:params[:rest],opc_ua:params[:opcua] )
                    if @sett.save
                        render json: { state: 200}
                    else
                        render json: { state: 404 }
                    end
                else
                    #修改資料
                    puts '修資料'
                    @sett = Setting.find(1)
                    @sett.opc_ua = params[:opcua] 
                    @sett.rest_server = params[:rest] 
                    @sett.mqtt = params[:mqtt] 
                    if @sett.save
                        render json: { state: 200}
                    else
                        render json: { state: 404 }
                    end
                end
            else
                puts 'No support!'
            end
        end
    end
end
  
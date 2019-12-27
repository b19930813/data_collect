require 'opcua_client'
require 'date'

module API
    class Api::OpenuaController < ApplicationController
        def show
        begin
           OPCUAClient.start("opc.tcp://#{params[:endpoint]}") do |client|
            # write to ns=2;s=1
            case params[:datatype]
            when '1'
                data =  client.read_float(2, params[:tag])
                data_type = 'float'
            when '2'
                data =  client.read_bool(2, params[:tag])
                data_type = 'boolean'
            when '3'
                data =  client.read_int16(2, params[:tag])
                data_type = 'short'
            when '4'
                data =  client.read_int32(2, params[:tag])
                data_type = 'long'
            else
                puts "Not support datatype"
            end
           
            time = DateTime.now
            render json: {data:{name:params[:tag],value:data,quality:"Good",timestamps:time,datatype:data_type}}
            end
        rescue => exception
               render json: {state:404}
               puts exception
        end
        end


    end
end
  
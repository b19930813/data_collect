require 'rest-client'
require 'opcua_client'
require 'date'

module API
    class Api::OpcuaController < ApplicationController
        def show
           puts params[:opcuaTag]
           #建立連線
           OPCUAClient.start("opc.tcp://127.0.0.1:49320") do |client|
            # write to ns=2;s=1
            data =  client.read_float(2, params[:opcuaTag])
            time = DateTime.now
            render json: {data:{name:params[:opcuaTag],value:data,quality:"Good",timestamps:time}}
          end
          
        end
    end
end
  
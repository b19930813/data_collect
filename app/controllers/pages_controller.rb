require 'rest-client'
require 'opcua_client'
require 'date'


class PagesController < ApplicationController
    def index
    end

    def dataCollector
       #從database裡面抓取資料
       @data = {tag:[]}
       DataLogger.all.each do |tag|
           @data[:tag].push(name:tag.tag_name,source:tag.source)
       end
    end
    def dataManager
         #從Setting將設定好的,ua,MQTT,Restful,Excel上傳
         #先傳送假資料過去...
         begin
            find_data = Setting.find(1)
            @rest_server = find_data.rest_server
            @opcua_server = find_data.opc_ua
            response =  RestClient.get "http://#{@rest_server}/iotgateway/browse" , {accept: :json}
            @data = JSON.parse(response.body)
            #這段測試用
            # tag_array = ''
            # @data['browseResults'].each do |k|
            #     puts k['id']
            #     tag_array += k['id']
            # end
            # puts tag_array
         rescue => exception   
            puts exception      
         end    
    end

    #這頁之後要抽出來...
    def dataMonitor
        #RestFul
        #find Rest Server url
        @data = {}
        @bad_tag = {rest:[],opcua:[]}
        find_data = Setting.find(1)
        @rest_server = find_data.rest_server
        #find tag from database
        read_request = "http://#{@rest_server}/iotgateway/read?ids="
        rest_tag = DataMonitor.where("source = 'RestFul'")
        rest_tag.each do |tag| 
            read_request += "#{tag.tag_name}&ids="
        end
  
        read_request =  read_request[0..read_request.length-6]

        #Rest例外處理
        begin
            response =  RestClient.get read_request, {accept: :json}
            @data = JSON.parse(response.body)
            @data[:source] = "RestFul" 
        rescue => exception
            #Fail = Connect Error, push data to bad_tag
            rest_tag.each do |tag|
                @bad_tag[:rest].push(tag.tag_name)
            end
            puts exception
        end
        #加入opcua 
        opcua_data = {opcua_tag:[]}
        @opcua_server ="opc.tcp://"+find_data.opc_ua

        OPCUAClient.start(@opcua_server) do |client|
            DataMonitor.where("source = 'OPCUA'").find_each do |tag|
               #data type 
               begin
                    case tag.datatype
                    when 'long'
                        tag_value = client.read_int32(2,tag.tag_name)
                        opcua_data[:opcua_tag].push({Name:tag.tag_name,Value:tag_value,time:DateTime.now.to_s(:db),source:'opcua'})
                    when 'short'
                        tag_value = client.read_int16(2,tag.tag_name)
                        opcua_data[:opcua_tag].push({Name:tag.tag_name,Value:tag_value,time:DateTime.now.to_s(:db),source:'opcua'})
                    when 'float'
                        tag_value = client.read_float(2,tag.tag_name)
                        opcua_data[:opcua_tag].push({Name:tag.tag_name,Value:tag_value,time:DateTime.now.to_s(:db),source:'opcua'})
                    when 'boolean'
                        tag_value = client.read_boolean(2,tag.tag_name)
                        opcua_data[:opcua_tag].push({Name:tag.tag_name,Value:tag_value,time:DateTime.now.to_s(:db),source:'opcua'})
                    else 
                        puts '不支援的資料格式'
                    end
                rescue => exception
                    
                    @bad_tag[:opcua].push(tag.tag_name)
                end
            end
       end
       @data[:opcua] = opcua_data
    end


        
    def setting
        #這邊要重資料庫帶入資料喔!
        #測試期間暫時都給假資料，setting用於驗證，跟寫入setting table，在跟使用者做關聯性
        @data = Setting.find(1)
    end
end
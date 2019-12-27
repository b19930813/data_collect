require 'rest-client'
require 'opcua_client'

class PagesController < ApplicationController
    def index
    end

    def dataCollector
       #從database裡面抓取資料

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
        #RESTFUL!!!!!!!!!!!!!!!!!!!!!!!!!!@@
        #find Rest Server url
        find_data = Setting.find(1)
        @rest_server = find_data.rest_server
        #find tag from database
        read_request = "http://#{@rest_server}/iotgateway/read?ids="
        rest_tag = DataMonitor.where("source = 'rest'")
        rest_tag.each do |tag|
            read_request += "#{tag.tag_name}&ids="
        end

        read_request =  read_request[0..read_request.length-6]
        response =  RestClient.get read_request, {accept: :json}
        @data = JSON.parse(response.body)
        @data[:source] = "RestFul" 
        puts @data
    end
        
    def setting
        #這邊要重資料庫帶入資料喔!
        #測試期間暫時都給假資料，setting用於驗證，跟寫入setting table，在跟使用者做關聯性
        @data = Setting.find(1)
    end
end
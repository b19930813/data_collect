require 'rest-client'
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
            response =  RestClient.get 'http://127.0.0.1:39320/iotgateway/browse' , {accept: :json}
            @data = JSON.parse(response.body)
         rescue => exception   
            puts exception      
         end    
    end

    def dataMonitor
        #先寫死好了
        data_list = ['Channel1.Device1.Tag1','Channel1.Device1.Tag2','Channel1.Device1.Tag3']
        read_request = "http://127.0.0.1:39320/iotgateway/read?ids="
        data_list.each do |data|
            read_request += "#{data}&"
        end
        read_request =  read_request[0..read_request.length-2]
        response =  RestClient.get 'http://127.0.0.1:39320/iotgateway/read?ids=Channel1.Device1.Tag1&ids=Channel1.Device1.Tag2&read?ids=Channel1.Device1.tag1&ids=Channel1.Device1.Tag3' , {accept: :json}
        @data = JSON.parse(response.body)
    end
        
    def setting
        #這邊要重資料庫帶入資料喔!
        #測試期間暫時都給假資料，setting用於驗證，跟寫入setting table，在跟使用者做關聯性
    end
end
module API
    class Api::DatatableController < ApplicationController
      skip_before_action :verify_authenticity_token 
      def create
         #啟動資料寫入
        #讀取要寫入的資料
        
      end

      def destroy
         #關閉資料寫入
         puts 'run destroy'
      end

    end
end
  
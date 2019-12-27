

module API
    class Api::DatagroupController < ApplicationController
      skip_before_action :verify_authenticity_token 

      def index
        puts 'index'
      end
      
      def show
      end
  
      def create
        begin
          puts params[:data]
          params[:data].each_with_index do |tag_data,index|
            @DataMonitors = DataMonitor.find_or_create_by(tag_name:tag_data,source:params[:source],datatype:params[:datatype][index])
          end
          render json: {state:200}
        rescue => exception
          puts exception
          render json: {state:404}
        end
      end

      def update
      end

      private
      #no = string
      def datatype_change(no)
         case no
         when no =="1"
           return 'float'
         when no =="2"
          return 'boolean'
         when no =="3"
          return 'short'
         when no =="4"
          return 'long'
         else
           puts "不支援的資料型態 no = #{no}"
           return 'None'
         end
      end

    end
end
  
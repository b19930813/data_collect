module API
    class Api::KepwareController < ApplicationController
        skip_before_action :verify_authenticity_token 
        def index
            puts 'Browser all data'
        end
        
        def create #post
            # Add data to table
            render json: {name: 'Channel1.Device1.Tag1',value: '20'}
        end

        def update #put
            puts 'get Put request'
            puts "getID = #{params[:id]}"
            render json: {context: 'return update method'}
        end
    end
end
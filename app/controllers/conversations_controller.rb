class ConversationsController < ApplicationController
    def index
        puts 'run index'
        render json: {state:200}
      end
    
      def create
        puts 'run create'
      end
      
      private
      
      def conversation_params
        params.require(:conversation).permit(:title)
      end
end

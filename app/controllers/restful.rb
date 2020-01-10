require 'rest-client'
require "json"
require 'opcua_client'
require 'date'

class Tag
    attr_accessor :name,:value,:successed,:time
    def initialize(name, value,successed,time)
        @name = name
        @value = value
        @successed = successed
        @time = time
    end
end
def browser
   response =  RestClient.get 'http://127.0.0.1:39320/iotgateway/browse' , {accept: :json}
   data = JSON.parse(response.body)
   puts data["browseResults"]

end

def getData(data_array)
    read_request = "http://127.0.0.1:39320/iotgateway/read?ids="
    data_array.each do |data|
        read_request += "#{data}&"
    end
    read_request =  read_request[0..read_request.length-2]
    response =  RestClient.get 'http://127.0.0.1:39320/iotgateway/read?ids=Channel1.Device1.Tag1&ids=Channel1.Device1.Tag2&read?ids=Channel1.Device1.tag1&ids=Channel1.Device1.Tag3' , {accept: :json}
    @data = JSON.parse(response.body)
    puts data["readResults"]
end
data_list = ['Channel1.Device1.Tag1','Channel1.Device1.Tag2','Channel1.Device1.Tag3']

#getData(data_list)

#int32 for Long 
#int 16 for short


def opc_ua_sub
    cli = OPCUAClient::Client.new

   cli.after_session_created do |cli|
  subscription_id = cli.create_subscription
  ns_index = 2
  node_name = "Channel1.Device1.Tag8"
  cli.add_monitored_item(subscription_id, ns_index, node_name)
end

cli.after_data_changed do |subscription_id, monitor_id, server_time, source_time, new_value|
  #puts("data changed: " + [subscription_id, monitor_id, server_time, source_time, new_value].inspect)
end

cli.connect("opc.tcp://127.0.0.1:49320")

loop do

  puts "result = #{cli.run_mon_cycle}"
  sleep(0.2)
end
end

#tag = Hash
def get_opcua(tag)
    opcua_server = "opc.tcp://127.0.0.1:49320"
    opcua_data = {}
    OPCUAClient.start(opcua_server) do |client|
        # write to ns=2;s=1
         tag_value = client.read_int32(2, tag)
         opcua_data = {tagName:tag,value:tag_value,time:DateTime.now}
      end
    opcua_data
end

def getData 
   data = {
       readResults:[
       {id: "Tag1",s:true},
       {id: "Tag2",s:true},
       {id: "Tag3",s:true}
   ]
  # data[:opcua] = get_opcua("Channel1.Device1.Tag8")
}
end
def hash_test
   date = DateTime.now
end

# 0 1 1 2 3 5 8 13 21 34 55 89 144 233
def interview_for(index)
    list = [0,1]
   if index <2
    return index 
   else
    2.upto(index) do  |i|
        list.push(list[i-2] + list[i-1])
    end
   end
   list[list.length-1]
end


def interview_recursive(index)
   if index <2 
      return index
   else
      return interview_recursive(index-2) + interview_recursive(index-1)
   end
end
# puts interview_for(10)
# puts interview_recursive(10)

def sum(num)
    return 1 if num == 1
    return sum(num-1) + num
end

def factorial(num)
    return 1 if(num===0) 
    return factorial(num-1) * num
end

puts factorial(3)
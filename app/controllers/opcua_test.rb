require 'opcua_client'

OPCUAClient.start("opc.tcp://127.0.0.1:49320") do |client|
  # write to ns=2;s=1
  result = client.read_float(2, "Channel1.Device1.Tag1")
  puts result
end
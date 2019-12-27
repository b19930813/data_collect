# @param {Integer} m
# @param {Integer} n
# @return {Integer}
def unique_paths(m, n)
    #goal 
    goal = m+n-2
    return ccc(m+n-2) / ccc(m-1) /ccc(n-1)
    
end

def ccc(num)
    temp = 1
    1.upto(num) do |n|
        temp *= n
    end
    return temp
end
puts unique_paths(7,3)
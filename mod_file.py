import fileinput
for line in fileinput.input('1.txt',inplace=1):
    print line.replace("line",'123'),

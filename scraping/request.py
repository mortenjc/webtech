import requests

url = 'https://www.w3schools.com/python/demopage.php'
myobj = {'somekey': 'somevalue'}
#x = requests.post(url, data = myobj)

url2 = 'http://www.dr.dk'
res = requests.post(url2)
print(res)

#print(res.content)

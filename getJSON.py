import webbrowser, sys, requests, bs4, selenium, json, csv, pprint
# order (Name1, Name2(alphabetically), tournament name, website, prelim wins, prelim losses, out win, out loss
tourney = []

a = open('2016-2017PF.json', 'rt')
b = open('2017-2018PF.json', 'rt')
c = open('2018-2019PF.json', 'rt')

indivA = json.load(a)
indivB = json.load(b)
indivC = json.load(c)

data = {}

data = indivA


for i in indivB:
    if data.get(i) == None:
        data[i] = {}
        data[i] = indivB[i]

    else:
        for b in indivB[i]:
            data[i][b] = {}
            data[i][b] = indivB[i][b]

for i in indivC:
    if data.get(i) == None:
        data[i] = {}
        data[i] = indivC[i]

    else:
        for b in indivC[i]:
            data[i][b] = {}
            data[i][b] = indivC[i][b]



with open('finalTeam.json', 'w') as outfile:
    json.dump(data, outfile, indent=2)
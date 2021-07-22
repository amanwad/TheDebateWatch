import webbrowser, sys, requests, bs4, selenium, json, csv, pprint
# order (Name1, Name2(alphabetically), tournament name, website, prelim wins, prelim losses, out win, out loss
tourney = []

a = open('FinalIndividual.json', 'rt')

indivA = json.load(a)

fullNames = []

lastNames = []


for i in indivA:
    space = i.rindex(' ')
    last = i[space+1:]
    try:
        if fullNames.index(last):
            print('nothing')

    except ValueError:
        fullNames.append(last)


with open('pastLastNames.csv', 'w') as outfile:
    json.dump(fullNames, outfile, indent=2)

import webbrowser, sys, requests, bs4, selenium, json, csv
# order (Name1, Name2(alphabetically), tournament name, website, prelim wins, prelim losses, out win, out loss
tourney = []

f = open('2020-2021 LD Season - 2_22 update.csv', 'rt')
myReader = csv.reader(f)
websites = []
bid_level = []

for row in myReader:
    websites.append(row[0])
    bid_level.append(int(row[1]))


data = {}
data['debaters'] = {}
# running through all the url's for with the different event_id and tourn_id
for x in range(0, len(websites)):
    # souping the results page
    website = websites[x]

    tabroomRes = requests.get(website)

    tabroomSoup = bs4.BeautifulSoup(tabroomRes.text, features="html.parser")

    tournament_name = tabroomSoup.select('div > h2[class="centeralign marno"]')

    year = tabroomSoup.select('div > h5[class="full centeralign marno"]')
    # creates Res object that gives us Tabroom page for a specific tournament. Then, we set it up for parsing.

    tourn = ''
    for elem in tournament_name:
        tourn = elem.text.strip()
    for i in year:
        tourn = tourn + ' - ' + i.text.strip()[:4]




    tabroomElems = tabroomSoup.select('td > a')

    # td > a gives entire element for each team

    tourney = []
    count = 0
    # Going from PF Results Page to Specific Pairing Results Page
    for names in tabroomElems:
        count = count + 1
        if (not(count%2==0)):
            team = []
            if(' ' in names.text.strip()):
                i = names.text.strip().index(' ')
                firstName = str(names.text.strip())
                firstName = firstName[:i]
                secName = str(names.text.strip())
                secName = secName[i + 1:]
                team.append(firstName.strip().upper() + ' ' + secName.strip().upper())
                fullName = firstName.strip().upper() + ' ' + secName.strip().upper()
                team = sorted(team)
                team.append(tourn)
                resultsPage = 'https://www.tabroom.com' + names.get('href')
                # resultsPage sends you to team's record page
                team.append(resultsPage)
                resultsPageRes = requests.get(resultsPage)

                resultsSoup = bs4.BeautifulSoup(resultsPageRes.text, features="html.parser")


                rowElems = resultsSoup.select('div > div[class="row"]')

                # gives a list of integers that delegate dubs and Ls to each round
                listOfJudges = []
                completeList = []
                judgeVars = []
                judgeCounter = 0

                i = 0
                while i < len(rowElems):
                    judgeCounter = 0
                    listOfJudges = rowElems[i].select('span > a[class="white padtop padbottom"]')
                    for elems in listOfJudges:
                        if elems.get('href').find('judge.mhtml') != -1:
                            judgeCounter += 1
                    judgeVars.append(judgeCounter)
                    i += 1

                roundsElems = resultsSoup.select('div > span[class="tenth semibold"]')

                dubsElems = resultsSoup.select('div > span[class="tenth centeralign semibold"]')

                i = 0
                dubsIncrement = 0
                dubsChunk = ''
                while i < len(judgeVars):
                    for inc in range(0, judgeVars[i]):
                        dubsChunk += dubsElems[dubsIncrement].text.strip()
                        dubsIncrement += 1
                    completeList.append(roundsElems[i].text.strip() + ' ' + dubsChunk)
                    dubsChunk = ''
                    i += 1

                if len(roundsElems) > 0:
                    team.append(roundsElems[0].text.strip())

                outRoundWCount = 0
                outRoundLCount = 0
                Wcount = 0
                Lcount = 0
                i = 0

                while i < len(completeList):
                    # first condition checks for byes and second condition checks for coach overs, if true ignores
                    if rowElems[i].text.upper().find('\tBYE\n') != -1 or (judgeVars[i] == 0 and (
                            rowElems[i].text.upper().find('\tPRO\n') or rowElems[i].text.upper().find('\tCON\n'))):
                        pass
                    # checks if a round is an outround, adds to outround counters if true and defaults to prelim counters in the else statement
                    elif completeList[i].count('W') + completeList[i].count('L') > 1:
                        if completeList[i].count('W') > completeList[i].count('L'):
                            outRoundWCount += 1
                        else:
                            outRoundLCount += 1
                    else:
                        if completeList[i].count('W') == 1:
                            Wcount += 1
                        else:
                            Lcount += 1
                    i += 1


                team.append(Wcount)
                team.append(Lcount)
                team.append(outRoundWCount)
                team.append(outRoundLCount)
                if len(roundsElems) > 0:
                    letter = roundsElems[0].text.strip().upper()
                    if 'Strake Jesuit' in tourn:
                        if letter[:1] == 'LDF' and bid_level[x] != 0:
                            team.append('Gold Bid')
                        elif letter[:1] == 'LDS':
                            if bid_level[x] == 2:
                                if outRoundLCount == 0:
                                    team.append('Ghost Bid')
                                else:
                                    team.append('No Bid')
                            else:
                                team.append('Gold Bid')
                        elif letter[:1] == 'LDQ':
                            if bid_level[x] == 4:
                                if outRoundLCount == 0:
                                    team.append('Ghost Bid')
                                else:
                                    team.append('No Bid')
                            elif bid_level[x] == 8 or bid_level[x] == 16:
                                team.append('Gold Bid')
                            else:
                                team.append('No Bid')
                        elif letter[:1] == 'LDO':
                            if bid_level[x] == 16:
                                team.append('Gold Bid')
                            elif bid_level[x] == 8:
                                if outRoundLCount == 0:
                                    team.append('Ghost Bid')
                                else:
                                    team.append('No Bid')
                            else:
                                team.append('No Bid')
                        elif letter[:3] == 'DOU' or letter[:3] == 'DUB' or letter[:3] == 'SEX':
                            if bid_level[x] == 16:
                                if outRoundLCount == 0:
                                    team.append('Ghost Bid')
                                else:
                                    team.append('No Bid')
                            else:
                                team.append('No Bid')
                        else:
                            team.append('No Bid')
                    else:
                        if letter[:1] == 'F' and bid_level[x] != 0:
                            team.append('Gold Bid')
                        elif letter[:1] == 'S' and letter[:3] != 'SEX':
                            if bid_level[x] == 2:
                                if outRoundLCount == 0:
                                    team.append('Ghost Bid')
                                else:
                                    team.append('No Bid')
                            else:
                                team.append('Gold Bid')
                        elif letter[:1] == 'Q':
                            if bid_level[x] == 4:
                                if outRoundLCount == 0:
                                    team.append('Ghost Bid')
                                else:
                                    team.append('No Bid')
                            elif bid_level[x] == 8 or bid_level[x] == 16:
                                team.append('Gold Bid')
                            else:
                                team.append('No Bid')
                        elif letter[:1] == 'O':
                            if bid_level[x] == 16:
                                team.append('Gold Bid')
                            elif bid_level[x] == 8:
                                if outRoundLCount == 0:
                                    team.append('Ghost Bid')
                                else:
                                    team.append('No Bid')
                            else:
                                team.append('No Bid')
                        elif letter[:3] == 'DOU' or letter[:3] == 'DUB' or letter[:3] == 'SEX':
                            if bid_level[x] == 16:
                                if outRoundLCount == 0:
                                    team.append('Ghost Bid')
                                else:
                                    team.append('No Bid')
                            else:
                                team.append('No Bid')
                        else:
                            team.append('No Bid')

                print(team)
                tourney.append(team)
                names = team[0]
                tournament = team[1]

                if (Wcount+Lcount) != 0:
                    if data['debaters'].get(names) == None:
                        data['debaters'][names] = {}

                    if data['debaters'][names].get(tournament) == None:
                        data['debaters'][names][tournament] = {}

                    data['debaters'][names][tournament] = {
                        'url': team[2],
                        'elimround': team[3],
                        'prelimW': str(team[4]),
                        'prelimL': str(team[5]),
                        'outW': str(team[6]),
                        'outL': str(team[7]),
                        'bid': str(team[8])
                    }





with open('2020-2021LD.json', 'w') as outfile:
    json.dump(data, outfile, indent=2)

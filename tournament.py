import webbrowser, sys, requests, bs4, selenium, json
# order (Name1, Name2(alphabetically), tournament name, website, prelim wins, prelim losses, out win, out loss
tourney = []
event_id = [112428, 112209, 109725, 115896, 118026, 97059, 112546, 109862, 109752, 114367, 114083, 119757, 126120, 110369,
            124519, 110928, 110504, 119872, 121400, 118370, 115845, 109577, 110486, 110970, 111543, 116279, 111101,
            121542, 123616, 110776, 126350, 112660, 115669, 114288, 111064, 112518, 110205, 121747, 110220, 112250,
            118814, 119490, 107675, 117267, 96491, 134026, 114036, 111779, 109431, 114904, 106833, 112969,
            121203, 123236, 118568, 123631, 110560, 117141, 129705, 115368, 106335, 115061, 112259, 121546, 113077,
            130390, 110383, 110384]
tourn_id = [13453, 13417, 12918, 13822, 14015, 11596, 13465, 12944, 12924, 13670, 13628, 13222, 14838, 13037, 14695, 13112, 12861,
            14204, 14328, 14049, 13816, 12901, 13057, 13121, 13291, 13850, 13153, 14190, 14471, 13090, 14865, 13474, 13799,
            13652, 13151, 13107, 13005, 14406, 13017, 13422, 14095, 14180, 12602, 13942, 11529, 15530, 13615, 13346,
            12859, 13686, 12515, 13523, 14039, 14556, 14075, 14551, 13065, 13932, 15210, 13689, 12443, 13749, 13423, 13053,
            13536, 15264, 13038, 13038]
bid_level = [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4,
            4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0]

data = {}
data['debaters'] = {}
# running through all the url's for with the different event_id and tourn_id
for x in range(0, len(event_id)):
    # souping the results page
    website = 'https://www.tabroom.com/index/tourn/results/ranked_list.mhtml?event_id=' + str(event_id[x]) + '&tourn_id=' + str(tourn_id[x])

    tabroomRes = requests.get(website)

    tabroomSoup = bs4.BeautifulSoup(tabroomRes.text, features="html.parser")

    tournament_name = tabroomSoup.select('div > h2[class="centeralign marno"]')

    year = tabroomSoup.select('div > h5[class="full centeralign marno"]')
    # creates Res object that gives us Tabroom page for a specific tournament. Then, we set it up for parsing.

    tabroomElems = tabroomSoup.select('td > a')

    # td > a gives entire element for each team

    tourney = []

    # Going from PF Results Page to Specific Pairing Results Page
    for names in tabroomElems:
        team = []
        if(' & ' in names.text):
            i = names.text.index('&')
            firstName = str(names.text)
            firstName = firstName[:i - 1]
            secName = str(names.text)
            secName = secName[i + 2:]
            team.append(firstName.strip().upper())
            team.append(secName.strip().upper())
            team = sorted(team)
            tourn = ''
            for elem in tournament_name:
                tourn = elem.text.strip()
            for i in year:
                tourn = tourn + ' - ' + i.text.strip()[:4]

            if 'Mid America' in tourn:
                badboy1 = " "
                badboy2 = "&"
                spot1 = names.text.rindex(badboy2)
                name1 = names.text[0:spot1 - 1]
                if " " in name1:
                    spot2 = name1.rindex(badboy1)
                    firstName = name1[spot2 + 1:]
                else:
                    i = names.text.index('&')
                    firstName = str(names.text)
                    firstName = firstName[:i - 1]

                team[0] = firstName.strip().upper()
                team[1] = secName.strip().upper()
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
                if letter[:1] == 'F' and bid_level[x] != 0:
                    team.append('Gold Bid')
                elif letter[:1] == 'S' and letter[:3] != 'SEX':
                    if bid_level[x] == 2:
                        if outRoundLCount == 0:
                            team.append('Ghost Bid')
                        else:
                            team.append('Silver Bid')
                    else:
                        team.append('Gold Bid')
                elif letter[:1] == 'Q':
                    if bid_level[x] == 4:
                        if outRoundLCount == 0:
                            team.append('Ghost Bid')
                        else:
                            team.append('Silver Bid')
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
                            team.append('Silver Bid')
                    else:
                        team.append('No Bid')
                elif letter[:3] == 'DOU' or letter[:3] == 'DUB' or letter[:3] == 'SEX':
                    if bid_level[x] == 16:
                        if outRoundLCount == 0:
                            team.append('Ghost Bid')
                        else:
                            team.append('Silver Bid')
                    else:
                        team.append('No Bid')
                else:
                    team.append('No Bid')

            print(team)
            tourney.append(team)
            names = team[0] + ',' + team[1]
            tournament = team[2]

            if (Wcount+Lcount) != 0:
                if data['debaters'].get(names) == None:
                    data['debaters'][names] = {}

                if data['debaters'][names].get(tournament) == None:
                    data['debaters'][names][tournament] = {}

                data['debaters'][names][tournament] = {
                    'url': team[3],
                    'elimround': team[4],
                    'prelimW': str(team[5]),
                    'prelimL': str(team[6]),
                    'outW': str(team[7]),
                    'outL': str(team[8]),
                    'bid': str(team[9])
                }



with open('2019-2020PF.json', 'w') as outfile:
    json.dump(data, outfile, indent=2)
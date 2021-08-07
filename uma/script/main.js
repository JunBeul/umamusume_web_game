function setStart(){
    /*경기장 세팅*/
    var mapDistance = document.getElementById('mapDistance');
    var mapWeather = document.getElementById('mapWeather');

    /*티켓 화면 초기화*/
    ticketCount.innerText=ticket;

    /*마권 건 것 화면 초기화*/
    var contClass = document.getElementsByClassName('cont');
    for(var i = 0;i <= contClass.length-1;i++){
        contClass[i].innerText = "0";
    }

    distance = Math.floor(Math.random()*4);
    weather = Math.floor(Math.random()*4);



    switch(distance){
        case 0 : mapDistance.innerHTML="단거리"; break;
        case 1 : mapDistance.innerHTML="마일"; break;
        case 2 : mapDistance.innerHTML="중거리"; break;
        case 3 : mapDistance.innerHTML="장거리"; break;
        default: return;
    }
    switch(weather){
        case 0 : 
            mapWeather.innerHTML="맑음";
            document.getElementById('map').classList.remove('cloudy','rain','snow');
            document.getElementById('map').classList.add('sunny');
            break;
            case 1 : 
            mapWeather.innerHTML="흐림";
            document.getElementById('map').classList.remove('sunny','rain','snow');
            document.getElementById('map').classList.add('cloudy');
            break;
        case 2 : 
            mapWeather.innerHTML="비";
            document.getElementById('map').classList.remove('cloudy','sunny','snow');
            document.getElementById('map').classList.add('rain');
            break;
        case 3 : 
            mapWeather.innerHTML="눈";
            document.getElementById('map').classList.remove('cloudy','rain','sunny');
            document.getElementById('map').classList.add('snow');
            break;
        default: return;
    }

    /*변수 초기화*/
    umaCount = 0;
    matchResult = [];
    intervalRunAnimation = undefined;
    intervalRunning = undefined;
    final = {};
    rank = [];
    tickingUma = [0,0,0,0,0,0];

    /*말 셋팅*/
    cap = new uma("cap", 2, 1, 3);
    shower = new uma("shower", 1, 3, 2);
    maruzensky = new uma("maruzensky", 0, 0, 0);
    creek = new uma("creek", 1, 2, 0);
    rudolf = new uma("rudolf", 3, 3, 1);
    turbo = new uma("turbo", 0, 1, 0);
    umaIndex = [cap, shower, maruzensky, creek, rudolf, turbo];

    resetUmaInfo(); //말 프로필 카드 세팅
    settings(); //첫 화면 말 방향 셋팅
}

/*첫화면 말 방향 셋팅*/
function settings(){
    temp = "translate(-50%,-80%) translate3d(350px, 325px, 0px) rotateX(-90deg) scaleX(-1)";
    for(let i = 0; i < umaIndex.length; i++){
        document.getElementById(umaIndex[i].umaName+'Move').style.transform = temp
    }
}

/*말 프로필 카드 세팅*/
function resetUmaInfo(){
    for(var i = 0;i <= umaIndex.length-1;i++){
        document.querySelector("#"+umaIndex[i].umaName+"> .oper").innerText = translation("oper", umaIndex[i]);
        document.querySelector("#"+umaIndex[i].umaName+"> .distance").innerText = translation("distance", umaIndex[i]);
        document.querySelector("#"+umaIndex[i].umaName+"> .feel").innerText = translation("feel", umaIndex[i]);
    }

    /*말 예상순위 적용*/
    expectedRanking.sort(function(a, b){
        return b-a;
    });

    for(var i = 0;i<=umaIndex.length-1;i++){
        for(var j = 0;j<=umaIndex.length-1;j++){
            if(umaIndex[i].calStatus == expectedRanking[j]){
                document.querySelector('#'+umaIndex[i].umaName+' > .expected').innerText = j+1;
                document.querySelector('#'+umaIndex[i].umaName+' > .expected').classList.remove('ranking1st','ranking2nd','ranking3rd','Under');
                switch(j){
                    case 0:
                        document.querySelector('#'+umaIndex[i].umaName+' > .expected').classList.add('ranking1st');
                        break;
                    case 1:
                        document.querySelector('#'+umaIndex[i].umaName+' > .expected').classList.add('ranking2nd');
                        break;
                    case 2:
                        document.querySelector('#'+umaIndex[i].umaName+' > .expected').classList.add('ranking3rd');
                        break;
                    default:
                        document.querySelector('#'+umaIndex[i].umaName+' > .expected').classList.add('Under');
                }
                
                break;
            }
        }
    }
}

function translation(type, obj){ //한글번역
    if(type == "oper"){ //작전 한글번역
        switch(obj.umaOper){
            case 0 :
                return "도주";
            case 1 :
                return "선행";
            case 2 :
                return "선입";
            case 3 :
                return "후입";
        }
    } else if(type == "distance"){ //거리 한글번역
        switch(obj.umaDistance){
            case 0 :
                return "단거리";
            case 1 :
                return "마일";
            case 2 :
                return "중거리";
            case 3 :
                return "장거리";
        }
    } else if(type == "feel") { //기분 한글번역
        switch(obj.feel){
            case 0 :
                return "좋음";
            case 1 :
                return "보통";
            case 2 :
                return "나쁨";
        }
    }else{ //이름 한글번역
        switch(obj.umaName){
            case "cap":
                return "오구리 캡";
            case "shower":
                return "라이스 샤워";
            case "maruzensky":
                return "마루젠스키";
            case "creek":
                return "슈퍼 크리크";
            case "rudolf":
                return "심볼리 루돌프";
            case "turbo":
                return "트윈 터보";
        }
    }
}

/*말 초깃값 설정*/
var expectedRanking = [];
var umaCount;
var valueOperSpeed = [500,400,325,275]; //속도
var valueOperStamina = [100,150,240,400]; //스테미나
var valueDistance = 
[[1.1,1,0.95,0.9], /*단거리 [단거리,마일,중거리,장거리]*/
[1,1.1,1,0.95], /*마일 [단거리,마일,중거리,장거리]*/
[0.95,1,1.1,1], /*중거리 [단거리,마일,중거리,장거리]*/
[0.9,0.95,1,1.1]]; /*장거리 [단거리,마일,중거리,장거리]*/
var valueWeather = 
[[1,.975,.9,.9], /*맑음 [맑음, 흐림, 비, 눈]*/
[1,1,.92,.92], /*흐림 [맑음, 흐림, 비, 눈]*/
[1,.975,1,.92], /*비 [맑음, 흐림, 비, 눈]*/
[1,.975,.92,1]]; /*눈 [맑음, 흐림, 비, 눈]*/
function uma(umaName, umaOper, umaDistance, umaWeather){
    //이름
    this.umaName = umaName;
    //위치 값
    this.pos = 0;
    //애니메이션 카운트
    this.motionCont = 0;
    //작전 (고정)
    this.umaOper = umaOper; /* 0:도주 1:선행 2:선입 3:후입 */
    this.umaDistance = umaDistance; /* 0:단거리 1:마일 2:중거리 3:장거리 */
    this.umaWeather = umaWeather; /* 0:맑음 1:흐림 2:비 3:눈 */
    //상태(변동)
    var tempFeel = Math.floor(Math.random()*10);
    switch(tempFeel){ /* 0:좋음 1:보통 2:나쁨 */
        case 0: case 1: case 2: case 3: case 4: case 5: 
            this.feel = 0;
            break;
        case 6: case 7: case 8:
            this.feel = 1;
            break;
        default :
            this.feel = 2;
    }
    //스텟(변동)
    var tempSpeed = Math.random()*51+(valueOperSpeed[umaOper]-25);
    var tempStamina = Math.random()*41+(valueOperStamina[umaOper]-20);
    var tempInt = Math.floor(Math.random()*21+10);
    
    /*this.calStatus = elapsedTime(tempSpeed, tempStamina);
    expectedRanking[umaCount] = this.calStatus;*/

    switch(this.feel){
        case 0 : 
            tempSpeed *= 1;
            tempStamina *= 1;
            tempInt += 10;
            break;
        case 1 : 
            tempSpeed *= .95;
            tempStamina *= .95;
            tempInt += 0;
            break;
        case 2 : 
            tempSpeed *= .9;
            tempStamina *= .9;
            tempInt -= 5;
            break;
    }

    this.calStatus = elapsedTime(tempSpeed, tempStamina);
    expectedRanking[umaCount] = this.calStatus;

    this.speed = tempSpeed*valueDistance[distance][umaOper];
    this.stamina = tempStamina*valueWeather[weather][umaOper];
    this.int = tempInt;
    this.currentRank = 0;
    this.operCount = 0;
    this.operSetting = 0;
    this.skillCount = 0;
    this.skillSetting = 0;
    umaCount++;
}

/*예상순위 계산*/
function elapsedTime(speed, stamina){
    var x = (stamina/0.12);
    var y = (1000-x)*0.2
    return (x*(speed/1000))+y;
}

/*말 목록*/
var cap;
var shower;
var maruzensky;
var creek;
var rudolf;
var turbo;
var umaIndex = [];

/*const umaManage = {
    cap:{
        umaName: "cap",
        umaOper: 1,
        umaDistanceL: 2,
        umaWeather: 3
    },
    shower:{
        umaName: "shower",
        umaOper: 1,
        umaDistanceL: 3,
        umaWeather: 2
    },
    maruzensky:{
        umaName: "maruzensky",
        umaOper: 0,
        umaDistanceL: 0,
        umaWeather: 0
    },
    creek:{
        umaName: "creek",
        umaOper: 1,
        umaDistanceL: 2,
        umaWeather: 0
    },
    rudolf:{
        umaName: "rudolf",
        umaOper: 3,
        umaDistanceL: 3,
        umaWeather: 1
    },
    turbo:{
        umaName: "turbo",
        umaOper: 0,
        umaDistanceL: 1,
        umaWeather: 0
    }
}*/

/*실시간으로 움직이는것들*/
/*움직이는 그림*/
function runAnimation(obj){
    if(final[obj.umaName] != true && !(obj.umaName in final)){
        switch (obj.motionCont){
            case 0 :
                document.querySelector("#"+obj.umaName+"Move").style.backgroundImage="url(img/running/"+obj.umaName+"2.png)";
                obj.motionCont++;
                break;
            case 1 :
                document.querySelector("#"+obj.umaName+"Move").style.backgroundImage="url(img/running/"+obj.umaName+"3.png)";
                obj.motionCont++;
                break;
            case 2 :
                document.querySelector("#"+obj.umaName+"Move").style.backgroundImage="url(img/running/"+obj.umaName+"2.png)";
                obj.motionCont++;
                break;
            default:
                document.querySelector("#"+obj.umaName+"Move").style.backgroundImage="url(img/running/"+obj.umaName+"1.png)";
                obj.motionCont = 0;
                break;
        }
    }
}
var final = {};
var rank = [];
var matchResult = [];
/*진짜로 움직임*/
function running(obj){
    var temp = "";
    skillFun(obj);
    operFun(obj);
    if(final[obj.umaName] != true && !(obj.umaName in final)){
        if(obj.operCount == 0){ //오퍼 미발동 상태
            if(obj.stamina > 0){ //스테미나가 많을때
                obj.pos += obj.speed/1000;
                obj.stamina -= 0.12;
            }else if(obj.stamina < 0){ //스테미나가 0일때
                obj.pos += 0.2;
            }
        }else if(obj.operCount == 1){ //오퍼 발동상태
            obj.pos += obj.speed/1000;
        }
        
        if(obj.pos<125){//직선 //350 -> 475
            temp = "translate3d(" + (obj.pos + 350) + "px, 325px, 0px)"
        }else if(obj.pos < 375){
            temp = "translate3d(" + (475 + Math.sin((obj.pos-375)/250 * Math.PI)*-125) + "px, " + (325-125 + Math.cos((obj.pos-375)/250 * Math.PI)*-125) + "px, 0px)"
        }else if(obj.pos < 625){//직선 //475 -> 225
            temp = "translate3d(" + (850 - obj.pos) + "px, 75px, 0px)"
        }else if(obj.pos < 875){
            temp = "translate3d(" + (225 + Math.sin((obj.pos-875)/250 * Math.PI)*125) + "px, " + (75+125 + Math.cos((obj.pos-875)/250 * Math.PI)*125) + "px, 0px)"
        }else if(obj.pos < 1000){//직선
            temp = "translate3d(" + ((obj.pos-875) + 225) + "px, 325px, 0px)"
        }else{
            final[obj.umaName] = true;
            rank.push(obj.umaName);
            obj.currentRank = rank.length;
            matchResult.push(obj);
            obj.pos = (7-obj.currentRank) * 30;
            temp = "translate3d(" + (obj.pos + 350) + "px, 325px, 0px)";
        }
        temp += " rotateX(-90deg) scaleX(1) translate3d(0px,0px," + ((6-obj.currentRank)*-2) + "px)";
        if(!(250 < obj.pos && obj.pos < 750)){
            temp += " scaleX(-1)";
        }
    }else{
        return;
    }
    document.getElementById(obj.umaName+'Move').style.transform = "translate(-50%,-80%)" + temp;
}

/*스킬*/
function skillFun(obj){
    //캡 스킬 : 승리의 고동
    if(obj.umaName == "cap"){
        if(obj.pos >= 800){
            if(obj.skillCount != 0 && obj.skillSetting > 0){
                obj.speed -= 1;
                obj.skillSetting -= 1;
            }else if(obj.int >= Math.random()*100+1 && obj.skillCount == 0){
                skillEffectView(obj);
                obj.stamina += 50;
                obj.speed += 200;
                obj.skillSetting += 200;
            }
            obj.skillCount++;
        }
    }
    /*if(obj.umaName == "shower" && obj.int >= skillSetting && obj.skillCount ==0){
        skillEffectView(obj);
    }
    if(obj.umaName == "maruzensky" && obj.int >= skillSetting && obj.skillCount ==0){
        skillEffectView(obj);
    }*/

    //크리크 스킬 : 클리어 하트
    if(obj.umaName == "creek"){ 
        if(obj.stamina <= 10){
            if(obj.int >= Math.random()*100+1 && obj.skillCount == 0){
                skillEffectView(obj);
                obj.stamina += 50;
            }
        obj.skillCount++;
        }
    }

    //루돌프 스킬 : 호선의 프로페서
    if(obj.umaName == "rudolf"){
        if(obj.pos >= 640){
            if(obj.skillCount != 0 && obj.skillSetting > 0){
                obj.speed -= 1;
                obj.skillSetting -= 1;
            }else if(obj.int >= Math.random()*100+1 && obj.skillCount == 0){
                skillEffectView(obj);
                obj.stamina += 100;
                obj.speed += 300;
                obj.skillSetting += 300;
            }
            obj.skillCount++;
        }
    }

    //터보 스킬 : 선두 필승!
    if(obj.umaName == "turbo"){
        if(obj.skillCount != 0 && obj.skillSetting > 0){
            obj.speed -= 1;
            obj.skillSetting -= 1;
        }else if(obj.int >= Math.random()*100+1 && obj.skillCount == 0 ){
            skillEffectView(obj);
            obj.speed += 400;
            obj.skillSetting += 400;
        }
        obj.skillCount++;
    }
}

function skillEffectView(obj){
    document.querySelector('.skillEffect').style.bottom="0";
    document.querySelector('.skillEffect').style.backgroundImage="url(img/skill/"+obj.umaName+"Skill.png)";
    setTimeout(function(){
        document.querySelector('.skillEffect').style.bottom="-100%";
    },1000)
}

function operFun(obj){
    //도주
    if(obj.umaOper == 0){
        if(50 > obj.pos && obj.operCount == 0){
            obj.speed += 50;
            obj.operCount = 1;
        } else if(obj.pos >= 50 && obj.operCount == 1){
            obj.operSetting += 50;
            obj.operCount = 0;
        } else if(obj.operSetting > 0 && obj.operCount == 0){
            obj.speed -= 1;
            obj.operSetting -= 1;
        }
    }
    //선행
    if(obj.umaOper == 1){
        if(250 > obj.pos && obj.pos >=200 && obj.operCount == 0){
            obj.speed += 110;
            obj.operCount = 1;
        } else if(obj.pos >= 250 && obj.operCount == 1){
            obj.operSetting += 110;
            obj.operCount = 0;
        }else if(obj.operSetting > 0 && obj.operCount == 0){
            obj.speed -= 1;
            obj.operSetting -= 1;
        }
    }
    //선입
    if(obj.umaOper == 2){
        if(400 > obj.pos && obj.pos >=350 && obj.operCount == 0){
            obj.speed += 150;
            obj.operCount = 1;
        } else if(obj.pos >= 400 && obj.operCount == 1){
            obj.operSetting += 150;
            obj.operCount = 0;
        }else if(obj.operSetting > 0 && obj.operCount == 0){
            obj.speed -= 1;
            obj.operSetting -= 1;
        }
    }
    //후입
    if(obj.umaOper == 3){
        if(500 > obj.pos && obj.pos >=450 && obj.operCount == 0){
            obj.speed += 180;
            obj.operCount = 1;
        } else if(obj.pos >= 500 && obj.operCount == 1){
            obj.operSetting += 180;
            obj.operCount = 0;
        }else if(obj.operSetting > 0 && obj.operCount == 0){
            obj.speed -= 1;
            obj.operSetting -= 1;
        }
    }
}

var running_fun = [];
var intervalRunAnimation;
var intervalRunning;
/*움직이기 시작*/
function init(){
    intervalRunAnimation = setInterval(function(){
        runAnimation(cap),
        runAnimation(shower),
        runAnimation(maruzensky),
        runAnimation(creek),
        runAnimation(rudolf),
        runAnimation(turbo)
    }, 90);
    intervalRunning = setInterval(function(){
        running(cap),
        running(shower),
        running(maruzensky),
        running(creek),
        running(rudolf),
        running(turbo),
        rankingCheck()
    }, 5);

}


var setFinishRank = [];
/*등수 확인*/
function rankingCheck(){
    if(!(rank.length == umaIndex.length)){
        setFinishRank = [];
        for(let i = 0; i < umaIndex.length; i++){
            setFinishRank.push([umaIndex[i].pos,umaIndex[i].umaName]);
        }

        setFinishRank.sort(function(a,b){
            return a[0] - b[0];
        });

        for(let i = 0; i < umaIndex.length; i++){
            for(let j = 0; j < setFinishRank.length; j++){
                if(umaIndex[i].umaName == setFinishRank[j][1]){
                    if(!(umaIndex[i].umaName in final)){
                        umaIndex[i].currentRank = j + 1;
                        break;
                    }
                }
            }
        }
    }else{
        setTimeout(() => finish(), 1000);
        clearInterval(intervalRunAnimation);
        clearInterval(intervalRunning);
    }
}

/*게임 끝*/


function finish(){
    document.querySelector('#first > .umaRankingName').innerText = translation("name", matchResult[0]);
    document.querySelector('#first > .rankingImg').style.backgroundImage="url(img/"+matchResult[0].umaName+"Pro.png)"
    document.querySelector('#second > .umaRankingName').innerText = translation("name", matchResult[1]);
    document.querySelector('#second > .rankingImg').style.backgroundImage="url(img/"+matchResult[1].umaName+"Pro.png)"
    document.querySelector('#third > .umaRankingName').innerText = translation("name", matchResult[2]);
    document.querySelector('#third > .rankingImg').style.backgroundImage="url(img/"+matchResult[2].umaName+"Pro.png)"
    document.querySelector('#fourth > .umaRankingName').innerText = translation("name", matchResult[3]);
    document.querySelector('#fourth > .rankingImg').style.backgroundImage="url(img/"+matchResult[3].umaName+"Pro.png)"
    document.querySelector('#fifth > .umaRankingName').innerText = translation("name", matchResult[4]);
    document.querySelector('#fifth > .rankingImg').style.backgroundImage="url(img/"+matchResult[4].umaName+"Pro.png)"
    document.querySelector('#sixth > .umaRankingName').innerText = translation("name", matchResult[5]);
    document.querySelector('#sixth > .rankingImg').style.backgroundImage="url(img/"+matchResult[5].umaName+"Pro.png)"
    
    ticket += calculateTicket();

    if(ticket == 0){
        document.getElementById('endingBox').style.opacity="1";
        document.getElementById('endingBox').style.display="block";
    } else{
        document.getElementById('finishBox').style.opacity="1";
        document.getElementById('finishBox').style.display="block";
    }
}

/*결과 마권 계산*/
function calculateTicket(){
    var winnerExpectedRanking = expectedRanking.indexOf(matchResult[0].calStatus)+1;
    if(tickingUma[changeNum(matchResult[0].umaName)] != 0){
        return tickingUma[changeNum(matchResult[0].umaName)] * (winnerExpectedRanking==1?2:Math.pow(winnerExpectedRanking,2));
    }else{
        return 0;
    }
    //math.pow(i,2)
}

/*이어하기*/
function continueBut(){
    document.getElementById('finishBox').style.display="none";
    setStart();
    document.getElementById('playBut').classList.remove('playButOn');
    document.getElementById('playBut').classList.add('playButOff');

    for(var i = 0; i<upList.length; i++){
        upList[i].classList.remove('contButOff');
        upList[i].classList.add('contButOn');
    }
}

/*새로하기*/
function replay(){
    location.reload();
}

/*마권*/
var tickingUma = [0,0,0,0,0,0];
var upList = document.getElementsByClassName('up');
var downList = document.getElementsByClassName('down');

function upBut(clickId){
    var clickTick = document.getElementById(clickId).parentNode.parentNode.id;
    var num = Number(changeNum(clickTick));

    if(ticket <= 0){
        clearInterval(autoCount);
    }

    if(ticket > 0){
        ticket--;
        tickingUma[num]++;
        document.getElementById(clickId).previousElementSibling.innerText = tickingUma[num];
        ticketCount.innerText = String(ticket);
        document.getElementById('playBut').classList.remove('playButOff');
        document.getElementById('playBut').classList.add('playButOn');
        if(tickingUma[num] > 0){
            downList[num].classList.remove('contButOff');
            downList[num].classList.add('contButOn');
        }
        if(ticket == 0){
            for(var i = 0; i<upList.length; i++){
                upList[i].classList.add('contButOff');
                upList[i].classList.remove('contButOn');
            }
        }
    }
}
function downBut(clickId){
    var clickTick = document.getElementById(clickId).parentNode.parentNode.id;
    var num = Number(changeNum(clickTick));

    if(tickingUma[num] <= 0){
        clearInterval(autoCount);
    }

    if(tickingUma[num] > 0){
        ticket++;
        tickingUma[num]--;
        document.getElementById(clickId).nextElementSibling.innerText = tickingUma[num];
        ticketCount.innerText = String(ticket);
        if(tickingUma[num] == 0){
            downList[num].classList.add('contButOff');
            downList[num].classList.remove('contButOn');
        }
        if(ticket > 0){
            for(var i = 0; i<upList.length; i++){
                upList[i].classList.remove('contButOff');
                upList[i].classList.add('contButOn');
            }
        }
        var sumTickingUma = tickingUma.reduce((a,b) => (a+b));
        if(sumTickingUma == 0){
            document.getElementById('playBut').classList.add('playButOff');
            document.getElementById('playBut').classList.remove('playButOn');
        }
    }
    
}

var timer;
var istrue = false;
var autoCount;
function upButHolding(clickId){
    istrue = true;
    timer = setTimeout(function(){
        holding("up", clickId);
    }, 1000);
}

function downButHolding(clickId){
    istrue = true;
    timer = setTimeout(function(){
        holding("down", clickId);
    }, 1000);
}

function holding(value, clickId){
    if(timer){
        clearTimeout(timer);
    }
    if(istrue){
        autoCount = setInterval(function(){
            if(value == "up"){
                upBut(clickId);
            }else if(value == "down"){
                downBut(clickId);
            }
        },50);
    }
}

function holdCancel(){
    istrue = false;
    clearInterval(autoCount);
}

function changeNum(getName){
    for(var i = 0;i <= umaIndex.length-1;i++){
        if(getName == umaIndex[i].umaName){
            return i;
        }
    }
}

/*시작*/
var ticket = 0;
var distance = 0; /* 경기장 - 0:단거리 1:마일 2:중거리 3:장거리 */
var weather = 0; /* 경기장 - 0:맑음 1:흐림 2:비 3:눈 */

window.onload = function () {
    var ticketCount = document.getElementById('ticketCount');
    ticket = 5;

    setStart();
}

/*플레이 버튼 클릭*/
function play(){
    init();
    document.getElementById('playBut').classList.add('playButOff');
    document.getElementById('playBut').classList.remove('playButOn');
    for(var i = 0; i<upList.length; i++){
        upList[i].classList.add('contButOff');
        upList[i].classList.remove('contButOn');
        downList[i].classList.add('contButOff');
        downList[i].classList.remove('contButOn');
    }
}
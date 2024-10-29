const apiURL = 'https://api.pokemontcg.io/v2/cards';

const startCard = document.getElementById('Poke-Card');
const startCard2nd = document.getElementById('Poke-Card2');
const cardList = document.getElementById('card-list');
const cardDisplay = document.getElementById('card-display');
const CardPack = document.getElementById('CardPack');
const loadingScreen = document.getElementById('Loading-Screen');
const Bag = document.getElementById('Bag');

let FinalCards = [];
let total = 0;
let current = 0;
async function getCard(rarity, Numcards) {
    try {
        const response = await fetch(`${apiURL}?q=rarity:"${rarity}"`);
        const result = await response.json();
        

        // console.log(result.data[0]);
        // console.log(result.data[0].images.large);
        
        const shuffle = result.data.sort(() => 0.5 - Math.random());
        const PokemonCard = shuffle.filter(card => card.images.large != null).slice(0, Numcards);

        // console.log(PokemonCard)
        
        PokemonCard.forEach(card => {
            FinalCards.push({card, rarity}); 
        });
        
    } catch (error) {
        console.error("Error fetching filtered cards:", error);
        document.getElementById('card-list').innerHTML = 'Failed to load Pokemon cards.';
    }
}

function nextCard() {
    
    current++; 

    if (current < FinalCards.length) {
        displayCards();
    } else {
        alert("You've viewed all the cards! Earned: $" + total.toFixed(2) + ".\nContinue to open more packs!!!");
        startCard.src = '../images/pokemon-card.jpg';
        startCard2nd.style.display = 'flex';
    }
}


function CardInfo(){
    const clickedCard = this.src;

    const tempImage = document.getElementById("large-image");
    const tempdiv = document.getElementById("card-Image");

    if (tempImage && tempdiv) {
        tempImage.src = clickedCard;
        tempImage.style.display = "block";
        tempdiv.style.display = "flex";

        tempdiv.addEventListener("click", function () {
            tempImage.style.display = "none";
            tempdiv.style.display = "none"; 
        }, { once: true }); 

    } else {
        console.error("No pokemon in display");
    }
}



function displayCards() {

    // cardList.innerHTML = '';
 
    let tempCard = ''
    let displayCard = '';


    const currentTemp = FinalCards[current];
    
    if (currentTemp){
        const card = currentTemp.card;
        const rarity = currentTemp.rarity;


        const prices = card.tcgplayer && card.tcgplayer.prices;
        const priceKeys = Object.keys(prices);
        const cardOptions = priceKeys.filter(key => prices[key].market != null);

        const temprare = Math.floor(Math.random() * cardOptions.length);

        //For common/uncommon cards:
        if (rarity === 'Common' || rarity === 'Uncommon'){
            if(card.tcgplayer && card.tcgplayer.prices && card.tcgplayer.prices.normal && card.tcgplayer.prices.normal.market != null){
            tempCard += `<img src="${card.images.large}" alt="${card.name}" class="card-click">
                <p>Market Price: $${card.tcgplayer.prices.normal.market}</p>`;
                total += card.tcgplayer.prices.normal.market;
            }
            else{
            tempCard += `<img src="${card.images.large}" alt="${card.name}" class="card-click">
            <p>Market Price [${cardOptions[temprare]}]: $${card.tcgplayer.prices[cardOptions[temprare]].market}</p>`;
            total += card.tcgplayer.prices[cardOptions[temprare]].market;
            }
        }else{  //other rarities
            tempCard += `<img src="${card.images.large}" alt="${card.name}" class="card-click">
            <p>Market Price [${cardOptions[temprare]}]: $${card.tcgplayer.prices[cardOptions[temprare]].market}</p>`;
            total += card.tcgplayer.prices[cardOptions[temprare]].market;
        }


        // <p>Markey Price: ${card.tcgplayer.prices.normal.market}</p>
        // <p>Markey Price: ${card.tcgplayer.prices.holofoil.market}</p>

    // displayCard += '<p>cards</p>'

       
        
        cardList.innerHTML =  tempCard;

        displayCard = `<li><img src="${card.images.large}" alt="${card.name}" class = 'card-image'>
        </li>`;
        cardDisplay.innerHTML += displayCard;


        document.querySelectorAll(".card-image").forEach(cardImg => {
            cardImg.addEventListener("click", CardInfo);
        });



        const cardEle = document.querySelectorAll('.card-click');
        cardEle.forEach(card => {
            card.addEventListener('click', nextCard);
        });
        } else {
            console.log("No current card available.");
        
        }

}





const probabilities = {
    "Amazing Rare": 0.01,
    // "Common": 0.50,
    "LEGEND": 0.005,
    "Promo": 0.01,
    "Rare": 0.10,
    "Rare ACE": 0.01,
    "Rare BREAK": 0.01,
    "Rare Holo": 0.05,
    "Rare Holo EX": 0.01,
    "Rare Holo GX": 0.01,
    "Rare Holo LV.X": 0.01,
    "Rare Holo Star": 0.01,
    "Rare Holo V": 0.01,
    "Rare Holo VMAX": 0.01,
    "Rare Prime": 0.01,
    "Rare Prism Star": 0.01,
    "Rare Rainbow": 0.005,
    "Rare Secret": 0.01,
    "Rare Shining": 0.005,
    "Rare Shiny": 0.01,
    "Rare Shiny GX": 0.01,
    "Rare Ultra": 0.01,
    // "Uncommon": 0.30
};

async function draw9and10(){
    let prob = 0
    const card9Probability = Math.random()
    let notcommons = false;
    for (const [cardT, probability] of Object.entries(probabilities)) {
        prob += probability;

        if (card9Probability < prob) {
            await getCard(cardT, 1);
            notcommons = true
            break;
        }
    }

    if (notcommons === false){
        await getCard("Rare", 1);
    }
}



const startPack = async () => {
    total = 0;
    current = 0; 
    FinalCards = [];
    cardDisplay.innerHTML = '';
    cardList.innerHTML = '';
    CardPack.style.display = "none";
    startCard2nd.style.display = "none";

    startCard.src = '';
    startCard.style.display = 'none';
    Bag.style.display = 'none';
    loadingScreen.style.display = 'flex';

    await getCard('Common', 5);
    await getCard('Uncommon', 3);
    await draw9and10();
    await draw9and10();

    CardPack.style.display = "flex";
    Bag.style.display = 'block';
    loadingScreen.style.display = "none";

    displayCards();
}


startCard.addEventListener("click", startPack);
startCard2nd.addEventListener("click", startPack);

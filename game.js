
class House {
    constructor(dataString) {

        // loop through data string...
        // .. save rooms to this. rooms...

        // rooms[0, 0] = new Room(0, 0, 'A', '1');
        // rooms[0, 1] = new Room (0, 1, 'C', 'e');
        // rooms[0,4] = new Room(0, 4, '0', '0'); //nullroom

        this.dataString = dataString;

        // Grab first char in string representing grid size
        this.gridSize = parseInt(dataString.charAt(0));

        // Create multidimensional array with given size
        let rooms = [[]];
        for (let i=0; i<this.gridSize; i++) {
            rooms[i] = [];
            for (let j=0; j < this.gridSize; j++) {
                rooms[i].push(new Room([0,0],'P','0'));
            }
        }

        // List of Items
        this.gameItems = {
            'key': {'description': 'A key made of steel. Unlocks any non-colored door.', 'takeable': true},
            'red key': {'description': 'A red key made of steel. Unlocks red doors.','takeable': true},
            'green key': {'description': 'A green key made of steel. Unlocks red doors.','takeable': true},
            'blue key': {'description': 'A blue key made of steel. Unlocks red doors.','takeable': true},
            'chest': {'description': 'A locked chest. Wonder what\'s inside?!','takeable': false},
            'orb of conclusion': {'description': 'A floating, glowing orb that will teleport someone to safety','takeable': false},
            'Item6': {'description': ' ','takeable': false},
            'Item7': {'description': ' ','takeable': false},
            'Item8': {'description': ' ','takeable': false}
        };

        this.rooms = rooms;
        this.roomDataLength = this.dataString.length-3;
        this.gridCoords = [0, 0];
        console.log(this.gridSize);
        console.log(this.rooms);
        this.createHouse();
    }
    // Create the player at the starting position
    createPlayer() {
        return new Player(parseInt(this.dataString.charAt(1)), parseInt(this.dataString.charAt(2)));
    }

    // get the nth next char

    isCapital(c) {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXY";
        return (letters.indexOf(c) != -1);
    }

    nextRoomCoordinates() {
        if (this.gridCoords[1] < this.gridSize-1) {
            this.gridCoords[1]++;
        }
        else {
            this.gridCoords[0]++;
            this.gridCoords[1] = 0;
        }
        return this.gridCoords;
    }

    putItemInItem(container, items, currentRoom){
        for (const item of items) {
            switch(item) {
                // Red Key
                case "!":   container.push("Key");  break;
                // Red Key
                case "@":   container.push("Red Key");  break;
                // Green Key
                case "#":   container.push("Green Key"); break;
                // Blue Key
                case "$":   container.push("Blue Key"); break;
                // -
                case "!":   container.push("Kazoo");  break;
                // -
                case "^":   container.push("Carrot Cake"); break;
                // -
                case "&":   container.push("Android");  break;
                // -
                case "*":   container.push("Orb of Conclusion"); break;
                // -
                case "?":   container.push("Mystery Item"); break;
                // Default case
                default: break;
            }
        }
        return container;
    }

    createHouse() {
        // Todo: Giant interpreter

        for (let i=3; i<=this.roomDataLength+1; i++) {
            let skips = 0;
            let char = this.dataString.charAt(i);
            let nextChar = this.dataString.charAt(i+1);
            let hexes = "0123456789abcde";

            let isCapital = this.isCapital(char);

            if (isCapital) {
                let currentRoom = this.rooms[this.gridCoords[0]][this.gridCoords[1]];
                currentRoom.coords = this.gridCoords;
                currentRoom.setDoorLocations(char);
                currentRoom.setLockedDoors(nextChar);

                let j = ++i;
                while (!this.isCapital(this.dataString.charAt(j))) {
                    skips++;
                    switch(this.dataString.charAt(j)) {
                        // Key
                        case "!":   currentRoom.items.push("Key");  break;
                        // Red Key: @XYD
                        case "@":
                            currentRoom.items.push("Red Key");
                            // I think these lines set the locked door of a room meant to be opened by this key
                            //this.rooms[this.dataString.charAt(j+2)][this.dataString.charAt(j+1)].lockedDoors[this.dataString.charAt(j+3)] = '2';
                            //skips += 3;
                            break;
                        // Green Key
                        case "#":
                            currentRoom.items.push("Green Key");
                            // See case @
                            // this.rooms[this.dataString.charAt(j+2)][this.dataString.charAt(j+1)].lockedDoors[this.dataString.charAt(j+3)] = '3';
                            // skips += 3;
                            break;
                        // Blue Key
                        case "$":
                            currentRoom.items.push("Blue Key");
                            // See case @
                            // this.rooms[this.dataString.charAt(j+2)][this.dataString.charAt(j+1)].lockedDoors[this.dataString.charAt(j+3)] = '4';
                            // skips += 3;
                            break;
                        // Chest
                        case "%":
                            j++;
                            skips++;
                            let chest = ["Chest"];
                            let chestItems = [];
                            while (this.dataString.charAt(j) != ">") {
                                chestItems.push(this.dataString.charAt(j));
                                j++;
                                skips++;
                            }
                            chest = this.putItemInItem(chest, chestItems, currentRoom);
                            currentRoom.items.push(chest);
                            break;
                        // -
                        case "^":   currentRoom.items.push("Carrot Cake"); break;
                        // -
                        case "&":   currentRoom.items.push("Android");  break;
                        // Orb of Conclusion
                        case "*":   currentRoom.items.push("Orb of Conclusion"); break;
                        // -
                        case "?":   currentRoom.items.push("Mystery Item"); break;
                        // Default case
                        default: break;
                    }
                    j++
                }
                this.nextRoomCoordinates();
            }
            skips -= 1;
            i += skips;
            console.log('skips', this.dataString.charAt(i));
        }
    }
}

class Room {
    constructor(coords) {
        this.coords = coords.slice();
        this.roomLetter;
        this.hexChar;

        // door locations
        // [top, right, bottom, left]
        this.doorLocations = [0, 0, 0, 0];

        // are doors locked?
        // [top, right, bottom, left]
        this.lockedDoors = [0, 0, 0, 0];
        this.items = [];
}

    setDoorLocations(letter) {
        let letters = "ABCDEFGHIJKLMNOP";
        let position = letters.indexOf(letter);
        let binStr = position.toString(2);
        binStr = ('0000'+binStr).slice(-4);

        let doorLocations = [];

        for (let i = 0; i < 4; i++) {
            doorLocations[i] = binStr[i];
        }

        this.roomLetter = letter;
        this.doorLocations = doorLocations;
    }

    // returns an array containing bools of which doors are locked
    // per a single hex value
    setLockedDoors(hex) {
        let lockedDoors = [];
        let binStr = parseInt(hex, 16).toString(2)
        binStr = ('0000'+binStr).slice(-4);

        for (let i = 0; i < 4; i++) {
            lockedDoors[i] = binStr[i];
        }

        this.hexChar = hex;
        this.lockedDoors = lockedDoors;
    }

    description() {
        addGameData("<br />\n<br />\nThere are doors to your: ");
        if (player.roomPlayerOccupies.doorLocations[0] == 1) addGameData("  North  ");
        if (player.roomPlayerOccupies.doorLocations[1] == 1) addGameData("  East  ");
        if (player.roomPlayerOccupies.doorLocations[2] == 1) addGameData("  South  ");
        if (player.roomPlayerOccupies.doorLocations[3] == 1) addGameData("  West  ");
        addGameData("<br />\n");
        if (this.items.length > 0) {
            addGameData("...and this room contains: ");
            for (let item of this.items) {
                if (item instanceof Array) {
                    addGameData("<br />\n" + item[0]);
                }
                else {
                    addGameData("<br />\n" + item);
                }
            }
        }
        else {
            addGameData("...and this room is emtpy.");
        }
    }
}

class Player {
    constructor(y, x) {
        this.pos = {y: y, x: x};
        // [name][amount]
        this.inventory = [[]];
        this.roomPlayerOccupies = house.rooms[this.pos.y][this.pos.x];
    }

    doSomething(commands) {
        let words = commands.split(" ");
        for(var i = 0; i < words.length; i++) {
            words[i] = words[i].toLowerCase().replace(/[^a-z0-9]/g, '');
        }
        switch (words[0]) {
            case "bleep":
                player.roomPlayerOccupies.lockedDoors[1] = '0';
                house.rooms[player.pos.y][player.pos.x+1].lockedDoors[3] = '0';
                break;
            case "help":
            case "commands":
                addGameData("<br />\nList of commands:<br />\n Type help to get to this menu");
                break;

            case "go":
            case "move":
            case "walk":
                if (words[1] == 'north') this.canGo('north');
                else if (words[1] == 'east') this.canGo('east');
                else if (words[1] == 'south') this.canGo('south');
                else if (words[1] == 'west') this.canGo('west');
                break;

            case "search":
            case "examine":
                // Allow examination of any items
                let slice = words.slice(1).join(" ");
                if (words[1] == "room" || words[1] == null) {
                    player.roomPlayerOccupies.description();
                }
                else if (slice in house.gameItems) {
                    addGameData("<br />\n" + house.gameItems[slice]['description']);
                }
                else {
                    addGameData("<br />\nThere is no " + slice +" in this room.");
                }

                // Only allow examination of things in the current room
                //
                // let slice = words.slice(1).join(" ");
                // if (words[1] == "room" || words[1] == null) {
                //     player.roomPlayerOccupies.description();
                // }
                // else if (slice in house.gameItems
                //             && player.roomPlayerOccupies.items.indexOf(toTitleCase(slice)) != -1) {
                //     addGameData("<br />\n" + house.gameItems[slice]['description']);
                // }
                // else {
                //     let flag = 0;
                //     for (let item of player.roomPlayerOccupies.items) {
                //         if (item instanceof Array) {
                //             if (item[0] == toTitleCase(slice)) {
                //                 addGameData("<br />\n" + house.gameItems[slice]['description']);
                //                 flag = 1;
                //             }
                //         }
                //     }
                //     if (flag == 0) {
                //         addGameData("There is no " + slice +" in this room.");
                //     }
                // }
                break;

            case "use":
                // Todo
                break;

            case "take":
                let slice2 = words.slice(1).join(" ");
                // If it's a real item in the game
                // and you can take the item
                if (slice2 in house.gameItems
                            && player.roomPlayerOccupies.items.indexOf(toTitleCase(slice2)) != -1
                            && house.gameItems[slice2]['takeable'] == true) {
                    let itemExists = false;
                    let index;
                    for (let i = 0; i < player.inventory.length; i++) {
                        if (player.inventory[i][0] == toTitleCase(slice2)) {
                            itemExists = true;
                            index = i;
                        }
                    }
                    if (itemExists) {
                        player.inventory[index][1]++;
                    }
                    else {
                        player.inventory.push([toTitleCase(slice2),1]);
                    }
                    player.roomPlayerOccupies.items.remove(toTitleCase(slice2));
                    addGameData("<br />\nYou took the " + toTitleCase(slice2) + "!");
                    player.roomPlayerOccupies.description();
                }
                // If you can't take the item
                else if (slice2 in house.gameItems
                            && house.gameItems[slice2]['takeable'] == false) {
                    let flag2 = 0;
                    for (let item of player.roomPlayerOccupies.items) {
                        if (item instanceof Array) {
                            if (item[0] == toTitleCase(slice2)) {
                                addGameData("<br />\nYou can't take the " + slice2 +".");
                                flag2 = 1;
                            }
                        }
                    }
                    if (flag2 == 0) addGameData("<br />\nThere is no " + slice2 +" in this room.");
                }
                // If it's not real or not in room
                else {
                    addGameData("<br />\nThere is no " + slice2 +" in this room.");
                }
                break;

            case "inventory":
            case "items":
                player.listInventory();
                break;

            case "position":
            case "location":
            case "where":
            addGameData("<br />\nYour current coordinates are (" + this.pos.x + "," + this.pos.y +").");
                break;
            default:
                break;
        }
    }

    // top, right, bottom, left
    canGo(direction) {
        let door;
        switch (direction.toLowerCase()) {
            case "north":
                this.door = 0;
                break;
            case "east":
                this.door = 1;
                break;
            case "south":
                this.door = 2;
                break;
            case "west":
                this.door = 3;
                break;
            default:
                break;
        }

        console.log('this.door', this.door);
        // go north
        if (this.door == 0
            && this.pos.y > 0
            && this.roomPlayerOccupies.doorLocations[this.door] == 1
            && house.rooms[this.pos.y-1][this.pos.x].doorLocations[2] == 1) {

            if (house.rooms[this.pos.y-1][this.pos.x].lockedDoors[2] < 1) {
                this.pos.x = this.pos.x;
                this.pos.y = this.pos.y-1;
                addGameData("<br />\n<br />\nYou moved North to ("  + this.pos.x + "," + this.pos.y + ")!");
                this.roomPlayerOccupies = house.rooms[this.pos.y][this.pos.x];
                this.roomPlayerOccupies.description();
                console.log('go north ' + this.pos.x + " " + this.pos.y);
            }
            else {
                switch (this.roomPlayerOccupies.lockedDoors[this.door].toString()) {
                    case '1': addGameData("<br />\nThat door is locked!"); break;
                    case '2': addGameData("<br />\nThat door is Red and locked!"); break;
                    case '3': addGameData("<br />\nThat door is Green and locked!"); break;
                    case '4': addGameData("<br />\nThat door is Blue and locked!"); break;
                }
            }
        }
        // go east
        else if (this.door == 1
                && this.pos.x < house.gridSize-1
                && this.roomPlayerOccupies.doorLocations[this.door] == 1
                && house.rooms[this.pos.y][this.pos.x+1].doorLocations[3] == 1) {

                if (this.roomPlayerOccupies.lockedDoors[this.door] < 1
                        && house.rooms[this.pos.y][this.pos.x+1].lockedDoors[3] < 1) {
                    this.pos.x = this.pos.x+1;
                    this.pos.y = this.pos.y;
                    addGameData("<br />\n<br />\nYou moved East to (" + this.pos.x + "," + this.pos.y + ")!");
                    this.roomPlayerOccupies = house.rooms[this.pos.y][this.pos.x];
                    this.roomPlayerOccupies.description();
                    console.log('go east ' + this.pos.x + " " + this.pos.y);
                }
                else {
                    switch (this.roomPlayerOccupies.lockedDoors[this.door]) {
                        case '1': addGameData("<br />\nThat door is locked!"); break;
                        case '2': addGameData("<br />\nThat door is Red and locked!"); break;
                        case '3': addGameData("<br />\nThat door is Green and locked!"); break;
                        case '4': addGameData("<br />\nThat door is Blue and locked!"); break;
                    }
                }
        }
        // go south
        else if (this.door == 2
            && this.pos.y < house.gridSize-1
            && this.roomPlayerOccupies.doorLocations[this.door] == 1
            && house.rooms[this.pos.y+1][this.pos.x].doorLocations[0] == 1) {

            if (house.rooms[this.pos.y+1][this.pos.x].lockedDoors[0] < 1) {
                this.pos.x = this.pos.x;
                this.pos.y = this.pos.y+1;
                addGameData("<br />\n<br />\nYou moved South to (" + this.pos.x + "," + this.pos.y + ")!");
                this.roomPlayerOccupies = house.rooms[this.pos.y][this.pos.x];
                this.roomPlayerOccupies.description();
                console.log('go south ' + this.pos.x + " " + this.pos.y);
            }
            else {
                switch (this.roomPlayerOccupies.lockedDoors[this.door]) {
                    case '1': addGameData("<br />\nThat door is locked!"); break;
                    case '2': addGameData("<br />\nThat door is Red and locked!"); break;
                    case '3': addGameData("<br />\nThat door is Green and locked!"); break;
                    case '4': addGameData("<br />\nThat door is Blue and locked!"); break;
                }
            }
        }
        // 0 not locked
        // 1 locked
        // 2,3,4 - red, g, b
        // go west

        // Is there a door in the west?
        else if (this.door == 3
            && this.pos.x > 0
            && this.roomPlayerOccupies.doorLocations[this.door] == 1
            && house.rooms[this.pos.y][this.pos.x-1].doorLocations[1] == 1) {

            // If it's unlocked
            if (this.roomPlayerOccupies.lockedDoors[this.door] < 1 // current room unlocked
                    && house.rooms[this.pos.y][this.pos.x-1].lockedDoors[1] < 1) { // other room unlocked
                this.pos.x = this.pos.x-1;
                this.pos.y = this.pos.y;
                addGameData("<br />\n<br />\nYou moved West to (" + this.pos.x + "," + this.pos.y + ")!");
                this.roomPlayerOccupies = house.rooms[this.pos.y][this.pos.x];
                this.roomPlayerOccupies.description();
                console.log('go west ' + this.pos.x + " " + this.pos.y);
            }
            // Oops, it's locked
            else {
                switch (this.roomPlayerOccupies.lockedDoors[this.door]) {
                    case '1': addGameData("<br />\nThat door is locked!"); break;
                    case '2': addGameData("<br />\nThat door is Red and locked!"); break;
                    case '3': addGameData("<br />\nThat door is Green and locked!"); break;
                    case '4': addGameData("<br />\nThat door is Blue and locked!"); break;
                }
            }
        }
        else {
            addGameData("<br />\n<br />\nThere's no door in that direction!");
        }
    }

    listInventory() {
        addGameData("<br />\nYou are carrying:")
        for (const item of this.inventory) {
            addGameData("<br />\n(" + item[1] + ") " + item[0] + " -   " + house.gameItems[item[0].toLowerCase()]['description']);
        }
    }
}

// dataString parts:
//  - size, player position, rooms&doors, ...

let house;
let player;

// On Ready
// window.onload = function() { }
$(function() {
    house = new House('500F5#%@#$>&*B1#*C2#!^&*E4%$$$>%##>@$&?F5!^');
    player = house.createPlayer();
    player.inventory = ["Red Key", "Blue Key"];

    console.log(house);
    console.log(player);
});

/*

room with a door locked
key is in room

how do you link a key to a door

A, B, C = where the doors are

hex = 0000 to 1111 - which doors are locked

500A1CeF0BAEe

=-=-=-=-=-=-=-=
   THE STRING
=-=-=-=-=-=-=-=
 - (length/width)
 - (player coordinates)
     - (Capital letter--door locations)
     - (hex char--locked doors)
 - (symbol -- items)
 - (greater than symbol (>) -- item in item)
 - (capital letter -- next room)
 - loop all over again



=-=-=-=-=-=-=-=
    Items
=-=-=-=-=-=-=-=
- Keys: @#$ = Red, Green, Blue keys
    (symbol)(door coordinates)
- Chest: %
- Letter opener / Knife : _
- Letter / Note / Puzzle Question:
- A Shiny Orb: *
-
- Half-eaten tuna sandwich
- Carrot Cake: ^
- Android: &
-
-

=-=-=-=-=-=-=-=
    Commands
=-=-=-=-=-=-=-=
 - go (move?) x
 - search x
    - room: description of room
 - take x
 - use x on y
 - help
 - inventory
 - position

 =-=-=-=-=-=-=-=
   time clock
 =-=-=-=-=-=-=-=
 - 11/27 10:00 PM
   - 2 hr
 - 11/28 5:04 PM
   - 1 hr 43 mins 33 seconds
 - 11/28 10:00 PM
   - 3 hr
 - 11/30 8:00 PM
   - 2 hr

























*/

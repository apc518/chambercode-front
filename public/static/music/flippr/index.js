var notesInput = document.getElementById("notesinput");
var axisInput = document.getElementById("axisinput");
var para = document.getElementById("para");
notesInput.focus();

var noteToNum = {"B#":0, "C":0, "Dbb":0,"C#":1, "Db":1, "Bx":1, "D":2,"Cx":2,"Ebb":2, "D#":3, "Eb":3, "Fbb":3, "E":4, "Dx":4, "Fb":4, "E#":5, "F":5, "Gbb":5, "F#":6, "Gb":6, "Ex":6, "G":7, "Fx":7, "Abb":7, "G#":8, "Ab":8, "A":9, "Gx":9, "Bbb":9, "A#":10, "Bb":10, "Cbb":10, "B":11, "Cb":11, "Ax":11};
var numToNote = {0:"C", 1:"Db", 2:"D", 3:"Eb", 4:"E", 5:"F", 6:"Gb", 7:"G", 8:"Ab", 9:"A", 10:"Bb", 11:"B"};
var lowerNoteToNum = {"c":0,"d":2,"e":4,"f":5,"g":7,"a":9,"b":11};
var togRevCommands = ["toggle_reverse","tog_rev","toggle_rev","tog_reverse","tr","t_r"];
var easterEggs = {"hello":"hi","how are you":"very well, thanks","how are you?":"very well, thanks","bananas":"are pretty good ngl","potato":"potahto","potatoe":"potahtoe","test":"what are you testing! get back to flipping","the lick is overused":"you're overused","the licc is overused":"you're overused"}

var doReverse = true;

function toggleRev(){
    if(doReverse){
        doReverse = false;
    }
    else{
        doReverse = true;
    }
    para.innerText = para.innerText.split(" ").reverse("").join(" ");
    return false;
}

function handleInput(){
    if(notesInput.value === ""){
        return false;
    }
    if(notesInput.value.toLowerCase() in easterEggs){
        para.innerText = easterEggs[notesInput.value.toLowerCase()];
        return false;
    }
    if(axisInput.value === "" && checkNotes(notesInput.value) === "valid"){
        if(doReverse){
            para.innerText = parseInput(notesInput.value).reverse().join(" ");
        }
        else{
            para.innerText = parseInput(notesInput.value).join(" ");
        }
    }
    else{
        para.innerText = flippedScale(notesInput.value, axisInput.value);
    }
    return false;
}

function showHelp(){
    /**
     * Note:
     * reason why only two axes are allowed:
     * if you input two axes, it really is just one axis: the midpoint.
     * With three axes, you could get a midpoint that isn't a quartertone, and then the flips could go outside of 12-tet.
     */
    Swal.fire({
        title: "Some flippin' help!",
        html: `
            <ul style=\"text-align: left;\">
            <li>Note names A-G are supported, with accidental symbols b, #, bb, and x.</li><br/>
            <li>Lowercase letters are discouraged but can be used.</li><br/>
            <li>Only 1-2 axes are allowed.</li><br/>
            <li>No axis input means the notes will not be flipped, however the "reverse output" switch will still apply.</li><br/>
            </ul>
        `,
        icon: "info",
        confirmButtonText: "Cool!"
    });
}

function indexOfMinValue(arr){
    if (arr.length === 0) {
        return -1;
    }
    var min = arr[0];
    var minIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }
    return minIndex;
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
}

function flipNotes(notes, axes){
    var axisNum = 0;
    var axesTotal = 0;
    for(var note of axes){
        axesTotal += noteToNum[note];
    }
    axisNum = axesTotal / axes.length;

    var noteNumList = [];
    for (var note of notes){
        noteNumList.push(noteToNum[note]);
    }
    if (doReverse){
        noteNumList.reverse();
    }
    for (var i = 0; i < noteNumList.length; i++){
        noteNumList[i] = (2 * axisNum - noteNumList[i]).mod(12);
    }

    var noteStrList = [];
    for (var noteNum of noteNumList){
        noteStrList.push(numToNote[noteNum]);
    }
    return noteStrList;
}

function flippedScale(notesStr, axisStr){
    if(!(checkNotes(notesStr) === "valid")){
        return checkNotes(notesStr);
    }
    else if(!(checkAxes(axisStr) === "valid")){
        return checkAxes(axisStr);
    }
    else{
        return flipNotes(parseInput(notesStr), parseInput(axisStr)).join(" ");
    }
}

function parseInput(userinput){
    userinput = userinput + "--";
    notes = [];
    for(var i = 0; i < userinput.length - 2; i++){
        if((userinput.charAt(i) + userinput.charAt(i+1) + userinput.charAt(i+2)) in noteToNum){
            notes.push(userinput.charAt(i) + userinput.charAt(i+1) + userinput.charAt(i+2));
        }
        else if((userinput.charAt(i) + userinput.charAt(i+1)) in noteToNum){
            notes.push(userinput.charAt(i) + userinput.charAt(i+1));
        }
        else if(userinput.charAt(i) in noteToNum){
            notes.push(userinput.charAt(i).toString());
        }
    }
    //if no valid capitals are found, look for lowercase letters
    if(notes.length === 0){
        for(var i = 0; i < userinput.length - 2; i++){
            if(userinput.charAt(i) in lowerNoteToNum){
                notes.push(userinput.charAt(i).toUpperCase());
            }
        }
    }
    return notes;
}

function checkNotes(userinput){
    if(parseInput(userinput).length < 1){
        return "invalid input: click help for more info";
    }
    else{
        return "valid";
    }
}
function checkAxes(userinput){
    if(parseInput(userinput).length < 1){
        return "invalid input: click help for more info";
    }
    else if(parseInput(userinput).length > 2){
        return "maximum of 2 axes allowed";
    }
    else{
        return "valid";
    }
}
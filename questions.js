var stem_directions = {
    'treble': 1,
    'bass': -1
};

function createCardFor(clef, note, noteAnswer) {
    return {
        "question": {"render": function() {
                         $('.question').html('<div id="music-container"></div>');
                         var element = $('.question #music-container')[0];
                         $('.question #music-container').css('background-color', '#fff');
                         $('.question #music-container').height(200);
                         $('question #music-container').width(400);
                         var renderer = new Vex.Flow.Renderer(element, Vex.Flow.Renderer.Backends.SVG);
                         renderer.resize(400, 200);
                         var context = renderer.getContext();
                         var stave = new Vex.Flow.Stave(50, 40, 100);
                         stave.addClef(clef);
                         stave.setContext(context).draw();
                         var notes = [
                             new Vex.Flow.StaveNote({clef: clef, keys: [note], duration: "q", stem_direction: stem_directions[clef] })];
                         var voice = new Vex.Flow.Voice({num_beats: 1,  beat_value: 4});
                         voice.addTickables(notes);
                         var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 400);
                         voice.draw(context, stave);
                     }},
        "answer": noteAnswer
    };
}

var flashcards = 
    {
        "Bass Clef":
        [
            createCardFor("bass", "F/2", 41),
            createCardFor("bass", "G/2", 43),
            createCardFor("bass", "A/2", 45),
            createCardFor("bass", "B/2", 47),
            createCardFor("bass", "C/3", 48),
            createCardFor("bass", "D/3", 50),
            createCardFor("bass", "E/3", 52),
            createCardFor("bass", "F/3", 53),
            createCardFor("bass", "G/3", 55),
            createCardFor("bass", "A/3", 57),
            createCardFor("bass", "B/3", 59),
            createCardFor("bass", "C/4", 60)
        ],
        "Treble Clef":
        [
           createCardFor("treble", "C/4", 60),
           createCardFor("treble", "D/4", 62),
           createCardFor("treble", "E/4", 64),
           createCardFor("treble", "F/4", 65),
           createCardFor("treble", "G/4", 67),
           createCardFor("treble", "A/4", 69),
           createCardFor("treble", "B/4", 71),
           createCardFor("treble", "C/5", 72),
           createCardFor("treble", "D/5", 74),
           createCardFor("treble", "E/5", 76),
           createCardFor("treble", "F/5", 77),
           createCardFor("treble", "G/5", 79)
        ]
    };


function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

var questionCallbacks = {};

var currentQuestion = null;

var currentNote = null;
var audioContext = new AudioContext;
function initializeCallbacks(callbacks) {
    questionCallbacks = callbacks;
}

addHook('initialize', initializeCallbacks);

addHook('changeQuestion', function(nextQuestion) {
            currentQuestion = nextQuestion;
        });

var midiOff = 128;
var midiOn = 144;

function playNote(midiNote) {
    var frequency = frequencyFromNoteNumber(midiNote);

    oscillator = audioContext.createOscillator();
    oscillator.frequency.value = frequency;
    
    oscillator.connect(audioContext.destination);
    
    oscillator.start(0);
    currentNote = oscillator;
}

function stopCurrentNote() {
    if (currentNote) {
        currentNote.stop(0);
    }
}

function midiMessageReceived(message) {
    var action = message.data[0];
    var note = message.data[1];
    console.log("message data:");
    console.log(message.data);
    console.log(currentQuestion);
    if(currentQuestion != null) {
        if(action == midiOn) {
            console.log("currentQuestion.rawAnswer: " + currentQuestion.rawAnswer + " note: " + note);
            stopCurrentNote();
            playNote(note);
            if (currentQuestion.rawAnswer == note){
                console.log("They're the same.");
                questionCallbacks.showCorrect();   
            } else {
                console.log("They're not the same.");
                questionCallbacks.showWrong();
            }
        }
        else if (action == midiOff) {
            questionCallbacks.nextQuestion();
            stopCurrentNote();
        }
    }
}

function turnOnTheMidi() {
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(function(midi) {
                var inputs = midi.inputs.values();
                // loop through all inputs
                for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                    input.value.onmidimessage = midiMessageReceived;
                }
            },
            function(e) {alert("Something weird happened.  You have no midi!");});
} else {
    alert("No MIDI support in your browser.");
}
}
turnOnTheMidi();



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
            createCardFor("bass", "F/2", "F"),
            createCardFor("bass", "G/2", "G"),
            createCardFor("bass", "A/2", "A"),
            createCardFor("bass", "B/2", "B"),
            createCardFor("bass", "C/3", "C"),
            createCardFor("bass", "D/3", "D"),
            createCardFor("bass", "E/3", "E"),
            createCardFor("bass", "F/3", "F"),
            createCardFor("bass", "G/3", "G"),
            createCardFor("bass", "A/3", "A"),
            createCardFor("bass", "B/3", "B"),
            createCardFor("bass", "C/4", "C")
        ],
        "Treble Clef":
        [
           createCardFor("treble", "C/4", "C"),
           createCardFor("treble", "D/4", "D"),
           createCardFor("treble", "E/4", "E"),
           createCardFor("treble", "F/4", "F"),
           createCardFor("treble", "G/4", "G"),
           createCardFor("treble", "A/4", "A"),
           createCardFor("treble", "B/4", "B"),
           createCardFor("treble", "C/5", "C"),
           createCardFor("treble", "D/5", "D"),
           createCardFor("treble", "E/5", "E"),
           createCardFor("treble", "F/5", "F"),
           createCardFor("treble", "G/5", "G"),
           createCardFor("treble", "B/3", "B")
        ]
    };
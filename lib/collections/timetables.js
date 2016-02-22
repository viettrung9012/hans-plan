Timetables = new Mongo.Collection('timetables');

TimetablesSchema = new SimpleSchema({
    owner: {
        type: String,
        label: "owner",
        optional: false
    },
    items: {
        type: Array,
        label: "Timetable items",
        optional: false
    },
    "items.$": {
        type: Object
    },
    "items.$.id": {
        type: String,
        optional: false
    },
    "items.$.title": {
        type: String,
        optional: false
    },
    "items.$.duration": {
        type: Number,
        optional: false
    },
    "items.$.day": {
        type: Number,
        optional: false
    },
    "items.$.start": {
        type: Number,
        optional: false
    },
    "items.$.playlistId": {
        type: String,
        optional: false
    }
});

Timetables.attachSchema(TimetablesSchema);

/*eslint-disable*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const draw = $root.draw = (() => {

    /**
     * Namespace draw.
     * @exports draw
     * @namespace
     */
    const draw = {};

    draw.JoinEvent = (function() {

        /**
         * Properties of a JoinEvent.
         * @memberof draw
         * @interface IJoinEvent
         * @property {string|null} [pin] JoinEvent pin
         * @property {string|null} [uuid] JoinEvent uuid
         * @property {string|null} [name] JoinEvent name
         */

        /**
         * Constructs a new JoinEvent.
         * @memberof draw
         * @classdesc Represents a JoinEvent.
         * @implements IJoinEvent
         * @constructor
         * @param {draw.IJoinEvent=} [properties] Properties to set
         */
        function JoinEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JoinEvent pin.
         * @member {string} pin
         * @memberof draw.JoinEvent
         * @instance
         */
        JoinEvent.prototype.pin = "";

        /**
         * JoinEvent uuid.
         * @member {string} uuid
         * @memberof draw.JoinEvent
         * @instance
         */
        JoinEvent.prototype.uuid = "";

        /**
         * JoinEvent name.
         * @member {string} name
         * @memberof draw.JoinEvent
         * @instance
         */
        JoinEvent.prototype.name = "";

        /**
         * Creates a new JoinEvent instance using the specified properties.
         * @function create
         * @memberof draw.JoinEvent
         * @static
         * @param {draw.IJoinEvent=} [properties] Properties to set
         * @returns {draw.JoinEvent} JoinEvent instance
         */
        JoinEvent.create = function create(properties) {
            return new JoinEvent(properties);
        };

        /**
         * Encodes the specified JoinEvent message. Does not implicitly {@link draw.JoinEvent.verify|verify} messages.
         * @function encode
         * @memberof draw.JoinEvent
         * @static
         * @param {draw.IJoinEvent} message JoinEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pin != null && message.hasOwnProperty("pin"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.pin);
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.uuid);
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified JoinEvent message, length delimited. Does not implicitly {@link draw.JoinEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof draw.JoinEvent
         * @static
         * @param {draw.IJoinEvent} message JoinEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JoinEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JoinEvent message from the specified reader or buffer.
         * @function decode
         * @memberof draw.JoinEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {draw.JoinEvent} JoinEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.draw.JoinEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.pin = reader.string();
                    break;
                case 2:
                    message.uuid = reader.string();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a JoinEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof draw.JoinEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {draw.JoinEvent} JoinEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JoinEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JoinEvent message.
         * @function verify
         * @memberof draw.JoinEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JoinEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pin != null && message.hasOwnProperty("pin"))
                if (!$util.isString(message.pin))
                    return "pin: string expected";
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                if (!$util.isString(message.uuid))
                    return "uuid: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a JoinEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof draw.JoinEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {draw.JoinEvent} JoinEvent
         */
        JoinEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.draw.JoinEvent)
                return object;
            let message = new $root.draw.JoinEvent();
            if (object.pin != null)
                message.pin = String(object.pin);
            if (object.uuid != null)
                message.uuid = String(object.uuid);
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a JoinEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof draw.JoinEvent
         * @static
         * @param {draw.JoinEvent} message JoinEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JoinEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.pin = "";
                object.uuid = "";
                object.name = "";
            }
            if (message.pin != null && message.hasOwnProperty("pin"))
                object.pin = message.pin;
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                object.uuid = message.uuid;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this JoinEvent to JSON.
         * @function toJSON
         * @memberof draw.JoinEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JoinEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return JoinEvent;
    })();

    draw.StartGameEvent = (function() {

        /**
         * Properties of a StartGameEvent.
         * @memberof draw
         * @interface IStartGameEvent
         * @property {number|null} [numberRounds] StartGameEvent numberRounds
         * @property {number|null} [roundSeconds] StartGameEvent roundSeconds
         */

        /**
         * Constructs a new StartGameEvent.
         * @memberof draw
         * @classdesc Represents a StartGameEvent.
         * @implements IStartGameEvent
         * @constructor
         * @param {draw.IStartGameEvent=} [properties] Properties to set
         */
        function StartGameEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StartGameEvent numberRounds.
         * @member {number} numberRounds
         * @memberof draw.StartGameEvent
         * @instance
         */
        StartGameEvent.prototype.numberRounds = 0;

        /**
         * StartGameEvent roundSeconds.
         * @member {number} roundSeconds
         * @memberof draw.StartGameEvent
         * @instance
         */
        StartGameEvent.prototype.roundSeconds = 0;

        /**
         * Creates a new StartGameEvent instance using the specified properties.
         * @function create
         * @memberof draw.StartGameEvent
         * @static
         * @param {draw.IStartGameEvent=} [properties] Properties to set
         * @returns {draw.StartGameEvent} StartGameEvent instance
         */
        StartGameEvent.create = function create(properties) {
            return new StartGameEvent(properties);
        };

        /**
         * Encodes the specified StartGameEvent message. Does not implicitly {@link draw.StartGameEvent.verify|verify} messages.
         * @function encode
         * @memberof draw.StartGameEvent
         * @static
         * @param {draw.IStartGameEvent} message StartGameEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartGameEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.numberRounds != null && message.hasOwnProperty("numberRounds"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.numberRounds);
            if (message.roundSeconds != null && message.hasOwnProperty("roundSeconds"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.roundSeconds);
            return writer;
        };

        /**
         * Encodes the specified StartGameEvent message, length delimited. Does not implicitly {@link draw.StartGameEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof draw.StartGameEvent
         * @static
         * @param {draw.IStartGameEvent} message StartGameEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartGameEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StartGameEvent message from the specified reader or buffer.
         * @function decode
         * @memberof draw.StartGameEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {draw.StartGameEvent} StartGameEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StartGameEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.draw.StartGameEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.numberRounds = reader.int32();
                    break;
                case 2:
                    message.roundSeconds = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StartGameEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof draw.StartGameEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {draw.StartGameEvent} StartGameEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StartGameEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StartGameEvent message.
         * @function verify
         * @memberof draw.StartGameEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StartGameEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.numberRounds != null && message.hasOwnProperty("numberRounds"))
                if (!$util.isInteger(message.numberRounds))
                    return "numberRounds: integer expected";
            if (message.roundSeconds != null && message.hasOwnProperty("roundSeconds"))
                if (!$util.isInteger(message.roundSeconds))
                    return "roundSeconds: integer expected";
            return null;
        };

        /**
         * Creates a StartGameEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof draw.StartGameEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {draw.StartGameEvent} StartGameEvent
         */
        StartGameEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.draw.StartGameEvent)
                return object;
            let message = new $root.draw.StartGameEvent();
            if (object.numberRounds != null)
                message.numberRounds = object.numberRounds | 0;
            if (object.roundSeconds != null)
                message.roundSeconds = object.roundSeconds | 0;
            return message;
        };

        /**
         * Creates a plain object from a StartGameEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof draw.StartGameEvent
         * @static
         * @param {draw.StartGameEvent} message StartGameEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StartGameEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.numberRounds = 0;
                object.roundSeconds = 0;
            }
            if (message.numberRounds != null && message.hasOwnProperty("numberRounds"))
                object.numberRounds = message.numberRounds;
            if (message.roundSeconds != null && message.hasOwnProperty("roundSeconds"))
                object.roundSeconds = message.roundSeconds;
            return object;
        };

        /**
         * Converts this StartGameEvent to JSON.
         * @function toJSON
         * @memberof draw.StartGameEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StartGameEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StartGameEvent;
    })();

    draw.PlayerRoundStartEvent = (function() {

        /**
         * Properties of a PlayerRoundStartEvent.
         * @memberof draw
         * @interface IPlayerRoundStartEvent
         * @property {string|null} [uuid] PlayerRoundStartEvent uuid
         * @property {number|null} [roundNumber] PlayerRoundStartEvent roundNumber
         * @property {number|null} [roundSeconds] PlayerRoundStartEvent roundSeconds
         * @property {Array.<string>|null} [words] PlayerRoundStartEvent words
         */

        /**
         * Constructs a new PlayerRoundStartEvent.
         * @memberof draw
         * @classdesc Represents a PlayerRoundStartEvent.
         * @implements IPlayerRoundStartEvent
         * @constructor
         * @param {draw.IPlayerRoundStartEvent=} [properties] Properties to set
         */
        function PlayerRoundStartEvent(properties) {
            this.words = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerRoundStartEvent uuid.
         * @member {string} uuid
         * @memberof draw.PlayerRoundStartEvent
         * @instance
         */
        PlayerRoundStartEvent.prototype.uuid = "";

        /**
         * PlayerRoundStartEvent roundNumber.
         * @member {number} roundNumber
         * @memberof draw.PlayerRoundStartEvent
         * @instance
         */
        PlayerRoundStartEvent.prototype.roundNumber = 0;

        /**
         * PlayerRoundStartEvent roundSeconds.
         * @member {number} roundSeconds
         * @memberof draw.PlayerRoundStartEvent
         * @instance
         */
        PlayerRoundStartEvent.prototype.roundSeconds = 0;

        /**
         * PlayerRoundStartEvent words.
         * @member {Array.<string>} words
         * @memberof draw.PlayerRoundStartEvent
         * @instance
         */
        PlayerRoundStartEvent.prototype.words = $util.emptyArray;

        /**
         * Creates a new PlayerRoundStartEvent instance using the specified properties.
         * @function create
         * @memberof draw.PlayerRoundStartEvent
         * @static
         * @param {draw.IPlayerRoundStartEvent=} [properties] Properties to set
         * @returns {draw.PlayerRoundStartEvent} PlayerRoundStartEvent instance
         */
        PlayerRoundStartEvent.create = function create(properties) {
            return new PlayerRoundStartEvent(properties);
        };

        /**
         * Encodes the specified PlayerRoundStartEvent message. Does not implicitly {@link draw.PlayerRoundStartEvent.verify|verify} messages.
         * @function encode
         * @memberof draw.PlayerRoundStartEvent
         * @static
         * @param {draw.IPlayerRoundStartEvent} message PlayerRoundStartEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerRoundStartEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uuid);
            if (message.roundNumber != null && message.hasOwnProperty("roundNumber"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.roundNumber);
            if (message.roundSeconds != null && message.hasOwnProperty("roundSeconds"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.roundSeconds);
            if (message.words != null && message.words.length)
                for (let i = 0; i < message.words.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.words[i]);
            return writer;
        };

        /**
         * Encodes the specified PlayerRoundStartEvent message, length delimited. Does not implicitly {@link draw.PlayerRoundStartEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof draw.PlayerRoundStartEvent
         * @static
         * @param {draw.IPlayerRoundStartEvent} message PlayerRoundStartEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerRoundStartEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerRoundStartEvent message from the specified reader or buffer.
         * @function decode
         * @memberof draw.PlayerRoundStartEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {draw.PlayerRoundStartEvent} PlayerRoundStartEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerRoundStartEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.draw.PlayerRoundStartEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uuid = reader.string();
                    break;
                case 2:
                    message.roundNumber = reader.int32();
                    break;
                case 3:
                    message.roundSeconds = reader.int32();
                    break;
                case 4:
                    if (!(message.words && message.words.length))
                        message.words = [];
                    message.words.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PlayerRoundStartEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof draw.PlayerRoundStartEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {draw.PlayerRoundStartEvent} PlayerRoundStartEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerRoundStartEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerRoundStartEvent message.
         * @function verify
         * @memberof draw.PlayerRoundStartEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerRoundStartEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                if (!$util.isString(message.uuid))
                    return "uuid: string expected";
            if (message.roundNumber != null && message.hasOwnProperty("roundNumber"))
                if (!$util.isInteger(message.roundNumber))
                    return "roundNumber: integer expected";
            if (message.roundSeconds != null && message.hasOwnProperty("roundSeconds"))
                if (!$util.isInteger(message.roundSeconds))
                    return "roundSeconds: integer expected";
            if (message.words != null && message.hasOwnProperty("words")) {
                if (!Array.isArray(message.words))
                    return "words: array expected";
                for (let i = 0; i < message.words.length; ++i)
                    if (!$util.isString(message.words[i]))
                        return "words: string[] expected";
            }
            return null;
        };

        /**
         * Creates a PlayerRoundStartEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof draw.PlayerRoundStartEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {draw.PlayerRoundStartEvent} PlayerRoundStartEvent
         */
        PlayerRoundStartEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.draw.PlayerRoundStartEvent)
                return object;
            let message = new $root.draw.PlayerRoundStartEvent();
            if (object.uuid != null)
                message.uuid = String(object.uuid);
            if (object.roundNumber != null)
                message.roundNumber = object.roundNumber | 0;
            if (object.roundSeconds != null)
                message.roundSeconds = object.roundSeconds | 0;
            if (object.words) {
                if (!Array.isArray(object.words))
                    throw TypeError(".draw.PlayerRoundStartEvent.words: array expected");
                message.words = [];
                for (let i = 0; i < object.words.length; ++i)
                    message.words[i] = String(object.words[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a PlayerRoundStartEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof draw.PlayerRoundStartEvent
         * @static
         * @param {draw.PlayerRoundStartEvent} message PlayerRoundStartEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerRoundStartEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.words = [];
            if (options.defaults) {
                object.uuid = "";
                object.roundNumber = 0;
                object.roundSeconds = 0;
            }
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                object.uuid = message.uuid;
            if (message.roundNumber != null && message.hasOwnProperty("roundNumber"))
                object.roundNumber = message.roundNumber;
            if (message.roundSeconds != null && message.hasOwnProperty("roundSeconds"))
                object.roundSeconds = message.roundSeconds;
            if (message.words && message.words.length) {
                object.words = [];
                for (let j = 0; j < message.words.length; ++j)
                    object.words[j] = message.words[j];
            }
            return object;
        };

        /**
         * Converts this PlayerRoundStartEvent to JSON.
         * @function toJSON
         * @memberof draw.PlayerRoundStartEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerRoundStartEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PlayerRoundStartEvent;
    })();

    /**
     * Colour enum.
     * @name draw.Colour
     * @enum {string}
     * @property {number} RED=0 RED value
     * @property {number} ORANGE=1 ORANGE value
     * @property {number} YELLOW=2 YELLOW value
     * @property {number} GREEN=3 GREEN value
     * @property {number} BLUE=4 BLUE value
     * @property {number} PURPLE=5 PURPLE value
     * @property {number} PINK=6 PINK value
     * @property {number} PALE=7 PALE value
     * @property {number} BROWN=8 BROWN value
     * @property {number} BLACK=9 BLACK value
     * @property {number} GREY=10 GREY value
     * @property {number} WHITE=11 WHITE value
     */
    draw.Colour = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "RED"] = 0;
        values[valuesById[1] = "ORANGE"] = 1;
        values[valuesById[2] = "YELLOW"] = 2;
        values[valuesById[3] = "GREEN"] = 3;
        values[valuesById[4] = "BLUE"] = 4;
        values[valuesById[5] = "PURPLE"] = 5;
        values[valuesById[6] = "PINK"] = 6;
        values[valuesById[7] = "PALE"] = 7;
        values[valuesById[8] = "BROWN"] = 8;
        values[valuesById[9] = "BLACK"] = 9;
        values[valuesById[10] = "GREY"] = 10;
        values[valuesById[11] = "WHITE"] = 11;
        return values;
    })();

    draw.DrawEvent = (function() {

        /**
         * Properties of a DrawEvent.
         * @memberof draw
         * @interface IDrawEvent
         * @property {draw.DrawEvent.Type|null} [type] DrawEvent type
         * @property {draw.Colour|null} [colour] DrawEvent colour
         * @property {number|null} [size] DrawEvent size
         * @property {number|null} [fromX] DrawEvent fromX
         * @property {number|null} [fromY] DrawEvent fromY
         * @property {number|null} [toX] DrawEvent toX
         * @property {number|null} [toY] DrawEvent toY
         */

        /**
         * Constructs a new DrawEvent.
         * @memberof draw
         * @classdesc Represents a DrawEvent.
         * @implements IDrawEvent
         * @constructor
         * @param {draw.IDrawEvent=} [properties] Properties to set
         */
        function DrawEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DrawEvent type.
         * @member {draw.DrawEvent.Type} type
         * @memberof draw.DrawEvent
         * @instance
         */
        DrawEvent.prototype.type = 0;

        /**
         * DrawEvent colour.
         * @member {draw.Colour} colour
         * @memberof draw.DrawEvent
         * @instance
         */
        DrawEvent.prototype.colour = 0;

        /**
         * DrawEvent size.
         * @member {number} size
         * @memberof draw.DrawEvent
         * @instance
         */
        DrawEvent.prototype.size = 0;

        /**
         * DrawEvent fromX.
         * @member {number} fromX
         * @memberof draw.DrawEvent
         * @instance
         */
        DrawEvent.prototype.fromX = 0;

        /**
         * DrawEvent fromY.
         * @member {number} fromY
         * @memberof draw.DrawEvent
         * @instance
         */
        DrawEvent.prototype.fromY = 0;

        /**
         * DrawEvent toX.
         * @member {number} toX
         * @memberof draw.DrawEvent
         * @instance
         */
        DrawEvent.prototype.toX = 0;

        /**
         * DrawEvent toY.
         * @member {number} toY
         * @memberof draw.DrawEvent
         * @instance
         */
        DrawEvent.prototype.toY = 0;

        /**
         * Creates a new DrawEvent instance using the specified properties.
         * @function create
         * @memberof draw.DrawEvent
         * @static
         * @param {draw.IDrawEvent=} [properties] Properties to set
         * @returns {draw.DrawEvent} DrawEvent instance
         */
        DrawEvent.create = function create(properties) {
            return new DrawEvent(properties);
        };

        /**
         * Encodes the specified DrawEvent message. Does not implicitly {@link draw.DrawEvent.verify|verify} messages.
         * @function encode
         * @memberof draw.DrawEvent
         * @static
         * @param {draw.IDrawEvent} message DrawEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DrawEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.colour != null && message.hasOwnProperty("colour"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.colour);
            if (message.size != null && message.hasOwnProperty("size"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.size);
            if (message.fromX != null && message.hasOwnProperty("fromX"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.fromX);
            if (message.fromY != null && message.hasOwnProperty("fromY"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.fromY);
            if (message.toX != null && message.hasOwnProperty("toX"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.toX);
            if (message.toY != null && message.hasOwnProperty("toY"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.toY);
            return writer;
        };

        /**
         * Encodes the specified DrawEvent message, length delimited. Does not implicitly {@link draw.DrawEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof draw.DrawEvent
         * @static
         * @param {draw.IDrawEvent} message DrawEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DrawEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DrawEvent message from the specified reader or buffer.
         * @function decode
         * @memberof draw.DrawEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {draw.DrawEvent} DrawEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DrawEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.draw.DrawEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.colour = reader.int32();
                    break;
                case 3:
                    message.size = reader.int32();
                    break;
                case 4:
                    message.fromX = reader.int32();
                    break;
                case 5:
                    message.fromY = reader.int32();
                    break;
                case 6:
                    message.toX = reader.int32();
                    break;
                case 7:
                    message.toY = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DrawEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof draw.DrawEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {draw.DrawEvent} DrawEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DrawEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DrawEvent message.
         * @function verify
         * @memberof draw.DrawEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DrawEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.colour != null && message.hasOwnProperty("colour"))
                switch (message.colour) {
                default:
                    return "colour: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    break;
                }
            if (message.size != null && message.hasOwnProperty("size"))
                if (!$util.isInteger(message.size))
                    return "size: integer expected";
            if (message.fromX != null && message.hasOwnProperty("fromX"))
                if (!$util.isInteger(message.fromX))
                    return "fromX: integer expected";
            if (message.fromY != null && message.hasOwnProperty("fromY"))
                if (!$util.isInteger(message.fromY))
                    return "fromY: integer expected";
            if (message.toX != null && message.hasOwnProperty("toX"))
                if (!$util.isInteger(message.toX))
                    return "toX: integer expected";
            if (message.toY != null && message.hasOwnProperty("toY"))
                if (!$util.isInteger(message.toY))
                    return "toY: integer expected";
            return null;
        };

        /**
         * Creates a DrawEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof draw.DrawEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {draw.DrawEvent} DrawEvent
         */
        DrawEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.draw.DrawEvent)
                return object;
            let message = new $root.draw.DrawEvent();
            switch (object.type) {
            case "BRUSH":
            case 0:
                message.type = 0;
                break;
            case "FILL":
            case 1:
                message.type = 1;
                break;
            }
            switch (object.colour) {
            case "RED":
            case 0:
                message.colour = 0;
                break;
            case "ORANGE":
            case 1:
                message.colour = 1;
                break;
            case "YELLOW":
            case 2:
                message.colour = 2;
                break;
            case "GREEN":
            case 3:
                message.colour = 3;
                break;
            case "BLUE":
            case 4:
                message.colour = 4;
                break;
            case "PURPLE":
            case 5:
                message.colour = 5;
                break;
            case "PINK":
            case 6:
                message.colour = 6;
                break;
            case "PALE":
            case 7:
                message.colour = 7;
                break;
            case "BROWN":
            case 8:
                message.colour = 8;
                break;
            case "BLACK":
            case 9:
                message.colour = 9;
                break;
            case "GREY":
            case 10:
                message.colour = 10;
                break;
            case "WHITE":
            case 11:
                message.colour = 11;
                break;
            }
            if (object.size != null)
                message.size = object.size | 0;
            if (object.fromX != null)
                message.fromX = object.fromX | 0;
            if (object.fromY != null)
                message.fromY = object.fromY | 0;
            if (object.toX != null)
                message.toX = object.toX | 0;
            if (object.toY != null)
                message.toY = object.toY | 0;
            return message;
        };

        /**
         * Creates a plain object from a DrawEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof draw.DrawEvent
         * @static
         * @param {draw.DrawEvent} message DrawEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DrawEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "BRUSH" : 0;
                object.colour = options.enums === String ? "RED" : 0;
                object.size = 0;
                object.fromX = 0;
                object.fromY = 0;
                object.toX = 0;
                object.toY = 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.draw.DrawEvent.Type[message.type] : message.type;
            if (message.colour != null && message.hasOwnProperty("colour"))
                object.colour = options.enums === String ? $root.draw.Colour[message.colour] : message.colour;
            if (message.size != null && message.hasOwnProperty("size"))
                object.size = message.size;
            if (message.fromX != null && message.hasOwnProperty("fromX"))
                object.fromX = message.fromX;
            if (message.fromY != null && message.hasOwnProperty("fromY"))
                object.fromY = message.fromY;
            if (message.toX != null && message.hasOwnProperty("toX"))
                object.toX = message.toX;
            if (message.toY != null && message.hasOwnProperty("toY"))
                object.toY = message.toY;
            return object;
        };

        /**
         * Converts this DrawEvent to JSON.
         * @function toJSON
         * @memberof draw.DrawEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DrawEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Type enum.
         * @name draw.DrawEvent.Type
         * @enum {string}
         * @property {number} BRUSH=0 BRUSH value
         * @property {number} FILL=1 FILL value
         */
        DrawEvent.Type = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "BRUSH"] = 0;
            values[valuesById[1] = "FILL"] = 1;
            return values;
        })();

        return DrawEvent;
    })();

    draw.ScoreUpdateEvent = (function() {

        /**
         * Properties of a ScoreUpdateEvent.
         * @memberof draw
         * @interface IScoreUpdateEvent
         * @property {string|null} [uuid] ScoreUpdateEvent uuid
         * @property {number|null} [scoreChange] ScoreUpdateEvent scoreChange
         */

        /**
         * Constructs a new ScoreUpdateEvent.
         * @memberof draw
         * @classdesc Represents a ScoreUpdateEvent.
         * @implements IScoreUpdateEvent
         * @constructor
         * @param {draw.IScoreUpdateEvent=} [properties] Properties to set
         */
        function ScoreUpdateEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ScoreUpdateEvent uuid.
         * @member {string} uuid
         * @memberof draw.ScoreUpdateEvent
         * @instance
         */
        ScoreUpdateEvent.prototype.uuid = "";

        /**
         * ScoreUpdateEvent scoreChange.
         * @member {number} scoreChange
         * @memberof draw.ScoreUpdateEvent
         * @instance
         */
        ScoreUpdateEvent.prototype.scoreChange = 0;

        /**
         * Creates a new ScoreUpdateEvent instance using the specified properties.
         * @function create
         * @memberof draw.ScoreUpdateEvent
         * @static
         * @param {draw.IScoreUpdateEvent=} [properties] Properties to set
         * @returns {draw.ScoreUpdateEvent} ScoreUpdateEvent instance
         */
        ScoreUpdateEvent.create = function create(properties) {
            return new ScoreUpdateEvent(properties);
        };

        /**
         * Encodes the specified ScoreUpdateEvent message. Does not implicitly {@link draw.ScoreUpdateEvent.verify|verify} messages.
         * @function encode
         * @memberof draw.ScoreUpdateEvent
         * @static
         * @param {draw.IScoreUpdateEvent} message ScoreUpdateEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScoreUpdateEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uuid);
            if (message.scoreChange != null && message.hasOwnProperty("scoreChange"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.scoreChange);
            return writer;
        };

        /**
         * Encodes the specified ScoreUpdateEvent message, length delimited. Does not implicitly {@link draw.ScoreUpdateEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof draw.ScoreUpdateEvent
         * @static
         * @param {draw.IScoreUpdateEvent} message ScoreUpdateEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScoreUpdateEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ScoreUpdateEvent message from the specified reader or buffer.
         * @function decode
         * @memberof draw.ScoreUpdateEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {draw.ScoreUpdateEvent} ScoreUpdateEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScoreUpdateEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.draw.ScoreUpdateEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uuid = reader.string();
                    break;
                case 2:
                    message.scoreChange = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ScoreUpdateEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof draw.ScoreUpdateEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {draw.ScoreUpdateEvent} ScoreUpdateEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScoreUpdateEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ScoreUpdateEvent message.
         * @function verify
         * @memberof draw.ScoreUpdateEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ScoreUpdateEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                if (!$util.isString(message.uuid))
                    return "uuid: string expected";
            if (message.scoreChange != null && message.hasOwnProperty("scoreChange"))
                if (!$util.isInteger(message.scoreChange))
                    return "scoreChange: integer expected";
            return null;
        };

        /**
         * Creates a ScoreUpdateEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof draw.ScoreUpdateEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {draw.ScoreUpdateEvent} ScoreUpdateEvent
         */
        ScoreUpdateEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.draw.ScoreUpdateEvent)
                return object;
            let message = new $root.draw.ScoreUpdateEvent();
            if (object.uuid != null)
                message.uuid = String(object.uuid);
            if (object.scoreChange != null)
                message.scoreChange = object.scoreChange | 0;
            return message;
        };

        /**
         * Creates a plain object from a ScoreUpdateEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof draw.ScoreUpdateEvent
         * @static
         * @param {draw.ScoreUpdateEvent} message ScoreUpdateEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ScoreUpdateEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.uuid = "";
                object.scoreChange = 0;
            }
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                object.uuid = message.uuid;
            if (message.scoreChange != null && message.hasOwnProperty("scoreChange"))
                object.scoreChange = message.scoreChange;
            return object;
        };

        /**
         * Converts this ScoreUpdateEvent to JSON.
         * @function toJSON
         * @memberof draw.ScoreUpdateEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ScoreUpdateEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ScoreUpdateEvent;
    })();

    draw.GuessEvent = (function() {

        /**
         * Properties of a GuessEvent.
         * @memberof draw
         * @interface IGuessEvent
         * @property {string|null} [uuid] GuessEvent uuid
         * @property {string|null} [guess] GuessEvent guess
         */

        /**
         * Constructs a new GuessEvent.
         * @memberof draw
         * @classdesc Represents a GuessEvent.
         * @implements IGuessEvent
         * @constructor
         * @param {draw.IGuessEvent=} [properties] Properties to set
         */
        function GuessEvent(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuessEvent uuid.
         * @member {string} uuid
         * @memberof draw.GuessEvent
         * @instance
         */
        GuessEvent.prototype.uuid = "";

        /**
         * GuessEvent guess.
         * @member {string} guess
         * @memberof draw.GuessEvent
         * @instance
         */
        GuessEvent.prototype.guess = "";

        /**
         * Creates a new GuessEvent instance using the specified properties.
         * @function create
         * @memberof draw.GuessEvent
         * @static
         * @param {draw.IGuessEvent=} [properties] Properties to set
         * @returns {draw.GuessEvent} GuessEvent instance
         */
        GuessEvent.create = function create(properties) {
            return new GuessEvent(properties);
        };

        /**
         * Encodes the specified GuessEvent message. Does not implicitly {@link draw.GuessEvent.verify|verify} messages.
         * @function encode
         * @memberof draw.GuessEvent
         * @static
         * @param {draw.IGuessEvent} message GuessEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuessEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uuid);
            if (message.guess != null && message.hasOwnProperty("guess"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.guess);
            return writer;
        };

        /**
         * Encodes the specified GuessEvent message, length delimited. Does not implicitly {@link draw.GuessEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof draw.GuessEvent
         * @static
         * @param {draw.IGuessEvent} message GuessEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuessEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GuessEvent message from the specified reader or buffer.
         * @function decode
         * @memberof draw.GuessEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {draw.GuessEvent} GuessEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuessEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.draw.GuessEvent();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uuid = reader.string();
                    break;
                case 2:
                    message.guess = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GuessEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof draw.GuessEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {draw.GuessEvent} GuessEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuessEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GuessEvent message.
         * @function verify
         * @memberof draw.GuessEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GuessEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                if (!$util.isString(message.uuid))
                    return "uuid: string expected";
            if (message.guess != null && message.hasOwnProperty("guess"))
                if (!$util.isString(message.guess))
                    return "guess: string expected";
            return null;
        };

        /**
         * Creates a GuessEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof draw.GuessEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {draw.GuessEvent} GuessEvent
         */
        GuessEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.draw.GuessEvent)
                return object;
            let message = new $root.draw.GuessEvent();
            if (object.uuid != null)
                message.uuid = String(object.uuid);
            if (object.guess != null)
                message.guess = String(object.guess);
            return message;
        };

        /**
         * Creates a plain object from a GuessEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof draw.GuessEvent
         * @static
         * @param {draw.GuessEvent} message GuessEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GuessEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.uuid = "";
                object.guess = "";
            }
            if (message.uuid != null && message.hasOwnProperty("uuid"))
                object.uuid = message.uuid;
            if (message.guess != null && message.hasOwnProperty("guess"))
                object.guess = message.guess;
            return object;
        };

        /**
         * Converts this GuessEvent to JSON.
         * @function toJSON
         * @memberof draw.GuessEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GuessEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GuessEvent;
    })();

    return draw;
})();

export { $root as default };

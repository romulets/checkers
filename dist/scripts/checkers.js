var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("Models/Player", ["require", "exports", "Models/Piece"], function (require, exports, Piece_1) {
    "use strict";
    var INITIAL_PIECES_COUNT = 12;
    var Player = (function () {
        function Player(name, piecesColor) {
            this.moveFoward = false;
            this._color = piecesColor;
            this._name = name;
            this.initPieces(piecesColor);
            this.createDOMElement();
        }
        Object.defineProperty(Player.prototype, "pieces", {
            get: function () {
                return this._pieces;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "color", {
            get: function () {
                return this._color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "element", {
            get: function () {
                return this.wrapperElement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "piecesInGame", {
            get: function () {
                var pieces = [];
                this.pieces.forEach(function (p) {
                    if (p.inGame)
                        pieces.push(p);
                });
                return pieces;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "eatedPieces", {
            get: function () {
                var pieces = [];
                this.pieces.forEach(function (p) {
                    if (!p.inGame)
                        pieces.push(p);
                });
                return pieces;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.initPieces = function (piecesColor) {
            this._pieces = [];
            for (var i = 0; i < INITIAL_PIECES_COUNT; i++) {
                this._pieces.push(new Piece_1.default(this, piecesColor));
            }
        };
        Player.prototype.createDOMElement = function () {
            this.wrapperElement = document.createElement('div');
            this.wrapperElement.classList.add('checkers-player');
            this.wrapperElement.appendChild(this.getNameElement());
            this.wrapperElement.appendChild(this.getEatedPiecesElement());
            this.wrapperElement.appendChild(this.getPiecesInGameElement());
        };
        Player.prototype.getNameElement = function () {
            this.nameElement = document.createElement('h4');
            this.nameElement.innerHTML = this.name + " ";
            this.nameElement.appendChild(this.getLittlePieceElement());
            return this.nameElement;
        };
        Player.prototype.getLittlePieceElement = function () {
            var littlePiece = document.createElement('span');
            littlePiece.classList.add('little-piece');
            littlePiece.style.backgroundColor = this.color;
            return littlePiece;
        };
        Player.prototype.getPiecesInGameElement = function () {
            this.piecesInGameElement = document.createElement('p');
            return this.piecesInGameElement;
        };
        Player.prototype.getEatedPiecesElement = function () {
            this.eatedPiecesElement = document.createElement('p');
            return this.eatedPiecesElement;
        };
        Player.prototype.updateElementInfos = function () {
            this.piecesInGameElement.innerHTML = "In Game pieces: " + this.piecesInGame.length;
            this.eatedPiecesElement.innerHTML = "Eaten pieces: " + this.eatedPieces.length;
        };
        return Player;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Player;
});
define("Exceptions/CheckersException", ["require", "exports"], function (require, exports) {
    "use strict";
    var CheckersException = (function () {
        function CheckersException(message) {
        }
        return CheckersException;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CheckersException;
});
define("Exceptions/UnextractablePathException", ["require", "exports", "Exceptions/CheckersException"], function (require, exports, CheckersException_1) {
    "use strict";
    var UnextractablePathException = (function (_super) {
        __extends(UnextractablePathException, _super);
        function UnextractablePathException() {
            var _this = _super.apply(this, arguments) || this;
            _this.name = 'UnextractablePathException';
            return _this;
        }
        return UnextractablePathException;
    }(CheckersException_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UnextractablePathException;
});
define("Models/Point", ["require", "exports", "Exceptions/UnextractablePathException"], function (require, exports, UnextractablePathException_1) {
    "use strict";
    var Point = (function () {
        function Point(x, y) {
            this._x = x;
            this._y = y;
            this.walkedPath = [];
        }
        Object.defineProperty(Point.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        Point.prototype.equalsTo = function (other) {
            return this.x === other.x && this.y === other.y;
        };
        Point.prototype.isTop = function (other) {
            return this.isTopRight(other) || this.isTopLeft(other);
        };
        Point.prototype.isTopRight = function (other) {
            return this.x === other.x - 1 && this.y === other.y + 1;
        };
        Point.prototype.isTopLeft = function (other) {
            return this.x === other.x - 1 && this.y === other.y - 1;
        };
        Point.prototype.isBot = function (other) {
            return this.isBotRight(other) || this.isBotLeft(other);
        };
        Point.prototype.isBotRight = function (other) {
            return this.x === other.x + 1 && this.y === other.y + 1;
        };
        Point.prototype.isBotLeft = function (other) {
            return this.x === other.x + 1 && this.y === other.y - 1;
        };
        Point.prototype.isLongDiagon = function (other) {
            return this.isLongDiagonTopRight(other) ||
                this.isLongDiagonTopLeft(other) ||
                this.isLongDiagonBotLeft(other) ||
                this.isLongDiagonBotRight(other);
        };
        Point.prototype.isLongDiagonTopRight = function (other) {
            var isLimitValid = function (point) { return point.x >= other.x && point.y <= other.y; };
            var walk = function (toWalk) { return new Point(toWalk.x - 1, toWalk.y + 1); };
            return this.isLongDiagonGeneric(other, isLimitValid, walk);
        };
        Point.prototype.isLongDiagonTopLeft = function (other) {
            var isLimitValid = function (point) { return point.x >= other.x && point.y >= other.y; };
            var walk = function (toWalk) { return new Point(toWalk.x - 1, toWalk.y - 1); };
            return this.isLongDiagonGeneric(other, isLimitValid, walk);
        };
        Point.prototype.isLongDiagonBotRight = function (other) {
            var isLimitValid = function (point) { return point.x <= other.x && point.y <= other.y; };
            var walk = function (toWalk) { return new Point(toWalk.x + 1, toWalk.y + 1); };
            return this.isLongDiagonGeneric(other, isLimitValid, walk);
        };
        Point.prototype.isLongDiagonBotLeft = function (other) {
            var isLimitValid = function (point) { return point.x <= other.x && point.y >= other.y; };
            var walk = function (toWalk) { return new Point(toWalk.x + 1, toWalk.y - 1); };
            return this.isLongDiagonGeneric(other, isLimitValid, walk);
        };
        Point.prototype.isLongDiagonGeneric = function (other, isLimitValid, walk) {
            var floatPoint = new Point(this.x, this.y);
            this.walkedPath = [];
            while (isLimitValid(floatPoint)) {
                floatPoint = walk(floatPoint);
                this.walkedPath.push(floatPoint);
                if (floatPoint.x == other.x && floatPoint.y == other.y)
                    return true;
            }
            return false;
        };
        Point.prototype.getPathTo = function (other) {
            if (this.isLongDiagonTopRight(other))
                return this.walkedPath;
            if (this.isLongDiagonTopLeft(other))
                return this.walkedPath;
            if (this.isLongDiagonBotLeft(other))
                return this.walkedPath;
            if (this.isLongDiagonBotRight(other))
                return this.walkedPath;
            throw new UnextractablePathException_1.default();
        };
        return Point;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Point;
});
define("Exceptions/InvalidPlayException", ["require", "exports", "Exceptions/CheckersException"], function (require, exports, CheckersException_2) {
    "use strict";
    var InvalidPlayException = (function (_super) {
        __extends(InvalidPlayException, _super);
        function InvalidPlayException() {
            var _this = _super.apply(this, arguments) || this;
            _this.name = 'InvalidPlayException';
            return _this;
        }
        return InvalidPlayException;
    }(CheckersException_2.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InvalidPlayException;
});
define("utils", ["require", "exports", "Exceptions/InvalidPlayException", "Exceptions/UnextractablePathException"], function (require, exports, InvalidPlayException_1, UnextractablePathException_2) {
    "use strict";
    function isEating(from, to) {
        return from !== null && to !== null &&
            !from.isEmpty() && !to.isEmpty();
    }
    exports.isEating = isEating;
    function isEatingAFriendPiece(from, to) {
        return isEating(from, to) &&
            from.piece.player === to.piece.player &&
            !from.equalsTo(to);
    }
    exports.isEatingAFriendPiece = isEatingAFriendPiece;
    function isEatingAnEnemyPiece(from, to) {
        return isEating(from, to) &&
            from.piece.player !== to.piece.player &&
            !from.equalsTo(to);
    }
    exports.isEatingAnEnemyPiece = isEatingAnEnemyPiece;
    function isAdvancingPlace(from, to, board) {
        if (from === null || from.isEmpty() || from.equalsTo(to))
            return false;
        var fromPoint = from.point;
        var toPoint = to.point;
        if (from.piece.isQueen)
            return isAdvancingForQueens(fromPoint, toPoint, board);
        if (from.piece.player.moveFoward)
            return fromPoint.isTop(toPoint);
        else
            return fromPoint.isBot(toPoint);
    }
    exports.isAdvancingPlace = isAdvancingPlace;
    function isAdvancingForQueens(from, to, board) {
        try {
            var i = void 0, point = void 0, place = void 0;
            var path = from.getPathTo(to);
            for (i = 0; i < path.length; i++) {
                point = path[i];
                place = board[point.x][point.y];
                if (!place.isEmpty() && i !== path.length - 1)
                    return false;
            }
            return true;
        }
        catch (ex) {
            if (ex instanceof UnextractablePathException_2.default)
                return false;
        }
    }
    function indentifyNextPlaceAfterEat(from, to, board) {
        var placeAfterEat;
        try {
            placeAfterEat = getPlaceAfterEat(from.point, to.point, board);
        }
        catch (ex) {
            if (ex instanceof TypeError) {
                placeAfterEat = undefined;
            }
            else {
                throw ex;
            }
        }
        if (placeAfterEat === undefined || !placeAfterEat.isEmpty()) {
            throw new InvalidPlayException_1.default("Invalid place");
        }
        return placeAfterEat;
    }
    exports.indentifyNextPlaceAfterEat = indentifyNextPlaceAfterEat;
    function getPlaceAfterEat(from, to, board) {
        if (from.isLongDiagonTopRight(to))
            return board[to.x - 1][to.y + 1];
        if (from.isLongDiagonTopLeft(to))
            return board[to.x - 1][to.y - 1];
        if (from.isLongDiagonBotRight(to))
            return board[to.x + 1][to.y + 1];
        if (from.isLongDiagonBotLeft(to))
            return board[to.x + 1][to.y - 1];
        throw new InvalidPlayException_1.default("Place doesn't exists");
    }
});
define("Models/Piece", ["require", "exports", "Models/Point", "Exceptions/InvalidPlayException", "utils"], function (require, exports, Point_1, InvalidPlayException_2, utils_1) {
    "use strict";
    var Piece = (function () {
        function Piece(player, color) {
            this.createDOMElement(color);
            this._player = player;
            this.isQueen = false;
            this.inGame = true;
        }
        Object.defineProperty(Piece.prototype, "isQueen", {
            get: function () {
                return this._isQueen;
            },
            set: function (isQueen) {
                this._isQueen = isQueen;
                if (isQueen) {
                    this.element.classList.add('queen');
                }
                else {
                    this.element.classList.remove('queen');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Piece.prototype, "element", {
            get: function () {
                return this.span;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Piece.prototype, "player", {
            get: function () {
                return this._player;
            },
            enumerable: true,
            configurable: true
        });
        Piece.prototype.createDOMElement = function (color) {
            this.span = document.createElement('span');
            this.span.classList.add('piece');
            this.span.style.backgroundColor = color;
        };
        Piece.prototype.hasPlaceToGo = function (board) {
            if (this.isQueen)
                return this.canGoTop(board) || this.canGoBot(board);
            if (this.player.moveFoward)
                return this.canGoBot(board);
            return this.canGoTop(board);
        };
        Piece.prototype.canGoTop = function (board) {
            return this.canGoTopLeft(board) || this.canGoTopRight(board);
        };
        Piece.prototype.canGoBot = function (board) {
            return this.canGoBotLeft(board) || this.canGoBotRight(board);
        };
        Piece.prototype.canGoTopRight = function (board) {
            var point = new Point_1.default(this.point.x - 1, this.point.y + 1);
            return this.canGoTo(point, board);
        };
        Piece.prototype.canGoTopLeft = function (board) {
            var point = new Point_1.default(this.point.x - 1, this.point.y - 1);
            return this.canGoTo(point, board);
        };
        Piece.prototype.canGoBotRight = function (board) {
            var point = new Point_1.default(this.point.x + 1, this.point.y + 1);
            return this.canGoTo(point, board);
        };
        Piece.prototype.canGoBotLeft = function (board) {
            var point = new Point_1.default(this.point.x + 1, this.point.y - 1);
            return this.canGoTo(point, board);
        };
        Piece.prototype.canGoTo = function (point, board) {
            try {
                var to = board[point.x][point.y];
                if (to === undefined)
                    return false;
                if (to.isEmpty())
                    return true;
                if (to.piece.player === this.player)
                    return false;
                var from = board[this.point.x][this.point.y];
                utils_1.indentifyNextPlaceAfterEat(from, to, board);
                return true;
            }
            catch (ex) {
                if (ex instanceof InvalidPlayException_2.default)
                    return false;
                if (ex instanceof TypeError)
                    return false;
                throw ex;
            }
        };
        return Piece;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Piece;
});
define("Exceptions/NonEmptyPlaceException", ["require", "exports", "Exceptions/InvalidPlayException"], function (require, exports, InvalidPlayException_3) {
    "use strict";
    var NonEmptyPlaceException = (function (_super) {
        __extends(NonEmptyPlaceException, _super);
        function NonEmptyPlaceException(place) {
            var _this = _super.call(this, "The place " + place.toString() + " isn't empty") || this;
            _this.name = 'NonEmptyPlaceException';
            _this._place = place;
            return _this;
        }
        return NonEmptyPlaceException;
    }(InvalidPlayException_3.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NonEmptyPlaceException;
});
define("Models/Place", ["require", "exports", "Models/Point", "Exceptions/InvalidPlayException", "Exceptions/NonEmptyPlaceException"], function (require, exports, Point_2, InvalidPlayException_4, NonEmptyPlaceException_1) {
    "use strict";
    var LIGHT_PLACE = '#CCC';
    var DARK_PLACE = '#AAA';
    var Place = (function () {
        function Place(playable) {
            this._piece = null;
            this._selected = false;
            this.playable = playable;
            this.point = new Point_2.default(0, 0);
            this.createDOMElement();
        }
        Object.defineProperty(Place.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (selected) {
                this._selected = selected;
                var classList = this.td.classList;
                if (selected) {
                    classList.add('active');
                }
                else {
                    classList.remove('active');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Place.prototype, "piece", {
            get: function () {
                return this._piece;
            },
            set: function (piece) {
                if (piece !== null) {
                    this.checkSetPiece();
                    piece.point = this.point;
                }
                this._piece = piece;
                this.appendsPieceElement();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Place.prototype, "element", {
            get: function () {
                return this.td;
            },
            enumerable: true,
            configurable: true
        });
        Place.prototype.checkSetPiece = function () {
            if (!this.playable)
                throw new InvalidPlayException_4.default('Place not playable');
            if (!this.isEmpty())
                throw new NonEmptyPlaceException_1.default(this);
        };
        Place.prototype.createDOMElement = function () {
            this.td = document.createElement('td');
            this.td.style.backgroundColor = this.playable ? DARK_PLACE : LIGHT_PLACE;
        };
        Place.prototype.appendsPieceElement = function () {
            if (this.isEmpty()) {
                this.td.innerHTML = '';
            }
            else {
                this.element.appendChild(this.piece.element);
            }
        };
        Place.prototype.isEmpty = function () {
            return this._piece === null;
        };
        Place.prototype.isPlayable = function () {
            return this.playable;
        };
        Place.prototype.equalsTo = function (place) {
            if (place === null)
                return false;
            return this.point.equalsTo(place.point);
        };
        return Place;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Place;
});
define("Models/PlayStatus", ["require", "exports"], function (require, exports) {
    "use strict";
    var PlayStatus;
    (function (PlayStatus) {
        PlayStatus[PlayStatus["INVALID"] = 0] = "INVALID";
        PlayStatus[PlayStatus["FINISHED"] = 1] = "FINISHED";
        PlayStatus[PlayStatus["STILL_HAPPENING"] = 2] = "STILL_HAPPENING";
    })(PlayStatus = exports.PlayStatus || (exports.PlayStatus = {}));
});
define("Models/PlayResponse", ["require", "exports", "Models/PlayStatus"], function (require, exports, PlayStatus_1) {
    "use strict";
    var PlayResponse = (function () {
        function PlayResponse(playStatus, selectedPlace) {
            this._playStatus = playStatus;
            this._selectedPlace = selectedPlace || null;
        }
        Object.defineProperty(PlayResponse.prototype, "selectedPlace", {
            get: function () {
                return this._selectedPlace;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayResponse.prototype, "playStatus", {
            get: function () {
                return this._playStatus;
            },
            enumerable: true,
            configurable: true
        });
        PlayResponse.invalid = function () {
            return new PlayResponse(PlayStatus_1.PlayStatus.INVALID);
        };
        PlayResponse.finished = function () {
            return new PlayResponse(PlayStatus_1.PlayStatus.FINISHED);
        };
        PlayResponse.stillHappening = function (selectedPlace) {
            return new PlayResponse(PlayStatus_1.PlayStatus.STILL_HAPPENING, selectedPlace);
        };
        return PlayResponse;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlayResponse;
});
define("Actions/Action", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("Actions/AdvanceAction", ["require", "exports", "Models/PlayResponse", "utils"], function (require, exports, PlayResponse_1, utils_2) {
    "use strict";
    var AdvanceAction = (function () {
        function AdvanceAction(from, to, board) {
            this.from = from;
            this.to = to;
            this.board = board;
        }
        AdvanceAction.prototype.canPerform = function () {
            return utils_2.isAdvancingPlace(this.from, this.to, this.board);
        };
        AdvanceAction.prototype.perform = function () {
            var _a = this, from = _a.from, to = _a.to;
            var piece = from.piece;
            to.selected = false;
            from.selected = false;
            from.piece = null;
            to.piece = piece;
            return PlayResponse_1.default.finished();
        };
        return AdvanceAction;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AdvanceAction;
});
define("Actions/ComboPlayAction", ["require", "exports", "Models/Point", "Models/PlayResponse", "Exceptions/InvalidPlayException", "utils"], function (require, exports, Point_3, PlayResponse_2, InvalidPlayException_5, utils_3) {
    "use strict";
    var ComboPlayAction = (function () {
        function ComboPlayAction(to, board, isAfterEat) {
            this.to = to;
            this.isAfterEat = isAfterEat;
            this.board = board;
        }
        ComboPlayAction.prototype.perform = function () {
            this.to.selected = true;
            this.fireOnDiscoverHasMoreMovies();
            return PlayResponse_2.default.stillHappening(this.to);
        };
        ComboPlayAction.prototype.fireOnDiscoverHasMoreMovies = function () {
            if (this.onDiscoverHasMoreMovies) {
                this.onDiscoverHasMoreMovies();
            }
        };
        ComboPlayAction.prototype.canPerform = function () {
            return this.isAfterEat && this.claimComboPlay();
        };
        ComboPlayAction.prototype.claimComboPlay = function () {
            if (this.to.isEmpty())
                return false;
            var piece = this.to.piece;
            if (piece.isQueen)
                return this.claimComboForQueen();
            if (piece.player.moveFoward)
                return this.claimComboForForwarder();
            else
                return this.claimComboForBackwarder();
        };
        ComboPlayAction.prototype.claimComboForQueen = function () {
            return this.claimComboForForwarder() || this.claimComboForBackwarder();
        };
        ComboPlayAction.prototype.claimComboForForwarder = function () {
            var _a = this.to.point, x = _a.x, y = _a.y;
            return this.canEatAt(new Point_3.default(x + 1, y - 1)) ||
                this.canEatAt(new Point_3.default(x + 1, y + 1));
        };
        ComboPlayAction.prototype.claimComboForBackwarder = function () {
            var _a = this.to.point, x = _a.x, y = _a.y;
            return this.canEatAt(new Point_3.default(x - 1, y + 1))
                || this.canEatAt(new Point_3.default(x - 1, y - 1));
        };
        ComboPlayAction.prototype.canEatAt = function (point) {
            try {
                return this.eatAt(point);
            }
            catch (ex) {
                if (ex instanceof InvalidPlayException_5.default || ex instanceof TypeError) {
                    return false;
                }
            }
        };
        ComboPlayAction.prototype.eatAt = function (point) {
            var intendedNextPlace, placeAfterEat;
            intendedNextPlace = this.board[point.x][point.y];
            placeAfterEat = utils_3.indentifyNextPlaceAfterEat(this.to, intendedNextPlace, this.board);
            return !intendedNextPlace.isEmpty() &&
                utils_3.isEatingAnEnemyPiece(this.to, intendedNextPlace);
        };
        return ComboPlayAction;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ComboPlayAction;
});
define("consts", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.BOARD_WIDTH = 8;
    exports.BOARD_HEIGHT = 8;
});
define("Actions/CrownQueenAction", ["require", "exports", "consts", "Models/PlayResponse"], function (require, exports, consts_1, PlayResponse_3) {
    "use strict";
    var CrownQueenAction = (function () {
        function CrownQueenAction(to) {
            this.to = to;
        }
        CrownQueenAction.prototype.canPerform = function () {
            var to = this.to;
            if (this.doesntNeedSeeCoordinate())
                return false;
            var piece = to.piece;
            var player = piece.player;
            return (player.moveFoward && piece.point.x === consts_1.BOARD_HEIGHT - 1) ||
                (!player.moveFoward && piece.point.x === 0);
        };
        CrownQueenAction.prototype.doesntNeedSeeCoordinate = function () {
            var to = this.to;
            return to === null || to.isEmpty() || to.piece.isQueen;
        };
        CrownQueenAction.prototype.perform = function () {
            this.to.piece.isQueen = true;
            return PlayResponse_3.default.finished();
        };
        return CrownQueenAction;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CrownQueenAction;
});
define("Actions/EatAction", ["require", "exports", "Models/PlayResponse", "Exceptions/InvalidPlayException", "Exceptions/NonEmptyPlaceException", "utils"], function (require, exports, PlayResponse_4, InvalidPlayException_6, NonEmptyPlaceException_2, utils_4) {
    "use strict";
    var EatAction = (function () {
        function EatAction(from, to, board) {
            this.OnEat = null;
            this.from = from;
            this.to = to;
            this.board = board;
        }
        EatAction.prototype.canPerform = function () {
            var _a = this, from = _a.from, to = _a.to, board = _a.board;
            return utils_4.isEating(from, to) && utils_4.isAdvancingPlace(from, to, board);
        };
        EatAction.prototype.perform = function () {
            var placeToEat;
            try {
                placeToEat = utils_4.indentifyNextPlaceAfterEat(this.from, this.to, this.board);
                if (!placeToEat.isEmpty())
                    throw new NonEmptyPlaceException_2.default(placeToEat);
            }
            catch (ex) {
                if (ex instanceof InvalidPlayException_6.default)
                    return PlayResponse_4.default.invalid();
            }
            if (this.eat(placeToEat)) {
                return PlayResponse_4.default.finished();
            }
            else {
                return PlayResponse_4.default.invalid();
            }
        };
        EatAction.prototype.eat = function (placeToEat) {
            var _a = this, from = _a.from, to = _a.to;
            var piece = from.piece;
            var eatedPiece = to.piece;
            eatedPiece.inGame = false;
            from.piece = null;
            from.selected = false;
            to.piece = null;
            to.selected = false;
            placeToEat.piece = piece;
            this.fireOnEat(placeToEat);
            return true;
        };
        EatAction.prototype.fireOnEat = function (newTo) {
            if (this.OnEat !== null) {
                this.OnEat(newTo);
            }
        };
        return EatAction;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EatAction;
});
define("Actions/SelectAction", ["require", "exports", "Models/PlayResponse"], function (require, exports, PlayResponse_5) {
    "use strict";
    var SelectAction = (function () {
        function SelectAction(from, to) {
            this.from = from;
            this.to = to;
        }
        SelectAction.prototype.canPerform = function () {
            var _a = this, from = _a.from, to = _a.to;
            return from === null && !to.isEmpty();
        };
        SelectAction.prototype.perform = function () {
            this.to.selected = true;
            return PlayResponse_5.default.stillHappening(this.to);
        };
        return SelectAction;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SelectAction;
});
define("Actions/UnselectAction", ["require", "exports", "Models/PlayResponse"], function (require, exports, PlayResponse_6) {
    "use strict";
    var UnselectAction = (function () {
        function UnselectAction(from, to, lastPlay) {
            this.from = from;
            this.to = to;
            this.lastPlay = lastPlay || null;
        }
        UnselectAction.prototype.canPerform = function () {
            var _a = this, from = _a.from, to = _a.to;
            return from !== null && from.equalsTo(to);
        };
        UnselectAction.prototype.perform = function () {
            this.to.selected = false;
            if (this.lastPlay != null && this.lastPlay.isComboPlay) {
                return PlayResponse_6.default.finished();
            }
            else {
                return PlayResponse_6.default.stillHappening();
            }
        };
        return UnselectAction;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UnselectAction;
});
define("Actions/PlayAction", ["require", "exports", "Actions/EatAction", "Actions/SelectAction", "Models/PlayResponse", "Actions/AdvanceAction", "Actions/UnselectAction", "Actions/ComboPlayAction", "Actions/CrownQueenAction", "utils"], function (require, exports, EatAction_1, SelectAction_1, PlayResponse_7, AdvanceAction_1, UnselectAction_1, ComboPlayAction_1, CrownQueenAction_1, utils_5) {
    "use strict";
    var PlayAction = (function () {
        function PlayAction(from, to, board, lastPlay) {
            this._from = from;
            this._to = to;
            this._board = board;
            this._lastPlay = lastPlay || null;
            this._eatedPiece = false;
            this._isAdvancingPlace = false;
            this._isComboPlay = false;
        }
        Object.defineProperty(PlayAction.prototype, "from", {
            get: function () {
                return this._from;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayAction.prototype, "to", {
            get: function () {
                return this._to;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayAction.prototype, "board", {
            get: function () {
                return this._board;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayAction.prototype, "lastPlay", {
            get: function () {
                return this._lastPlay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayAction.prototype, "eatedPiece", {
            get: function () {
                return this._eatedPiece;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayAction.prototype, "isAdvancingPlace", {
            get: function () {
                return utils_5.isAdvancingPlace(this.from, this.to, this.board);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayAction.prototype, "isComboPlay", {
            get: function () {
                return this._isComboPlay;
            },
            enumerable: true,
            configurable: true
        });
        PlayAction.prototype.canPerform = function () {
            if (this.to === null)
                return false;
            else if (utils_5.isEatingAFriendPiece(this.from, this.to))
                return false;
            else
                return true;
        };
        PlayAction.prototype.perform = function () {
            if (!this.canPerform())
                return PlayResponse_7.default.invalid();
            this.playResponse = this.performActions();
            this.performAfterActions();
            return this.playResponse;
        };
        PlayAction.prototype.performActions = function () {
            var action, i;
            var actions = this.getSequencedActionList();
            for (i = 0; i < actions.length; i++) {
                action = actions[i];
                if (action.canPerform())
                    return action.perform();
            }
            return PlayResponse_7.default.invalid();
        };
        PlayAction.prototype.getSequencedActionList = function () {
            var _a = this, from = _a.from, to = _a.to, board = _a.board, lastPlay = _a.lastPlay;
            return [
                new SelectAction_1.default(from, to),
                new UnselectAction_1.default(from, to, lastPlay),
                this.getEatAction(),
                new AdvanceAction_1.default(from, to, this.board),
            ];
        };
        PlayAction.prototype.getEatAction = function () {
            var _this = this;
            var eat = new EatAction_1.default(this.from, this.to, this.board);
            eat.OnEat = function (newTo) {
                _this._to = newTo;
                _this._eatedPiece = true;
            };
            return eat;
        };
        PlayAction.prototype.performAfterActions = function () {
            var action, i;
            var actions = this.getAfterActionList();
            for (i = 0; i < actions.length; i++) {
                action = actions[i];
                if (action.canPerform()) {
                    action.perform();
                }
            }
        };
        PlayAction.prototype.getAfterActionList = function () {
            var to = this.to;
            return [
                new CrownQueenAction_1.default(to),
                this.getComboPlayAction()
            ];
        };
        PlayAction.prototype.getComboPlayAction = function () {
            var _this = this;
            var action = new ComboPlayAction_1.default(this.to, this.board, this._eatedPiece);
            action.onDiscoverHasMoreMovies = function () {
                _this.playResponse = PlayResponse_7.default.stillHappening(_this.to);
                _this._isComboPlay = true;
            };
            return action;
        };
        return PlayAction;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlayAction;
});
define("Models/Mediator", ["require", "exports", "Actions/PlayAction", "Models/PlayResponse", "Models/PlayStatus", "utils"], function (require, exports, PlayAction_1, PlayResponse_8, PlayStatus_2, utils_6) {
    "use strict";
    var Mediator = (function () {
        function Mediator(pl1, pl2) {
            this._currentPlayer = pl1;
            this.player1 = pl1;
            this.player2 = pl2;
            this.plays = [];
            this.createDOMElement();
            this.formatScoreElement();
            this.setCurrentPlayerClass();
        }
        Object.defineProperty(Mediator.prototype, "element", {
            get: function () {
                return this.socoreElement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mediator.prototype, "currentPlayer", {
            get: function () {
                return this._currentPlayer;
            },
            enumerable: true,
            configurable: true
        });
        Mediator.prototype.play = function (from, to, board) {
            var play = new PlayAction_1.default(from, to, board, this.getLastPlay());
            if (!this.canPlay(play))
                return PlayResponse_8.default.invalid();
            return this.perform(play);
        };
        Mediator.prototype.getLastPlay = function () {
            var playsQuantity = this.plays.length;
            if (playsQuantity === 0)
                return null;
            return this.plays[playsQuantity - 1];
        };
        Mediator.prototype.canPlay = function (play) {
            var from = play.from, to = play.to;
            return to.isEmpty() ||
                this.isSelectingCurrentPlayer(to.piece.player) ||
                utils_6.isEatingAnEnemyPiece(from, to);
        };
        Mediator.prototype.perform = function (play) {
            var from = play.from, to = play.to;
            var playResponse = play.perform();
            if (playResponse.playStatus === PlayStatus_2.PlayStatus.FINISHED) {
                this.alternateBetweenPlayers();
            }
            this.plays.push(play);
            this.determineWinner(play.board);
            return playResponse;
        };
        Mediator.prototype.isSelectingCurrentPlayer = function (player) {
            return this._currentPlayer === player;
        };
        Mediator.prototype.alternateBetweenPlayers = function () {
            this.changePlayer();
            this.formatScoreElement();
            return this.currentPlayer;
        };
        Mediator.prototype.changePlayer = function () {
            this.unsetPlayersClass();
            if (this.isSelectingCurrentPlayer(this.player1)) {
                this._currentPlayer = this.player2;
            }
            else {
                this._currentPlayer = this.player1;
            }
            this.setCurrentPlayerClass();
        };
        Mediator.prototype.setCurrentPlayerClass = function () {
            this.currentPlayer.element.classList.add('playing');
        };
        Mediator.prototype.unsetPlayersClass = function () {
            this.player1.element.classList.remove('playing');
            this.player2.element.classList.remove('playing');
        };
        Mediator.prototype.createDOMElement = function () {
            this.socoreElement = document.createElement('div');
            this.socoreElement.classList.add('checkers-score');
            this.socoreElement.appendChild(this.player1.element);
            this.socoreElement.appendChild(this.player2.element);
        };
        Mediator.prototype.formatScoreElement = function () {
            this.player1.updateElementInfos();
            this.player2.updateElementInfos();
        };
        Mediator.prototype.determineWinner = function (board) {
            var winner = this.getWinner(board);
            if (winner !== null) {
                this.unsetPlayersClass();
                winner.element.classList.add('winner');
            }
        };
        Mediator.prototype.getWinner = function (board) {
            var _a = this, player1 = _a.player1, player2 = _a.player2;
            if (!this.hasMoves(player2, board))
                return player1;
            if (!this.hasMoves(player1, board))
                return player2;
            return null;
        };
        Mediator.prototype.hasMoves = function (player, board) {
            var pieces = player.piecesInGame;
            if (pieces.length > 3)
                return true;
            if (pieces.length === 0)
                return false;
            var hasChances = false;
            pieces.forEach(function (p) {
                if (p.hasPlaceToGo(board)) {
                    hasChances = true;
                }
            });
            console.log(hasChances);
            return hasChances;
        };
        return Mediator;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Mediator;
});
define("Models/Board", ["require", "exports", "Models/Place", "Models/Point", "Models/Mediator", "Models/PlayStatus", "consts"], function (require, exports, Place_1, Point_4, Mediator_1, PlayStatus_3, consts_2) {
    "use strict";
    var Board = (function () {
        function Board(renderSelector, pl1, pl2) {
            this.setupMediator(pl1, pl2);
            this.setupBoard();
            this.setupPlayers(pl1, pl2);
            this.renderHTML(renderSelector);
        }
        Board.prototype.setupMediator = function (pl1, pl2) {
            this.mediator = new Mediator_1.default(pl1, pl2);
        };
        Board.prototype.setupPlayers = function (pl1, pl2) {
            pl1.moveFoward = true;
            pl2.moveFoward = false;
            this.initPieces(pl1);
            this.initPieces(pl2);
        };
        Board.prototype.setupBoard = function () {
            var x, y, playable, tr, place;
            playable = false;
            this.boardMask = [];
            this.selectedPlace = null;
            this.createTableDOMElement();
            for (x = 0; x < consts_2.BOARD_WIDTH; x++) {
                tr = document.createElement('tr');
                this.boardMask[x] = [];
                for (y = 0; y < consts_2.BOARD_HEIGHT; y++) {
                    place = this.createPlace(x, y, playable);
                    playable = !playable;
                    tr.appendChild(place.element);
                }
                this.table.appendChild(tr);
                playable = !playable;
            }
        };
        Board.prototype.initPieces = function (player) {
            var place, x, y;
            var initialLine = player.moveFoward ? 0 : 5;
            var piecesInBoardCount = 0;
            for (x = initialLine; x < initialLine + 3; x++) {
                for (y = 0; y < consts_2.BOARD_HEIGHT; y++) {
                    place = this.boardMask[x][y];
                    if (place.isPlayable()) {
                        place.piece = player.pieces[piecesInBoardCount];
                        piecesInBoardCount++;
                    }
                }
            }
        };
        Board.prototype.createPlace = function (x, y, playable) {
            var place = new Place_1.default(playable);
            place.point = new Point_4.default(x, y);
            this.boardMask[x][y] = place;
            place.element.addEventListener('click', this.play.bind(this, place));
            return place;
        };
        Board.prototype.play = function (place) {
            var playResponse = this.mediator.play(this.selectedPlace, place, this.boardMask);
            if (playResponse.playStatus === PlayStatus_3.PlayStatus.INVALID)
                return;
            this.selectedPlace = playResponse.selectedPlace;
        };
        Board.prototype.createTableDOMElement = function () {
            this.table = document.createElement('table');
            this.table.classList.add('checkers-board');
        };
        Board.prototype.renderHTML = function (renderSelector) {
            var rootElement = document.querySelector(renderSelector);
            rootElement.appendChild(this.table);
            rootElement.appendChild(this.mediator.element);
        };
        return Board;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Board;
});
define("Checkers", ["require", "exports", "Models/Board", "Models/Player"], function (require, exports, Board_1, Player_1) {
    "use strict";
    function startGame(elementSelector, player1, player2) {
        player1 = player1 || new Player_1.default('Player 1', '#1d733c');
        player2 = player2 || new Player_1.default('Player 2', '#7d1e1e');
        var board = new Board_1.default(elementSelector, player1, player2);
    }
    exports.startGame = startGame;
});
//# sourceMappingURL=checkers.js.map
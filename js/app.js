if (typeof $ === 'undefined') {
    throw new Error('This application\'s JavaScript requires jQuery');
}

var app = angular.module("test", ['ngDragDrop']);

app.controller('ChessCtrl', [
    '$scope',
    '$q',
    function ($scope, $q) {

        function Move(who, letter, index) {
            this.who = who;
            this.letter = letter;
            this.index = index;
        }

        // Tile object
        function Tile(figure, color, row, col) {
            this.figure = figure;
            this.color = color;
            this.row = row;
            this.col = col;
            this.droppable = false;
        }

        // Figure object
        function Figure(name, color) {
            this.name = name;
            this.color = color;
            this.fisrtMove = true;
        }

        // Player
        function Player(name, score, color) {
            this.name = name;
            this.score = score;
            this.color = color;
            this.figureEaten = [];
        }

        $scope.lettersDic = {1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h'};

        $scope.currentFigure = {};

        $scope.movements = [];

        $scope.tilesDroppable = [];

        $scope.first_player = {};

        $scope.second_player = {};

        $scope.error = null;

        $scope.toRow = null;
        $scope.toCol = null;

        $scope.turn = null;

        $scope.gameState = "new";

        $scope.Aboard = {
            "a": {
                1: new Tile(null, "black", 1, 1),
                2: new Tile(null, "white", 1, 2),
                3: new Tile(null, "black", 1, 3),
                4: new Tile(null, "white", 1, 4),
                5: new Tile(null, "black", 1, 5),
                6: new Tile(null, "white", 1, 6),
                7: new Tile(null, "black", 1, 7),
                8: new Tile(null, "white", 1, 8)
            },
            "b": {
                1: new Tile(null, "white", 2, 1),
                2: new Tile(null, "black", 2, 2),
                3: new Tile(null, "white", 2, 3),
                4: new Tile(null, "black", 2, 4),
                5: new Tile(null, "white", 2, 5),
                6: new Tile(null, "black", 2, 6),
                7: new Tile(null, "white", 2, 7),
                8: new Tile(null, "black", 2, 8)
            },
            "c": {
                1: new Tile(null, "black", 3, 1),
                2: new Tile(null, "white", 3, 2),
                3: new Tile(null, "black", 3, 3),
                4: new Tile(null, "white", 3, 4),
                5: new Tile(null, "black", 3, 5),
                6: new Tile(null, "white", 3, 6),
                7: new Tile(null, "black", 3, 7),
                8: new Tile(null, "white", 3, 8)
            },
            "d": {
                1: new Tile(null, "white", 4, 1),
                2: new Tile(null, "black", 4, 2),
                3: new Tile(null, "white", 4, 3),
                4: new Tile(null, "black", 4, 4),
                5: new Tile(null, "white", 4, 5),
                6: new Tile(null, "black", 4, 6),
                7: new Tile(null, "white", 4, 7),
                8: new Tile(null, "black", 4, 8)
            },
            "e": {
                1: new Tile(null, "black", 5, 1),
                2: new Tile(null, "white", 5, 2),
                3: new Tile(null, "black", 5, 3),
                4: new Tile(null, "white", 5, 4),
                5: new Tile(null, "black", 5, 5),
                6: new Tile(null, "white", 5, 6),
                7: new Tile(null, "black", 5, 7),
                8: new Tile(null, "white", 5, 8)
            },
            "f": {
                1: new Tile(null, "white", 6, 1),
                2: new Tile(null, "black", 6, 2),
                3: new Tile(null, "white", 6, 3),
                4: new Tile(null, "black", 6, 4),
                5: new Tile(null, "white", 6, 5),
                6: new Tile(null, "black", 6, 6),
                7: new Tile(null, "white", 6, 7),
                8: new Tile(null, "black", 6, 8)
            },
            "g": {
                1: new Tile(null, "black", 7, 1),
                2: new Tile(null, "white", 7, 2),
                3: new Tile(null, "black", 7, 3),
                4: new Tile(null, "white", 7, 4),
                5: new Tile(null, "black", 7, 5),
                6: new Tile(null, "white", 7, 6),
                7: new Tile(null, "black", 7, 7),
                8: new Tile(null, "white", 7, 8)
            },
            "h": {
                1: new Tile(null, "white", 8, 1),
                2: new Tile(null, "black", 8, 2),
                3: new Tile(null, "white", 8, 3),
                4: new Tile(null, "black", 8, 4),
                5: new Tile(null, "white", 8, 5),
                6: new Tile(null, "black", 8, 6),
                7: new Tile(null, "white", 8, 7),
                8: new Tile(null, "black", 8, 8)
            }
        };

        /***
         *
         */
        $scope.init = function () {

            // ORDER FIGURES
            // Black
            $scope.Aboard["a"][1].figure = new Figure('rook', "black");
            $scope.Aboard["a"][2].figure = new Figure('knight', "black");
            $scope.Aboard["a"][3].figure = new Figure('bishop', "black");
            $scope.Aboard["a"][4].figure = new Figure('queen', "black");
            $scope.Aboard["a"][5].figure = new Figure('king', "black");
            $scope.Aboard["a"][6].figure = new Figure('bishop', "black");
            $scope.Aboard["a"][7].figure = new Figure('knight', "black");
            $scope.Aboard["a"][8].figure = new Figure('rook', "black");
            $scope.Aboard["b"][1].figure = new Figure('pawn', "black");
            $scope.Aboard["b"][2].figure = new Figure('pawn', "black");
            $scope.Aboard["b"][3].figure = new Figure('pawn', "black");
            $scope.Aboard["b"][4].figure = new Figure('pawn', "black");
            $scope.Aboard["b"][5].figure = new Figure('pawn', "black");
            $scope.Aboard["b"][6].figure = new Figure('pawn', "black");
            $scope.Aboard["b"][7].figure = new Figure('pawn', "black");
            $scope.Aboard["b"][8].figure = new Figure('pawn', "black");

            // White
            $scope.Aboard["h"][1].figure = new Figure('rook', "white");
            $scope.Aboard["h"][2].figure = new Figure('knight', "white");
            $scope.Aboard["h"][3].figure = new Figure('bishop', "white");
            $scope.Aboard["h"][4].figure = new Figure('queen', "white");
            $scope.Aboard["h"][5].figure = new Figure('king', "white");
            $scope.Aboard["h"][6].figure = new Figure('bishop', "white");
            $scope.Aboard["h"][7].figure = new Figure('knight', "white");
            $scope.Aboard["h"][8].figure = new Figure('rook', "white");
            $scope.Aboard["g"][1].figure = new Figure('pawn', "white");
            $scope.Aboard["g"][2].figure = new Figure('pawn', "white");
            $scope.Aboard["g"][3].figure = new Figure('pawn', "white");
            $scope.Aboard["g"][4].figure = new Figure('pawn', "white");
            $scope.Aboard["g"][5].figure = new Figure('pawn', "white");
            $scope.Aboard["g"][6].figure = new Figure('pawn', "white");
            $scope.Aboard["g"][7].figure = new Figure('pawn', "white");
            $scope.Aboard["g"][8].figure = new Figure('pawn', "white");


            $scope.first_player = new Player(null, 0, "white");

            $scope.second_player = new Player(null, 0, "black");

            $scope.gameState = "new";
        };

        /***
         *
         * @param event
         * @param helper
         * @param tile
         * @param row
         * @param col
         */
        $scope.onStart = function (event, helper, tile, row, col) {

            $scope.currentFigure = tile.figure;
            console.log("++++++++");
            console.log(tile);

            //// For pawn
            //$scope.Aboard[$scope.lettersDic[tile.row-1]][tile.col].droppable = true;
            //$scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row-1]][tile.col]);
            //if(tile.figure.fisrtMove){
            //    console.log(tile.col);
            //    console.log(tile.row+2);
            //    console.log(tile.row+2);
            //    $scope.Aboard[$scope.lettersDic[tile.row-2]][tile.col].droppable = true;
            //    $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row-2]][tile.col]);
            //}

        };

        /***
         *
         * @param event
         * @param helper
         * @param tile
         * @param row
         * @param col
         */
        $scope.onStop = function (event, helper, tile, row, col) {
            console.log("onStop tile", tile);
            console.log("row", row);
            console.log("col", col);
        };

        /***
         *
         * @param event
         * @param helper
         * @param tile
         * @param row
         * @param col
         */
        $scope.onDrag = function (event, helper, tile, row, col) {
            console.log("onDrag tile", tile);
            console.log("row", row);
            console.log("col", col);
        };

        /***
         *
         * @param event
         * @param helper
         * @param tile
         * @param row
         * @param col
         */
        $scope.onDrop = function (event, helper, tile, row, col) {
            console.log("onDrop tile", tile);
            console.log("row", row + 1);
            console.log("col", col);

            console.log("current figure: ", $scope.currentFigure);
            console.log("current tile: ", tile);

            //var ans = $scope.checkMovement($scope.currentFigure.name,$scope.toRow+1,$scope.toCol+1,tile.row+1,tile.col+1);
            //
            //// Delete prev figure
            //if(ans) {
            //    $scope.Aboard[$scope.lettersDic[row + 1]][col].figure = null;
            //}
            //else {
            //    $scope.Aboard[$scope.lettersDic[$scope.toRow + 1]][$scope.toCol].figure = null;
            //
            //    // Error message
            //    $scope.error = "cant move like that";
            //
            //}

            $scope.currentFigure.fisrtMove = false; //  TODO recheck

            $scope.movements.push(new Move(tile.figure, $scope.lettersDic[row + 1], col));

            if ($scope.turn == "white") {
                $scope.turn = "black";
            }
            else {
                $scope.turn = "white";
            }
        };

        /***
         *
         * @param event
         * @param helper
         * @param tile
         * @param row
         * @param col
         */
        $scope.onOver = function (event, helper, tile, row, col) {
            console.log("onOver tile", tile);
            console.log("row", row);
            console.log("col", col);

            $scope.toRow = row;
            $scope.toCol = col;
        };

        /***
         *
         * @param event
         * @param helper
         * @param tile
         * @param row
         * @param col
         */
        $scope.onOut = function (event, helper, tile, row, col) {
            console.log("onOut tile", tile);
            console.log("row", row);
            console.log("col", col);
        };

        /***
         *
         */
        $scope.startGame = function () {
            $scope.gameState = "start";

            $scope.turn = "white";
        };

        /***
         *
         * @param tile
         */
        $scope.selectFigure = function (tile) {

            $scope.error = "";

            $scope.setDroppableFalse();

            $scope.currentFigure = tile.figure;

            $scope.getDroppableTilesByFigure(tile);

            if ($scope.tilesDroppable.length == 0 && ((tile.figure.color == "white" && $scope.turn == "white") || (tile.figure.color == "black" && $scope.turn == "black"))) {
                $scope.error = "NO move - try other figure";
            }
        };

        /***
         *
         * @param figureName
         * @param from_x
         * @param from_y
         * @param to_x
         * @param to_y
         */
        $scope.checkMovement = function (figureName, from_x, from_y, to_x, to_y) {

        };

        /***
         *
         */
        $scope.setDroppableFalse = function () {
            for (var i = 0; i < $scope.tilesDroppable.length; i++) {
                $scope.Aboard[$scope.lettersDic[$scope.tilesDroppable[i].row]][$scope.tilesDroppable[i].col].droppable = false;
            }

            $scope.tilesDroppable = [];
        };

        /***
         *
         * @param tile
         */
        $scope.getDroppableTilesByFigure = function (tile) {
            switch (tile.figure.name) {
                case "pawn":
                    // Check tile for black figure when it's black turn
                    if (tile.figure.color == "black" && $scope.turn == "black") {

                        // Check if the figure not reached end of board
                        if (tile.row < 8) {
                            // Set tile to droppable
                            $scope.Aboard[$scope.lettersDic[tile.row + 1]][tile.col].droppable = true;
                            // Add tile to droppable tile list.
                            $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row + 1]][tile.col]);
                        }

                        if (tile.figure.fisrtMove) {
                            // Set tile to droppable
                            $scope.Aboard[$scope.lettersDic[tile.row + 2]][tile.col].droppable = true;
                            // Add tile to droppable tile list.
                            $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row + 2]][tile.col]);
                        }
                    }
                    // Check tile for white figure when it's white turn
                    else if (tile.figure.color == "white" && $scope.turn == "white") {
                        console.log($scope.lettersDic[tile.row - 1]);
                        console.log($scope.Aboard[$scope.lettersDic[tile.row - 1]][tile.col]);
                        $scope.Aboard[$scope.lettersDic[tile.row - 1]][tile.col].droppable = true;
                        $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row - 1]][tile.col]);

                        if (tile.figure.fisrtMove) {
                            $scope.Aboard[$scope.lettersDic[tile.row - 2]][tile.col].droppable = true;
                            $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row - 2]][tile.col]);
                        }
                    }
                    break;
                case "knight":
                    if ((tile.figure.color == "white" && $scope.turn == "white") || (tile.figure.color == "black" && $scope.turn == "black")) {

                        $scope.setDroppableTile(tile.row + 1, tile.col + 2, tile.figure.color);

                        $scope.setDroppableTile(tile.row + 1, tile.col - 2, tile.figure.color);

                        $scope.setDroppableTile(tile.row + 2, tile.col + 1, tile.figure.color);

                        $scope.setDroppableTile(tile.row + 2, tile.col - 1, tile.figure.color);

                        $scope.setDroppableTile(tile.row - 2, tile.col + 1, tile.figure.color);

                        $scope.setDroppableTile(tile.row - 2, tile.col - 1, tile.figure.color);

                        $scope.setDroppableTile(tile.row - 1, tile.col + 2, tile.figure.color);

                        $scope.setDroppableTile(tile.row - 1, tile.col - 2, tile.figure.color);
                    }
                    break;

                case "rook":
                    if ((tile.figure.color == "white" && $scope.turn == "white") || (tile.figure.color == "black" && $scope.turn == "black")) {

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 1);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, -1);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 2);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, -2);
                    }
                    break;
                case "bishop":
                    if ((tile.figure.color == "white" && $scope.turn == "white") || (tile.figure.color == "black" && $scope.turn == "black")) {

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 3);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, -3);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 4);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 5);
                    }
                    break;

                case "queen":
                    if ((tile.figure.color == "white" && $scope.turn == "white") || (tile.figure.color == "black" && $scope.turn == "black")) {

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 3);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, -3);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 4);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 5);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 1);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, -1);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, 2);

                        $scope.setDroppableTileFor(tile.row, tile.col, tile.figure.color, -2);
                    }
                    break;

                case "king":
                    if ((tile.figure.color == "white" && $scope.turn == "white") || (tile.figure.color == "black" && $scope.turn == "black")) {
                        // TODO: check palaces that can be eaten by...
                        // Check tile for black figure when it's black turn
                        //    if (tile.figure.color == "black" && $scope.turn == "black") {
                        //
                        //        // Check if the figure not reached end of board
                        //        if (tile.row < 8) {
                        //            // Set tile to droppable
                        //            $scope.Aboard[$scope.lettersDic[tile.row + 1]][tile.col].droppable = true;
                        //            // Add tile to droppable tile list.
                        //            $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row + 1]][tile.col]);
                        //        }
                        //
                        //        if (tile.figure.fisrtMove) {
                        //            // Set tile to droppable
                        //            $scope.Aboard[$scope.lettersDic[tile.row + 2]][tile.col].droppable = true;
                        //            // Add tile to droppable tile list.
                        //            $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row + 2]][tile.col]);
                        //        }
                        //    }
                        //    // Check tile for white figure when it's white turn
                        //    else if (tile.figure.color == "white" && $scope.turn == "white") {
                        //        console.log($scope.lettersDic[tile.row - 1]);
                        //        console.log($scope.Aboard[$scope.lettersDic[tile.row - 1]][tile.col]);
                        //        $scope.Aboard[$scope.lettersDic[tile.row - 1]][tile.col].droppable = true;
                        //        $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row - 1]][tile.col]);
                        //
                        //        if (tile.figure.fisrtMove) {
                        //            $scope.Aboard[$scope.lettersDic[tile.row - 2]][tile.col].droppable = true;
                        //            $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[tile.row - 2]][tile.col]);
                        //        }
                        //    }
                        //    break;
                    }
                    break;
            }
        };

        /***
         *
         * @param row
         * @param col
         * @param figureColor
         */
        $scope.setDroppableTile = function (row, col, figureColor) {
            if (row <= 8 && row > 0 && col <= 8 && col > 0 &&
                (($scope.Aboard[$scope.lettersDic[row]][col].figure != null &&
                $scope.Aboard[$scope.lettersDic[row]][col].figure.color != figureColor) ||
                $scope.Aboard[$scope.lettersDic[row]][col].figure == null)) {

                // Set tile to droppable
                $scope.Aboard[$scope.lettersDic[row]][col].droppable = true;
                // Add tile to droppable tile list.
                $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[row]][col]);
            }
        };

        /***
         *
         * @param row
         * @param col
         * @param figureColor
         * @param option - 1 rows get +i , -1 rows get -i ,2 cols get i ,-2 cols get -i, 3 both get i, -3 both get -i , 4 cols gets i and rows get -i , 5 cols gets -i and rows gets i
         */
        $scope.setDroppableTileFor = function (or_row, or_col, figureColor, option) {

            console.log("original row:" + or_row + "col:" + or_col + "option:" + option);
            var col, row;
            for (var i = 1; i < 8; i++) {
                row = (option == 1 || option == 3 || option == 5) ? or_row + i : or_row;

                col = (option == 2 || option == 3 || option == 4) ? Number(or_col) + Number(i) : or_col;

                row = (option == Number(-1) || option == Number(-3) || option == 4) ? or_row - i : row;

                col = (option == Number(-2) || option == Number(-3) || option == 5) ? or_col - i : col;


                console.log("row:" + row + "col:" + col + "index:" + i);
                if (row <= 8 && row > 0 && col <= 8 && col > 0 &&
                    (($scope.Aboard[$scope.lettersDic[row]][col].figure != null &&
                    $scope.Aboard[$scope.lettersDic[row]][col].figure.color != figureColor) ||
                    $scope.Aboard[$scope.lettersDic[row]][col].figure == null)) {

                    // Set tile to droppable
                    $scope.Aboard[$scope.lettersDic[row]][col].droppable = true;

                    // Add tile to droppable tile list.
                    $scope.tilesDroppable.push($scope.Aboard[$scope.lettersDic[row]][col]);

                    if ($scope.Aboard[$scope.lettersDic[row]][col].figure != null) {
                        console.log("break1");
                        break;
                    }
                }
                else if (row <= 8 && row > 0 && col <= 8 && col > 0 && $scope.Aboard[$scope.lettersDic[row]][col].figure != null) {
                    console.log("break2", $scope.Aboard[$scope.lettersDic[row]][col].figure);
                    break;
                }
                else if (row > 8 || row <= 0 || col > 8 || col <= 0) {
                    console.log("break3");
                    break;
                }
            }
        };

        $scope.init();

    }
]);
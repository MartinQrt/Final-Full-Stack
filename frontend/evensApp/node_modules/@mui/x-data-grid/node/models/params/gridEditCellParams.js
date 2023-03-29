"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridCellEditStopReasons = exports.GridCellEditStartReasons = void 0;
/**
 * Params passed to `apiRef.current.setEditCellValue`.
 */
var GridCellEditStartReasons = /*#__PURE__*/function (GridCellEditStartReasons) {
  GridCellEditStartReasons["enterKeyDown"] = "enterKeyDown";
  GridCellEditStartReasons["cellDoubleClick"] = "cellDoubleClick";
  GridCellEditStartReasons["printableKeyDown"] = "printableKeyDown";
  GridCellEditStartReasons["deleteKeyDown"] = "deleteKeyDown";
  return GridCellEditStartReasons;
}(GridCellEditStartReasons || {});
/**
 * Params passed to the `cellEditStart` event.
 */
exports.GridCellEditStartReasons = GridCellEditStartReasons;
var GridCellEditStopReasons = /*#__PURE__*/function (GridCellEditStopReasons) {
  GridCellEditStopReasons["cellFocusOut"] = "cellFocusOut";
  GridCellEditStopReasons["escapeKeyDown"] = "escapeKeyDown";
  GridCellEditStopReasons["enterKeyDown"] = "enterKeyDown";
  GridCellEditStopReasons["tabKeyDown"] = "tabKeyDown";
  GridCellEditStopReasons["shiftTabKeyDown"] = "shiftTabKeyDown";
  return GridCellEditStopReasons;
}(GridCellEditStopReasons || {});
/**
 * Params passed to the `cellEditStop event.
 */
exports.GridCellEditStopReasons = GridCellEditStopReasons;
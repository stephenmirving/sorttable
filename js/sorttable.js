// @ts-check

/**
 * @file sorttable.js
 * @fileoverview Link this file at the bottom of the body of any HTML page that
 * contains one or more tables to make those tables sortable. Works along with
 * styles found in css/main.css to apply visual indication for the sorting.
 * @version 1.1.5 08/07/19
 * @author Stephen M Irving
 **/

function sortTable(tableClass, parent) {
  parent = document.getElementById(parent) || document.body;

  const table =
    typeof tableClass !== 'undefined'
      ? parent.getElementsByClassName(tableClass)
      : parent.getElementsByTagName('table');

  let numTables = table.length;

  // Run through every table on the page and make them all sortable
  while (--numTables >= 0) {
    makeSortable(table[numTables]);
  }

  /**
   * @name fixComparison
   * @description Fixes values for comparison in sortTable
   *
   * @param {string} a - First item being compared
   * @param {string} b - Second item being compared
   * @return {string[]} The adjusted a and b fixed for comparison
   */
  function fixComparison(a, b) {
    let diff;

    if (a.length !== b.length) {
      if (a.length > b.length) {
        diff = a.length - b.length;
        for (let i = 0; i < diff; i++) {
          b = '0' + b;
        }
      } else {
        diff = b.length - a.length;
        for (let i = 0; i < diff; i++) {
          a = '0' + a;
        }
      }
    }

    return [a, b];
  }

  /**
   * @name stripCommas
   * @description Takes a string of a number with commas in it and strips the
   * commas out of the string, returning the number value.
   *
   * @param {string} x - A string representing a number that is displayed with
   * commas
   *
   * @return {number} The number value of the string with the commas
   * stripped
   */
  function stripCommas(x) {
    return (x + '').replace(/\,/g, '') * 1;
  }

  /**
   * @name sortTable
   * @description Takes a given table and column, as well as whether or not the
   * column has already been reversed, as input, and then sorts the table column
   *
   * @param {HTMLElement} table
   * @param {HTMLElement} col
   * @param {Number} reverse - 1 for true 0 for false
   * @todo Refactor logic for optimization & implement a datetime sorting solution
   */
  function sortTable(table, col, reverse) {
    const TABLE_BODY = table.tBodies[0]; // ignore `<thead>` and `<tfoot>` rows
    const IS_NUM = /^[0-9]*\.?[0-9]+$/;

    // Put rows into an array
    let tableRows = Array.prototype.slice.call(TABLE_BODY.rows, 0);

    reverse = -(+reverse || -1);

    tableRows = tableRows.sort((a, b) => {
      // Sort rows
      let tempA = a.cells[col].textContent.trim(),
          tempB = b.cells[col].textContent.trim();

      if (tempA.slice(-1) === '%' || tempB.slice(-1) === '%') {
        if (tempA.slice(-1) === '%') {
          tempA = tempA.slice(0, tempA.length - 1);
        }
        if (tempB.slice(-1) === '%') {
          tempB = tempB.slice(0, tempB.length - 1);
        }
        [tempA, tempB] = fixComparison(tempA, tempB);
      } else if (tempA.substr(0, 1) === '$' || tempB.substr(0, 1) === '$') {
        if (tempA.substr(0, 1) === '$') {
          tempA = tempA.slice(1, tempA.length);
        }
        if (tempB.substr(0, 1) === '$') {
          tempB = tempB.slice(1, tempB.length);
        }
        [tempA, tempB] = fixComparison(tempA, tempB);
      } else if (
        IS_NUM.test(stripCommas(tempA)) ||
        IS_NUM.test(stripCommas(tempB))
      ) {
        if (IS_NUM.test(stripCommas(tempA))) {
          tempA = stripCommas(tempA) + '';
        }
        if (IS_NUM.test(stripCommas(tempB))) {
          tempB = stripCommas(tempB) + '';
        }
        [tempA, tempB] = fixComparison(tempA, tempB);
      }

      return reverse * tempA.localeCompare(tempB);
    });

    const numTableRows = tableRows.length;

    for (let rowIndex = 0; rowIndex < numTableRows; ++rowIndex) {
      TABLE_BODY.appendChild(tableRows[rowIndex]); // append each row in order
    }
  }

  /**
   * @name makeSortable
   * @description Makes a table sortable
   *
   * @param {HTMLElement} table - The table being sorted
   */
  function makeSortable(table) {
    let tableHead = table.tHead,
        tableHeadIndex;

    tableHead &&
      (tableHead = tableHead.rows[0]) &&
      (tableHead = tableHead.cells);

    if (tableHead) {
      tableHeadIndex = tableHead.length;
    } else {
      return; // if no `<thead>` then do nothing
    }

    while (--tableHeadIndex >= 0) {
      (function (tableHeadIndex) {
        let dir = 1;
        tableHead[tableHeadIndex].addEventListener('click', function () {
          sortTable(table, tableHeadIndex, (dir = 1 - dir));
        });
      })(tableHeadIndex);
    }
  }
}

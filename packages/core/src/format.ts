/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Match } from "./match.ts";
import type { InteractorOptions } from "./specification.ts";

export interface TableOptions {
  headers: string[];
  rows: string[][];
}

const MAX_COLUMN_WIDTH = 40

function formatValue(value: string, width: number) {
  if(value.length > width) {
    return value.slice(0, width - 1) + '…';
  } else {
    return value.padEnd(width);
  }
}

export function formatTable(options: TableOptions): string {
  let columnWidths = options.headers.map((h, index) => {
    return Math.min(MAX_COLUMN_WIDTH, Math.max(h.length, ...options.rows.map((r) => r[index].length)));
  });

  let formatRow = (cells: string[]) => {
    return '┃ ' + cells.map((c, index) => formatValue(c, columnWidths[index])).join(' ┃ ') + ' ┃';
  }

  let spacerRow = () => {
    return '┣━' + columnWidths.map((w) => "━".repeat(w)).join('━╋━') + '━┫';
  }

  return [
    formatRow(options.headers),
    spacerRow(),
    ...options.rows.map((row) => formatRow(row))
  ].join('\n');
}

function ownDescription(options: InteractorOptions<any, any, any>): string {
  if(options.locator) {
    return `${options.name} ${options.locator.description} ${options.filter.description}`.trim();
  } else {
    return `${options.name} ${options.filter.description}`.trim();
  }
}

export function formatDescription(options: InteractorOptions<any, any, any>): string {
  let ancestorsAndSelf: InteractorOptions<any, any, any>[] = options.ancestors.concat(options);
  return ancestorsAndSelf.reverse().map(ownDescription).join(' within ');
}

export function formatMatchesTable(interactor: InteractorOptions<any, any, any>, matches: Match<Element, any>[]): string {
  return formatTable({
    headers: interactor.locator ? [interactor.name, ...interactor.filter.asTableHeader()] : interactor.filter.asTableHeader(),
    rows: matches.slice().sort((a, b) => b.sortWeight - a.sortWeight).map((m) => m.asTableRow()),
  })
}

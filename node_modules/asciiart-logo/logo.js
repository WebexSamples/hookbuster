'use strict';

const figlet = require('figlet');
const toTitleCase = require('to-title-case');
const chalk = require('chalk');

module.exports = options => {
  const {
    name,
    version,
    description,
    font,
    padding,
    margin,
    lineChars,
    borderColor,
    logoColor,
    textColor,
  } = options;

  const colorizer = (style) => {
    if (!style) {
      return text => text;
    }
    const fragments = style.split('-');
    const bold = fragments.length > 1 && fragments[0] === 'bold';
    const color = fragments.length > 1 ? fragments[1] : fragments[0];

    if (color) {
      return bold ? chalk.keyword(color).bold : chalk.keyword(color);
    } else {
      return text => text;
    }
  }

  const textToLines = (text, desiredLen, fixed) => {
    const maxLen = lines => (fixed || !lines.length) ? desiredLen :
      lines.reduce((r, x) => Math.max(r, x.length), desiredLen);
    return text.split(/\s+/g).reduce((lines, word) => {
      if (lines.length && lines[lines.length - 1].length + word.length < maxLen(lines)) {
        lines[lines.length - 1] = `${lines[lines.length - 1]} ${word}`;
      } else {
        lines.push(word);
      }
      return lines;
    }, []);
  }

  const logoTextArray = textToLines(toTitleCase(name), lineChars || 15);

  const logoLines = logoTextArray.reduce((result, line) => {
    return result.concat( figlet.textSync(line, { font: font }).split('\n') );
  }, []);

  let panelTextWidth = Math.max(30, logoLines.reduce((len, line) => line.length > len ? line.length : len, 0));

  const horizMargin = (margin === undefined) ? 2 : margin;
  const vertMargin = horizMargin / 2 | 0;
  const horizSpace = (padding === undefined) ? 2 : padding;
  const vertSpace = horizSpace / 2 | 0;
  const horizMarginText = horizMargin ? ' '.repeat(horizMargin) : '';

  const frameTop = colorizer(borderColor)
    (`${horizMarginText},${'-'.repeat(panelTextWidth + 2 * horizSpace)}.`);
  const frameBottom = colorizer(borderColor)
    (`${horizMarginText}\`${'-'.repeat(panelTextWidth + 2 * horizSpace)}'`);

  const _render = (style, line, leftSpaces, rightSpaces) => {
    const leftPadding = leftSpaces ? ' '.repeat(leftSpaces)  : '';
    const rightPadding = rightSpaces ? ' '.repeat(rightSpaces)  : '';
    const border = colorizer(borderColor)('|');
    const contentColor = colorizer(style);
    return `${horizMarginText}${border}${leftPadding}${contentColor(line)}${rightPadding}${border}`;
  };

  const emptyLine = _render(textColor, ' '.repeat(panelTextWidth), horizSpace, horizSpace);

  const spaceLines = vertSpace ? Array(vertSpace).fill(emptyLine) : [];
  const marginLines = vertMargin ? Array(vertMargin).fill('') : [];

  const lineLeft = (style, line) => _render(style, line, horizSpace, panelTextWidth - line.length + horizSpace)
  const lineRight = (style, line) => _render(style, line, panelTextWidth - line.length + horizSpace, horizSpace);
  const lineCenter = (style, line) => {
    const space = (panelTextWidth - line.length);
    const left = space / 2 | 0;
    const right = space - left;
    return _render(style, line, left + horizSpace, right + horizSpace);
  };

  const wordWrap = (style, text, align) => textToLines(text, panelTextWidth, true)
    .map(line =>
        (align === 'RIGHT') ? lineRight(style, line) :
        (align === 'CENTER') ? lineCenter(style, line) :
        lineLeft(style, line));

  let content = [].concat(logoLines.map(line => lineLeft(logoColor, line)));

  const _addLines = (lines, context) => {
    content = [].concat(content, lines);
    return context;
  }

  if (version) {
    _addLines([emptyLine, lineRight(textColor, `version ${version}`), emptyLine]);
  }
  if (description) {
    _addLines(wordWrap(textColor, description));
  }

  const api = {
    left: text => _addLines(wordWrap(textColor, text, 'LEFT'), api),
    right: text => _addLines(wordWrap(textColor, text, 'RIGHT'), api),
    center: text => _addLines(wordWrap(textColor, text, 'CENTER'), api),
    wrap: text => _addLines(wordWrap(textColor, text), api),
    emptyLine: () => _addLines([emptyLine], api),
    emptyLines: count => _addLines(Array(count || 1).fill(emptyLine), api),
    render: () => [].concat(marginLines, frameTop, spaceLines, content, spaceLines, frameBottom, marginLines).join('\n')
  };

  return api;
};

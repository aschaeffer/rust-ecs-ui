function styleToString (style) {
  if (style !== undefined && style !== null) {
    return Object.keys(style).reduce((acc, key) => (
      acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
    ), '');
  } else {
    return ''
  }
}

export default {
  styleToString
}

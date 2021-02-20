// TODO: Use JSON-Enum

function getDataTypeShort (dataType) {
  try {
    switch (dataType.toLowerCase()) {
      case 'bool':
        return 'B'
      case 'string':
        return 'S'
      case 'number':
        return 'N'
      case 'array':
        return 'A'
      case 'object':
        return 'O'
      case 'any':
        return '*'
      default:
        return '?'
    }
  } catch (err) {
    return '?'
  }
}

function getDataTypeDefault (dataType) {
  try {
    switch (dataType.toLowerCase()) {
      case 'bool':
        return false
      case 'string':
        return ''
      case 'number':
        return '0'
      case 'array':
        return []
      case 'object':
        return {}
      case 'any':
        return ''
      default:
        return ''
    }
  } catch (err) {
    return ''
  }
}

function getDataTypeColor (dataType) {
  try {
    switch (dataType.toLowerCase()) {
      case 'bool':
        return 'rgb(255, 0, 255)'
      case 'string':
        return 'rgb(255, 140, 0)'
      case 'number':
        return 'rgb(70, 30, 180)'
      case 'array':
        return 'rgb(240, 128, 128)'
      case 'object':
        return 'rgb(106, 90, 205)'
      case 'any':
        return 'rgb(0, 0, 0)'
      default:
        return 'rgb(0, 0, 0)'
    }
  } catch (err) {
    return ''
  }
}

function getDataTypeColorOpaque (dataType, opacity) {
  try {
    switch (dataType.toLowerCase()) {
      case 'bool':
        return `rgba(255, 0, 255, ${opacity})`
      case 'string':
        return `rgba(255, 140, 0, ${opacity})`
      case 'number':
        return `rgba(70, 30, 180, ${opacity})`
      case 'array':
        return `rgba(240, 128, 128, ${opacity})`
      case 'object':
        return `rgba(106, 90, 205, ${opacity})`
      case 'any':
        return `rgba(0, 0, 0, ${opacity})`
      default:
        return `rgba(0, 0, 0, ${opacity})`
    }
  } catch (err) {
    return ''
  }
}

function convertValue (dataType, value) {
  try {
    switch (dataType.toLowerCase()) {
      case 'bool':
        return value ? '✅' : '❌'
      case 'string':
        return (value.length > 10) ? value.substr(0, 9) + '&hellip;' : value
      case 'number':
        return value.toString()
      case 'array':
        return '[]'
      case 'object':
        return '{}'
      case 'any':
        return value.toString()
      default:
        return '?'
    }
  } catch (err) {
    return '?'
  }
}

function  isBool (dataType) {
  return dataType.toLowerCase() === 'bool'
}

export default {
  getDataTypeShort,
  getDataTypeDefault,
  getDataTypeColor,
  getDataTypeColorOpaque,
  convertValue,
  isBool
}

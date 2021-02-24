export default function SymbolManager() {
  this.symbols = []

  // Currently mocks / static components
  this.importAllSymbols(require.context('!raw-loader!../../public/symbols/', true, /\.svg$/))
  // console.log(Object.keys(this.symbols))
}

SymbolManager.$inject = []

SymbolManager.prototype.importAllSymbols = function (r) {
  r.keys().forEach((key) => {
    this.symbols[key] = r(key).default
  })
}

SymbolManager.prototype.getSymbols = function () {
  return this.symbols
}

SymbolManager.prototype.getSymbol = function (name) {
  if (Object.getOwnPropertyDescriptor(this.symbols, name)) {
    return this.symbols[name]
  } else {
    return ''
  }
}
